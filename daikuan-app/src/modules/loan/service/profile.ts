import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LoanProfileEntity } from '../entity/profile';
import { LoanMediaEntity } from '../entity/media';
import { LoanBankEntity } from '../entity/bank';

const ID_CARD_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const ID_CARD_CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

function isValidChineseIdCard(value: string) {
  const idCardNo = value.trim().toUpperCase();
  if (!/^\d{17}[\dX]$/.test(idCardNo) || idCardNo.startsWith('00')) return false;
  const birth = idCardNo.slice(6, 14);
  const year = Number(birth.slice(0, 4));
  const month = Number(birth.slice(4, 6));
  const day = Number(birth.slice(6, 8));
  const birthDate = new Date(year, month - 1, day);
  if (
    year < 1800 ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > new Date()
  ) return false;
  const sum = ID_CARD_WEIGHTS.reduce(
    (total, weight, index) => total + Number(idCardNo[index]) * weight,
    0
  );
  return ID_CARD_CHECK_CODES[sum % 11] === idCardNo[17];
}

export const REQUIRED_PROFILE_STEPS = [
  'iou',
  'income',
  'debt',
  'identity',
  'face',
  'personal',
  'contact',
  'bank',
];

@Provide()
export class LoanProfileService extends BaseService {
  @InjectEntityModel(LoanProfileEntity)
  profileRepo: Repository<LoanProfileEntity>;

  @InjectEntityModel(LoanMediaEntity)
  mediaRepo: Repository<LoanMediaEntity>;

  @InjectEntityModel(LoanBankEntity)
  bankRepo: Repository<LoanBankEntity>;

  async get(userId: number) {
    return (
      (await this.profileRepo.findOneBy({ userId })) || {
        userId,
        completed: [],
      }
    );
  }

  async saveProfile(userId: number, body: Partial<LoanProfileEntity>) {
    const allowed = [
      'realName',
      'idCardNo',
      'job',
      'income',
      'address',
      'contacts',
      'bankName',
      'bankCode',
      'bankCardNo',
    ];
    const data = Object.fromEntries(
      allowed
        .filter(key => body[key] !== undefined)
        .map(key => [key, body[key]])
    );
    const current = await this.profileRepo.findOneBy({ userId });
    return this.profileRepo.save({ ...(current || {}), ...data, userId });
  }

  async saveStep(userId: number, step: string, data: any = {}) {
    if (!REQUIRED_PROFILE_STEPS.includes(step)) {
      throw new CoolCommException('资料步骤不正确');
    }
    const current: any = await this.get(userId);
    const patch: Partial<LoanProfileEntity> = {};
    if (['iou', 'income', 'debt'].includes(step)) {
      const count = await this.mediaRepo.countBy({
        userId,
        purpose: step,
        status: 1,
      });
      if (!count) throw new CoolCommException('请先上传申请材料');
    } else if (step === 'identity') {
      if (!String(data.realName || '').trim())
        throw new CoolCommException('请输入真实姓名');
      if (!isValidChineseIdCard(String(data.idCardNo || ''))) {
        throw new CoolCommException('请输入正确的身份证号');
      }
      const media = await this.mediaRepo.find({
        where: [
          { userId, purpose: 'id_card_front', status: 1 },
          { userId, purpose: 'id_card_back', status: 1 },
        ],
      });
      if (new Set(media.map(item => item.purpose)).size < 2) {
        throw new CoolCommException('请上传身份证人像面和国徽面');
      }
      patch.realName = String(data.realName).trim();
      patch.idCardNo = String(data.idCardNo).toUpperCase();
    } else if (step === 'personal') {
      if (
        ![data.job, data.income, data.address].every(value =>
          String(value || '').trim()
        )
      ) {
        throw new CoolCommException('请完整填写工作、收入和居住信息');
      }
      Object.assign(patch, {
        job: data.job,
        income: data.income,
        address: data.address,
      });
    } else if (step === 'contact') {
      if (!Array.isArray(data.contacts) || data.contacts.length < 3) {
        throw new CoolCommException('请填写1位亲属和2位朋友');
      }
      if (
        data.contacts.some(
          item => !item.name || !/^1\d{10}$/.test(item.phone || '')
        )
      ) {
        throw new CoolCommException('请填写正确的联系人姓名和手机号');
      }
      patch.contacts = data.contacts.slice(0, 3);
    } else if (step === 'bank') {
      const requestedBankCode = String(data.bankCode || '');
      const customBankName = String(data.bankName || '').trim();
      const bank = requestedBankCode === 'CUSTOM' ? null : await this.bankRepo.findOneBy({
        code: requestedBankCode,
        status: 1,
      });
      if (
        (!bank && !(requestedBankCode === 'CUSTOM' && customBankName)) ||
        !/^\d{12,24}$/.test(String(data.bankCardNo || ''))
      ) {
        throw new CoolCommException('请填写正确的开户银行和银行卡号');
      }
      patch.bankCode = bank?.code || 'CUSTOM';
      patch.bankName = bank?.name || customBankName;
      patch.bankCardNo = String(data.bankCardNo);
    }
    const completed = Array.from(new Set([...(current.completed || []), step]));
    return this.profileRepo.save({ ...current, ...patch, completed, userId });
  }

  async assertComplete(userId: number) {
    const profile: any = await this.get(userId);
    const missing = REQUIRED_PROFILE_STEPS.filter(
      step => !(profile.completed || []).includes(step)
    );
    if (missing.length) throw new CoolCommException('请先完善全部申请资料');
    return profile;
  }
}

import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { LoanApplicationEntity } from '../entity/application';
import { LoanReviewLogEntity } from '../entity/review-log';
import { LoanProfileService } from './profile';
import { LoanProfileEntity } from '../entity/profile';
import { LoanMediaEntity } from '../entity/media';
import { UserInfoEntity } from '../../user/entity/info';
import { Inject } from '@midwayjs/core';
import { LoanCreditService } from './credit';
import { LoanAgreementEntity } from '../entity/agreement';
import { LoanAgreementSignEntity } from '../entity/agreement-sign';
import { LoanNotificationEntity } from '../entity/notification';

const statuses = [
  'draft',
  'manual',
  'phone',
  'funding',
  'approved',
  'rejected',
  'cancelled',
];
const reviewTransitions = {
  manual: ['phone', 'rejected', 'cancelled'],
  phone: ['funding', 'rejected', 'cancelled'],
  funding: ['approved', 'rejected', 'cancelled'],
};

@Provide()
export class LoanApplicationService extends BaseService {
  @Inject()
  loanProfileService: LoanProfileService;
  @Inject()
  loanCreditService: LoanCreditService;
  @InjectEntityModel(LoanApplicationEntity)
  applicationRepo: Repository<LoanApplicationEntity>;
  @InjectEntityModel(LoanReviewLogEntity)
  reviewRepo: Repository<LoanReviewLogEntity>;
  @InjectEntityModel(LoanAgreementEntity)
  agreementRepo: Repository<LoanAgreementEntity>;
  @InjectEntityModel(LoanAgreementSignEntity)
  agreementSignRepo: Repository<LoanAgreementSignEntity>;
  @InjectEntityModel(LoanNotificationEntity)
  notificationRepo: Repository<LoanNotificationEntity>;

  async current(userId: number) {
    const application = await this.applicationRepo.findOne({
      where: { userId },
      order: { id: 'DESC' },
    });
    if (!application) return null;
    const reviewLogs = await this.reviewRepo.find({
      where: { applicationId: application.id },
      order: { id: 'ASC' },
    });
    return { ...application, reviewLogs };
  }

  async mine(userId: number) {
    return this.applicationRepo.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async mineInfo(userId: number, id: number) {
    const application = await this.applicationRepo.findOneBy({ id, userId });
    if (!application) throw new CoolCommException('申请不存在');
    const reviewLogs = await this.reviewRepo.find({
      where: { applicationId: id },
      order: { id: 'ASC' },
    });
    return { ...application, reviewLogs };
  }

  async saveDraft(userId: number, body: Partial<LoanApplicationEntity>) {
    const active = await this.applicationRepo.findOne({
      where: [
        { userId, status: 'manual' },
        { userId, status: 'phone' },
        { userId, status: 'funding' },
      ],
      order: { id: 'DESC' },
    });
    if (active) throw new CoolCommException('您有正在审核的申请，请勿重复提交');
    let application = await this.applicationRepo.findOne({
      where: { userId, status: 'draft' },
      order: { id: 'DESC' },
    });
    const allowed = ['amount', 'term', 'purpose', 'bankName', 'bankCardNo'];
    const data = Object.fromEntries(
      allowed
        .filter(key => body[key] !== undefined)
        .map(key => [key, body[key]])
    );
    const credit = await this.loanCreditService.getOrCreate(userId);
    const amount = Number(data.amount);
    if (
      !Number.isInteger(amount) ||
      amount < credit.minLoanAmount ||
      amount > credit.availableLimit ||
      (amount - credit.minLoanAmount) % credit.amountStep !== 0
    ) {
      throw new CoolCommException(
        `申请金额应在${credit.minLoanAmount}至${credit.availableLimit}元之间`
      );
    }
    if (!credit.terms.includes(Number(data.term)))
      throw new CoolCommException('请选择正确的借款期数');
    data.amount = amount;
    data.annualRate = credit.annualRate;
    const applicationData = { ...data, annualRate: credit.annualRate };
    if (!application) {
      application = this.applicationRepo.create({
        userId,
        status: 'draft',
        applicationNo: `KD${moment().format('YYYYMMDDHHmmss')}${userId}`,
        ...applicationData,
      });
    } else Object.assign(application, applicationData);
    return this.applicationRepo.save(application);
  }

  async submit(userId: number, id: number, agreementIds: number[]) {
    const application = await this.applicationRepo.findOneBy({ id, userId });
    if (!application || application.status !== 'draft')
      throw new CoolCommException('申请不存在或已提交');
    const agreements = await this.agreementRepo.find({
      where: { status: 1 },
      order: { orderNum: 'ASC', id: 'ASC' },
    });
    const submittedIds = new Set(
      Array.isArray(agreementIds) ? agreementIds.map(Number) : []
    );
    if (
      agreements.length !== 3 ||
      agreements.some(agreement => !submittedIds.has(agreement.id))
    ) {
      throw new CoolCommException('请阅读并同意全部三份合同');
    }
    const profile = await this.loanProfileService.assertComplete(userId);
    application.bankName = profile.bankName;
    application.bankCardNo = profile.bankCardNo;
    application.status = 'manual';
    application.submittedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    await this.applicationRepo.save(application);
    await this.agreementSignRepo.delete({ applicationId: id, userId });
    await this.agreementSignRepo.save(
      agreements.map(agreement => ({
        userId,
        applicationId: id,
        agreementId: agreement.id,
        agreementCode: agreement.code,
        title: agreement.title,
        version: agreement.version,
        contentSnapshot: agreement.content,
        agreedAt: new Date(),
      }))
    );
    await this.reviewRepo.save({
      applicationId: id,
      fromStatus: 'draft',
      toStatus: 'manual',
      remark: '用户提交申请',
    });
    await this.notificationRepo.save({
      userId,
      type: 'review',
      title: '借款申请已提交',
      content: `您的借款申请 ${application.applicationNo} 已提交，工作人员将尽快审核。`,
      link: `/application/${application.id}`,
    });
    return this.current(userId);
  }

  async detail(id: number) {
    const application = await this.applicationRepo.findOneBy({ id });
    if (!application) throw new CoolCommException('申请不存在');
    const manager = this.getOrmManager();
    const [user, profile, media, reviewLogs] = await Promise.all([
      manager
        .getRepository(UserInfoEntity)
        .findOneBy({ id: application.userId }),
      manager
        .getRepository(LoanProfileEntity)
        .findOneBy({ userId: application.userId }),
      manager.getRepository(LoanMediaEntity).find({
        where: { userId: application.userId, status: 1 },
        order: { id: 'DESC' },
      }),
      this.reviewRepo.find({
        where: { applicationId: id },
        order: { id: 'ASC' },
      }),
    ]);
    return { application, user, profile, media, reviewLogs };
  }

  async review(
    id: number,
    status: string,
    remark: string,
    operatorId?: number
  ) {
    if (!statuses.includes(status) || status === 'draft')
      throw new CoolCommException('审核状态不正确');
    return this.getOrmManager().transaction(async manager => {
      const repo = manager.getRepository(LoanApplicationEntity);
      const application = await repo.findOneBy({ id });
      if (!application) throw new CoolCommException('申请不存在');
      const fromStatus = application.status;
      if (!reviewTransitions[fromStatus]?.includes(status)) {
        throw new CoolCommException('当前申请状态不允许执行此操作');
      }
      application.status = status;
      application.reviewRemark = remark;
      await repo.save(application);
      await manager.getRepository(LoanReviewLogEntity).save({
        applicationId: id,
        fromStatus,
        toStatus: status,
        remark,
        operatorId,
      });
      const copy = {
        phone: ['申请已通过初审', '您的申请已进入电话核验，请保持手机畅通。'],
        funding: ['申请进入放款审核', '您的申请资料已核验，正在进行最终放款审核。'],
        approved: ['借款申请审核通过', '您的借款申请已审核通过，请在我的借款中查看详情。'],
        rejected: ['借款申请未通过', remark || '您的借款申请暂未通过审核。'],
        cancelled: ['借款申请已取消', remark || '您的借款申请已取消。'],
      }[status] || ['申请状态已更新', remark || '您的借款申请状态已更新。'];
      await manager.getRepository(LoanNotificationEntity).save({
        userId: application.userId,
        type: 'review',
        title: copy[0],
        content: copy[1],
        link: `/application/${application.id}`,
      });
      return application;
    });
  }
}

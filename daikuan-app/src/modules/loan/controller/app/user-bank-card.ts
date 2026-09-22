import { BaseController, CoolController, CoolCommException } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LoanUserBankCardEntity } from '../../entity/user-bank-card';
import { LoanProfileService } from '../../service/profile';

@CoolController()
export class AppLoanUserBankCardController extends BaseController {
  @Inject() ctx;
  @Inject() loanProfileService: LoanProfileService;
  @InjectEntityModel(LoanUserBankCardEntity) cardRepo: Repository<LoanUserBankCardEntity>;

  @Get('/list', { summary: '我的银行卡' })
  async list() {
    const cards = await this.cardRepo.find({ where: { userId: this.ctx.user.id, status: 1 }, order: { isDefault: 'DESC', id: 'DESC' } });
    return this.ok(cards.map(({ cardNo, ...card }) => ({ ...card, cardNo: `${cardNo.slice(0, 4)} **** **** ${cardNo.slice(-4)}` })));
  }

  @Post('/save', { summary: '绑定本人银行卡' })
  async save(@Body() body) {
    const profile = await this.loanProfileService.saveStep(this.ctx.user.id, 'bank', body);
    const cardNo = String(profile.bankCardNo);
    let card = await this.cardRepo.findOneBy({ userId: this.ctx.user.id, cardNo });
    if (!card) {
      const count = await this.cardRepo.countBy({ userId: this.ctx.user.id, status: 1 });
      card = await this.cardRepo.save({ userId: this.ctx.user.id, bankCode: profile.bankCode, bankName: profile.bankName, cardNo, lastFour: cardNo.slice(-4), isDefault: count ? 0 : 1, status: 1 });
    } else if (!card.status) {
      card.status = 1;
      card = await this.cardRepo.save(card);
    }
    return this.ok(card);
  }

  @Post('/default', { summary: '设置默认银行卡' })
  async setDefault(@Body('id') id: number) {
    const card = await this.cardRepo.findOneBy({ id: Number(id), userId: this.ctx.user.id, status: 1 });
    if (!card) throw new CoolCommException('银行卡不存在');
    await this.cardRepo.update({ userId: this.ctx.user.id }, { isDefault: 0 });
    await this.cardRepo.update(card.id, { isDefault: 1 });
    await this.loanProfileService.saveProfile(this.ctx.user.id, { bankCode: card.bankCode, bankName: card.bankName, bankCardNo: card.cardNo });
    return this.ok();
  }

  @Post('/remove', { summary: '解绑银行卡' })
  async remove(@Body('id') id: number) {
    const card = await this.cardRepo.findOneBy({ id: Number(id), userId: this.ctx.user.id, status: 1 });
    if (!card) throw new CoolCommException('银行卡不存在');
    await this.cardRepo.update(card.id, { status: 0, isDefault: 0 });
    if (card.isDefault) {
      const next = await this.cardRepo.findOne({ where: { userId: this.ctx.user.id, status: 1 }, order: { id: 'DESC' } });
      if (next) {
        await this.cardRepo.update(next.id, { isDefault: 1 });
        await this.loanProfileService.saveProfile(this.ctx.user.id, { bankCode: next.bankCode, bankName: next.bankName, bankCardNo: next.cardNo });
      }
    }
    return this.ok();
  }
}

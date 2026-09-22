import { BaseService, CoolCommException } from '@cool-midway/core';
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';
import { LoanCreditConfigEntity } from '../entity/credit-config';
import { LoanUserCreditEntity } from '../entity/user-credit';

@Provide()
export class LoanCreditService extends BaseService {
  @InjectEntityModel(LoanCreditConfigEntity)
  configRepo: Repository<LoanCreditConfigEntity>;

  @InjectEntityModel(LoanUserCreditEntity)
  creditRepo: Repository<LoanUserCreditEntity>;

  async getConfig() {
    const config = await this.configRepo.findOne({
      where: { status: 1 },
      order: { id: 'ASC' },
    });
    if (!config) throw new CoolCommException('借款额度配置暂不可用');
    const minCredit = Math.max(1, Number(config.minCredit));
    const maxCredit = Math.max(minCredit, Number(config.maxCredit));
    return {
      ...config,
      minCredit,
      maxCredit,
      minLoanAmount: Math.max(1, Number(config.minLoanAmount)),
      amountStep: Math.max(1, Number(config.amountStep)),
      annualRate: Number(config.annualRate),
      terms: (config.terms || []).map(Number).filter(term => term > 0),
    };
  }

  async getOrCreate(userId: number) {
    const existing = await this.creditRepo.findOneBy({ userId });
    const config = await this.getConfig();
    if (existing) return this.toResult(existing.creditLimit, config);

    const creditLimit = randomInt(config.minCredit, config.maxCredit + 1);
    try {
      const credit = await this.creditRepo.save({ userId, creditLimit });
      return this.toResult(credit.creditLimit, config);
    } catch (error) {
      const credit = await this.creditRepo.findOneBy({ userId });
      if (!credit) throw error;
      return this.toResult(credit.creditLimit, config);
    }
  }

  private toResult(creditLimit: number, config: Awaited<ReturnType<LoanCreditService['getConfig']>>) {
    return {
      creditLimit: Number(creditLimit),
      availableLimit: Number(creditLimit),
      minLoanAmount: config.minLoanAmount,
      amountStep: config.amountStep,
      annualRate: config.annualRate,
      terms: config.terms,
    };
  }
}

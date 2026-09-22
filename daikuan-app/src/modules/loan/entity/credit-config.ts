import { Column, Entity } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

@Entity('loan_credit_config')
export class LoanCreditConfigEntity extends BaseEntity {
  @Column({ comment: '最低随机额度', default: 250000 })
  minCredit: number;

  @Column({ comment: '最高随机额度', default: 300000 })
  maxCredit: number;

  @Column({ comment: '最低借款金额', default: 1000 })
  minLoanAmount: number;

  @Column({ comment: '借款金额步长', default: 1000 })
  amountStep: number;

  @Column({ comment: '年化利率百分比', type: 'decimal', precision: 6, scale: 3, default: 7.2 })
  annualRate: number;

  @Column({ comment: '可选期数', type: 'json', transformer: transformerJson })
  terms: number[];

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}

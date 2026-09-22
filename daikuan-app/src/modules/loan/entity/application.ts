import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_application')
export class LoanApplicationEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '申请编号', length: 40 })
  applicationNo: string;
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;
  @Column({ comment: '申请金额', type: 'decimal', precision: 12, scale: 2 })
  amount: number;
  @Column({ comment: '期数' }) term: number;
  @Column({ comment: '申请时年化利率', type: 'decimal', precision: 6, scale: 3, default: 7.2 }) annualRate: number;
  @Column({ comment: '用途', nullable: true }) purpose: string;
  @Column({ comment: '收款银行', nullable: true }) bankName: string;
  @Column({ comment: '银行卡号', nullable: true }) bankCardNo: string;
  @Index()
  @Column({ comment: '状态', length: 20, default: 'draft' })
  status: string;
  @Column({ comment: '审核备注', type: 'text', nullable: true })
  reviewRemark: string;
  @Column({ comment: '提交时间', nullable: true }) submittedAt: string;
}

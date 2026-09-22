import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_user_bank_card')
export class LoanUserBankCardEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '银行编码', length: 32 })
  bankCode: string;

  @Column({ comment: '银行名称', length: 80 })
  bankName: string;

  @Column({ comment: '银行卡号', length: 30 })
  cardNo: string;

  @Column({ comment: '卡号后四位', length: 4 })
  lastFour: string;

  @Column({ comment: '是否默认卡 0-否 1-是', default: 0 })
  isDefault: number;

  @Column({ comment: '状态 0-停用 1-正常', default: 1 })
  status: number;
}

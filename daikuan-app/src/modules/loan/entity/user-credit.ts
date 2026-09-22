import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_user_credit')
export class LoanUserCreditEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '固定授信额度' })
  creditLimit: number;
}

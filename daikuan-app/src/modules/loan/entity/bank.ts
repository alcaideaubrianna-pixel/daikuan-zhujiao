import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_bank')
export class LoanBankEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '银行编码', length: 32 })
  code: string;

  @Index({ unique: true })
  @Column({ comment: '银行名称', length: 80 })
  name: string;

  @Column({ comment: '简称', length: 40, nullable: true })
  shortName: string;

  @Column({ comment: '排序', default: 0 })
  orderNum: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}

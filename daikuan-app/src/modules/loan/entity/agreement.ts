import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_agreement')
export class LoanAgreementEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '协议编码', length: 40 })
  code: string;

  @Column({ comment: '协议名称', length: 100 })
  title: string;

  @Column({ comment: '协议版本', length: 30, default: '1.0' })
  version: string;

  @Column({ comment: '协议正文', type: 'text' })
  content: string;

  @Column({ comment: '排序', default: 0 })
  orderNum: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}

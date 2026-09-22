import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_agreement_sign')
export class LoanAgreementSignEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '申请ID' })
  applicationId: number;

  @Column({ comment: '协议ID' })
  agreementId: number;

  @Column({ comment: '协议编码', length: 40 })
  agreementCode: string;

  @Column({ comment: '协议名称', length: 100 })
  title: string;

  @Column({ comment: '签署时协议版本', length: 30 })
  version: string;

  @Column({ comment: '签署时协议正文', type: 'text' })
  contentSnapshot: string;

  @Column({ comment: '同意时间', type: 'datetime' })
  agreedAt: Date;
}

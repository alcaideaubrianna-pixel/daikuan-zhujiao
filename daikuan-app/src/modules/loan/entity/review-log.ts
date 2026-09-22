import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_review_log')
export class LoanReviewLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '申请ID' })
  applicationId: number;
  @Column({ comment: '原状态', nullable: true }) fromStatus: string;
  @Column({ comment: '新状态' }) toStatus: string;
  @Column({ comment: '审核备注', type: 'text', nullable: true }) remark: string;
  @Column({ comment: '操作管理员ID', nullable: true }) operatorId: number;
}

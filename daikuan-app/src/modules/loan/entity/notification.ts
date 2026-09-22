import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_notification')
export class LoanNotificationEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '消息类型', length: 30, default: 'system' })
  type: string;

  @Column({ comment: '消息标题', length: 120 })
  title: string;

  @Column({ comment: '消息内容', type: 'text' })
  content: string;

  @Column({ comment: '跳转地址', nullable: true, length: 200 })
  link: string;

  @Column({ comment: '已读时间', nullable: true })
  readAt: string;
}

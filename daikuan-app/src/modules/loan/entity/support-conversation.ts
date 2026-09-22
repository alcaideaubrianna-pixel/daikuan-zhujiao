import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('support_conversation')
export class SupportConversationEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '用户ID' })
  userId: number;
  @Index()
  @Column({ comment: '状态', default: 'open' })
  status: string;
  @Column({ comment: '客服管理员ID', nullable: true }) staffId: number;
  @Column({ comment: '最后消息', nullable: true }) lastMessage: string;
  @Column({ comment: '最后消息时间', nullable: true }) lastMessageAt: string;
  @Column({ comment: '用户未读数', default: 0 }) userUnread: number;
  @Column({ comment: '客服未读数', default: 0 }) staffUnread: number;
}

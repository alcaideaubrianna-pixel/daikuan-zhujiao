import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('support_message')
export class SupportMessageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '会话ID' })
  conversationId: number;
  @Column({ comment: '发送方 user/staff/system' }) senderType: string;
  @Column({ comment: '发送方ID', nullable: true }) senderId: number;
  @Column({ comment: '消息类型', default: 'text' }) messageType: string;
  @Column({ comment: '消息内容', type: 'text' }) content: string;
  @Column({ comment: '是否已读', default: 0 }) isRead: number;
}

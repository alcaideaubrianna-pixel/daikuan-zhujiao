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
  @Column({ comment: '附件地址', nullable: true, length: 500 }) attachmentUrl: string;
  @Column({ comment: '附件类型 image/video', nullable: true, length: 20 }) attachmentType: string;
  @Column({ comment: '附件名称', nullable: true, length: 255 }) attachmentName: string;
}

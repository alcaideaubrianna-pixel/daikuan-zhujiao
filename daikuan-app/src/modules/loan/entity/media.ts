import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_media')
@Index(['userId', 'purpose'])
export class LoanMediaEntity extends BaseEntity {
  @Column({ comment: '用户ID' }) userId: number;
  @Column({ comment: '用途', length: 30 }) purpose: string;
  @Column({ comment: '媒体类型', length: 20, default: 'image' })
  mediaType: string;
  @Column({ comment: '原文件名', nullable: true }) fileName: string;
  @Column({ comment: '文件地址', type: 'text' }) url: string;
  @Column({ comment: '文件大小', nullable: true }) size: number;
  @Column({ comment: 'MIME', nullable: true }) mimeType: string;
  @Column({ comment: '状态', default: 1 }) status: number;
}

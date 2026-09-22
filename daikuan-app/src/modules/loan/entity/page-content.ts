import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('loan_page_content')
export class LoanPageContentEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '页面标识', length: 40 })
  key: string;

  @Column({ comment: '页面标题', length: 100 })
  title: string;

  @Column({ comment: '页面内容', type: 'text' })
  content: string;

  @Column({ comment: '版本', length: 30, default: '1.0' })
  version: string;

  @Column({ comment: '状态 0-停用 1-启用', default: 1 })
  status: number;
}

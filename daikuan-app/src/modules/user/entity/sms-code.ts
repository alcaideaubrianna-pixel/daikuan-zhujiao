import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('user_sms_code')
export class UserSmsCodeEntity extends BaseEntity {
  @Index() @Column({ comment: '手机号' }) phone: string;
  @Column({ comment: '验证码' }) code: string;
  @Column({ comment: '短信文案', type: 'text', nullable: true }) content: string;
  @Column({ comment: '来源', default: 'system' }) source: string;
  @Column({ comment: '状态', default: 1 }) status: number;
  @Column({ comment: '过期时间' }) expireAt: Date;
  @Column({ comment: '使用时间', nullable: true }) usedAt: Date;
}

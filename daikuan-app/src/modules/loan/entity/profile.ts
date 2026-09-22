import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

@Entity('loan_profile')
export class LoanProfileEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '真实姓名', nullable: true })
  realName: string;

  @Column({ comment: '身份证号', nullable: true })
  idCardNo: string;

  @Column({ comment: '职业', nullable: true })
  job: string;

  @Column({ comment: '月收入', nullable: true })
  income: string;

  @Column({ comment: '居住地址', nullable: true })
  address: string;

  @Column({
    comment: '联系人',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  contacts: Record<string, string>[];

  @Column({ comment: '开户银行', nullable: true })
  bankName: string;

  @Column({ comment: '银行编码', length: 32, nullable: true })
  bankCode: string;

  @Column({ comment: '银行卡号', nullable: true })
  bankCardNo: string;

  @Column({
    comment: '已完成认证项',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  completed: string[];
}

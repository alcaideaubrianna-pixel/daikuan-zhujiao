import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';
@Entity('loan_telegram_config')
export class LoanTelegramConfigEntity extends BaseEntity {
  @Column({ default: 0 }) enabled: number;
  @Column({ length: 120 }) chatId: string;
  @Column({ length: 255 }) botToken: string;
}

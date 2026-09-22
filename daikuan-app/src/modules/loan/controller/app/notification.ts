import { BaseController, CoolController, CoolCommException } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { LoanNotificationEntity } from '../../entity/notification';

@CoolController()
export class AppLoanNotificationController extends BaseController {
  @Inject() ctx;
  @InjectEntityModel(LoanNotificationEntity) notificationRepo: Repository<LoanNotificationEntity>;

  @Get('/list', { summary: '我的消息列表' })
  async list(@Query('type') type?: string) {
    const where: any = { userId: this.ctx.user.id };
    if (type && type !== 'all') where.type = type;
    const list = await this.notificationRepo.find({ where, order: { id: 'DESC' }, take: 100 });
    const unread = await this.notificationRepo.countBy({ userId: this.ctx.user.id, readAt: null });
    return this.ok({ list, unread });
  }

  @Post('/read', { summary: '标记消息已读' })
  async read(@Body('id') id: number) {
    const item = await this.notificationRepo.findOneBy({ id: Number(id), userId: this.ctx.user.id });
    if (!item) throw new CoolCommException('消息不存在');
    if (!item.readAt) await this.notificationRepo.update(item.id, { readAt: moment().format('YYYY-MM-DD HH:mm:ss') });
    return this.ok();
  }

  @Post('/read-all', { summary: '全部标记已读' })
  async readAll() {
    await this.notificationRepo.createQueryBuilder().update().set({ readAt: moment().format('YYYY-MM-DD HH:mm:ss') }).where('userId = :userId AND readAt IS NULL', { userId: this.ctx.user.id }).execute();
    return this.ok();
  }
}

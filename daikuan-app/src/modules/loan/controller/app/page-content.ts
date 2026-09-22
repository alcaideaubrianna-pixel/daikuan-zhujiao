import { BaseController, CoolController, CoolCommException } from '@cool-midway/core';
import { Get, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LoanPageContentEntity } from '../../entity/page-content';

@CoolController()
export class AppLoanPageContentController extends BaseController {
  @InjectEntityModel(LoanPageContentEntity) contentRepo: Repository<LoanPageContentEntity>;

  @Get('/info', { summary: '获取页面内容' })
  async content(@Query('key') key: string) {
    const content = await this.contentRepo.findOneBy({ key, status: 1 });
    if (!content) throw new CoolCommException('页面内容暂未配置');
    return this.ok(content);
  }
}

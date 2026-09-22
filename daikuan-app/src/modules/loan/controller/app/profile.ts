import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { LoanProfileService } from '../../service/profile';

@CoolController()
export class AppLoanProfileController extends BaseController {
  @Inject() ctx;
  @Inject() loanProfileService: LoanProfileService;

  @Get('/info', { summary: '获取借款资料' })
  async info() {
    return this.ok(await this.loanProfileService.get(this.ctx.user.id));
  }

  @Post('/save', { summary: '保存借款资料' })
  async save(@Body() body) {
    return this.ok(
      await this.loanProfileService.saveProfile(this.ctx.user.id, body)
    );
  }

  @Post('/step', { summary: '校验并保存资料步骤' })
  async step(@Body('step') step: string, @Body('data') data: any) {
    return this.ok(
      await this.loanProfileService.saveStep(this.ctx.user.id, step, data)
    );
  }
}

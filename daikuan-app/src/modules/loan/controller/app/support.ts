import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { LoanSupportService } from '../../service/support';

@CoolController()
export class AppLoanSupportController extends BaseController {
  @Inject() ctx;
  @Inject() loanSupportService: LoanSupportService;
  @Get('/messages', { summary: '客服聊天记录' }) async messages(
    @Query('afterId') afterId?: number
  ) {
    return this.ok(
      await this.loanSupportService.messages(
        this.ctx.user.id,
        Number(afterId || 0)
      )
    );
  }
  @Post('/send', { summary: '发送客服消息' }) async send(
    @Body('content') content: string
  ) {
    return this.ok(
      await this.loanSupportService.sendUser(this.ctx.user.id, content)
    );
  }
}

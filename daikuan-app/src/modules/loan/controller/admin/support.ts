import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post, Get, Query } from '@midwayjs/core';
import { PassThrough } from 'stream';
import { SupportConversationEntity } from '../../entity/support-conversation';
import { UserInfoEntity } from '../../../user/entity/info';
import { LoanSupportService } from '../../service/support';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: SupportConversationEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.staffId'],
    keyWordLikeFields: ['a.lastMessage', 'b.phone', 'b.nickName'],
    select: ['a.*', 'b.phone as phone', 'b.nickName as userName'],
    join: [
      { entity: UserInfoEntity, alias: 'b', condition: 'a.userId = b.id' },
    ],
  },
})
export class AdminLoanSupportController extends BaseController {
  @Inject() ctx;
  @Inject() loanSupportService: LoanSupportService;
  @Get('/stream', { summary: '后台客服消息事件流' }) async stream(@Query('conversationId') conversationId: number, @Query('afterId') afterId?: number) {
    const id = Number(conversationId); const stream = new PassThrough(); this.ctx.set('Content-Type', 'text/event-stream'); this.ctx.set('Cache-Control', 'no-cache'); this.ctx.set('Connection', 'keep-alive'); this.ctx.status = 200; this.ctx.body = stream; let cursor = Number(afterId || 0); let closed = false;
    const send = async () => { if (closed) return; const list = await this.loanSupportService.messagesByConversation(id, cursor); for (const item of list) { cursor = item.id; stream.write(`data: ${JSON.stringify(item)}\n\n`); } stream.write(': keep-alive\n\n'); }; await send(); const timer = setInterval(send, 2000); this.ctx.req.on('close', () => { closed = true; clearInterval(timer); stream.end(); });
  }
  @Post('/reply', { summary: '客服回复' }) async reply(
    @Body('conversationId') conversationId: number,
    @Body('content') content: string
  ) {
    return this.ok(
      await this.loanSupportService.reply(
        Number(conversationId),
        this.ctx.admin.userId,
        content
      )
    );
  }
  @Post('/access-token', { summary: '生成客服分享链接令牌' }) async accessToken(@Body('conversationId') conversationId: number) {
    return this.ok({ token: await this.loanSupportService.accessToken(Number(conversationId)) });
  }
}

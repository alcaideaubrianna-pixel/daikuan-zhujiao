import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
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
}

import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { LoanApplicationEntity } from '../../entity/application';
import { UserInfoEntity } from '../../../user/entity/info';
import { LoanApplicationService } from '../../service/application';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: LoanApplicationEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.userId'],
    keyWordLikeFields: ['a.applicationNo', 'b.phone', 'b.nickName'],
    select: ['a.*', 'b.phone as phone', 'b.nickName as userName'],
    join: [
      { entity: UserInfoEntity, alias: 'b', condition: 'a.userId = b.id' },
    ],
  },
})
export class AdminLoanApplicationController extends BaseController {
  @Inject() ctx;
  @Inject() loanApplicationService: LoanApplicationService;

  @Post('/review', { summary: '审核借款申请' })
  async review(
    @Body('id') id: number,
    @Body('status') status: string,
    @Body('remark') remark: string
  ) {
    return this.ok(
      await this.loanApplicationService.review(
        Number(id),
        status,
        remark,
        this.ctx.admin?.userId
      )
    );
  }

  @Get('/detail', { summary: '申请、用户和资料聚合详情' })
  async detail(@Query('id') id: number) {
    return this.ok(await this.loanApplicationService.detail(Number(id)));
  }
}

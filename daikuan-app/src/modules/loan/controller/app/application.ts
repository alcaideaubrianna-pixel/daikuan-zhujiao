import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { LoanApplicationService } from '../../service/application';

@CoolController()
export class AppLoanApplicationController extends BaseController {
  @Inject() ctx;
  @Inject() loanApplicationService: LoanApplicationService;

  @Get('/current', { summary: '当前申请及审核进度' })
  async current() {
    return this.ok(await this.loanApplicationService.current(this.ctx.user.id));
  }

  @Get('/mine', { summary: '我的借款申请列表' })
  async mine() {
    return this.ok(await this.loanApplicationService.mine(this.ctx.user.id));
  }

  @Get('/info', { summary: '我的借款申请详情' })
  async mineInfo(@Query('id') id: number) {
    return this.ok(
      await this.loanApplicationService.mineInfo(this.ctx.user.id, Number(id))
    );
  }

  @Post('/draft', { summary: '保存申请草稿' })
  async draft(@Body() body) {
    return this.ok(
      await this.loanApplicationService.saveDraft(this.ctx.user.id, body)
    );
  }

  @Post('/submit', { summary: '提交申请' })
  async submit(@Body('id') id: number, @Body('agreementIds') agreementIds: number[]) {
    return this.ok(
      await this.loanApplicationService.submit(
        this.ctx.user.id,
        Number(id),
        agreementIds
      )
    );
  }
}

import { BaseController, CoolController } from '@cool-midway/core';
import { Get, Inject } from '@midwayjs/core';
import { LoanCreditService } from '../../service/credit';

@CoolController()
export class AppLoanCreditController extends BaseController {
  @Inject() ctx;
  @Inject() loanCreditService: LoanCreditService;

  @Get('/info', { summary: '获取或生成用户固定借款额度' })
  async info() {
    return this.ok(await this.loanCreditService.getOrCreate(this.ctx.user.id));
  }
}

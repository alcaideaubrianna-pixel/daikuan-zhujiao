import { Body, Get, Inject, Post } from '@midwayjs/core';
import { BaseController, CoolController } from '@cool-midway/core';
import { LoanTelegramService } from '../../service/telegram';
@CoolController('/telegram')
export class AdminLoanTelegramController extends BaseController {
  @Inject() telegramService: LoanTelegramService;
  @Get('/config') async config() { return this.ok(await this.telegramService.getConfig()); }
  @Post('/config') async save(@Body() body: any) { return this.ok(await this.telegramService.saveConfig(body || {})); }
}

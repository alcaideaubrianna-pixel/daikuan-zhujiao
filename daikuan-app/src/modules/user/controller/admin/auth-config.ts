import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import {
  UserAuthConfigInput,
  UserAuthConfigService,
} from '../../service/auth-config';
import { UserSmsService } from '../../service/sms';

@CoolController('/user/auth-config')
export class AdminUserAuthConfigController extends BaseController {
  @Inject()
  userAuthConfigService: UserAuthConfigService;

  @Inject()
  userSmsService: UserSmsService;

  @Get('/get', { summary: '获取用户登录配置' })
  async get() {
    return this.ok(await this.userAuthConfigService.get());
  }

  @Post('/save', { summary: '保存用户登录配置' })
  async save(@Body() input: UserAuthConfigInput) {
    return this.ok(
      await this.userAuthConfigService.save(input || {})
    );
  }

  @Post('/test-sms', { summary: '发送测试短信' })
  async testSms(@Body('phone') phone: string) {
    return this.ok(await this.userSmsService.sendTestSms(phone));
  }
}

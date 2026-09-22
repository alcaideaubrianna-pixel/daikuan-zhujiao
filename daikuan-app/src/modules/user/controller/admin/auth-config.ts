import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { UserAuthConfigService } from '../../service/auth-config';

@CoolController()
export class AdminUserAuthConfigController extends BaseController {
  @Inject()
  userAuthConfigService: UserAuthConfigService;

  @Get('/get', { summary: '获取用户登录配置' })
  async get() {
    return this.ok(await this.userAuthConfigService.get());
  }

  @Post('/save', { summary: '保存用户登录配置' })
  async save(
    @Body('testMode') testMode: boolean,
    @Body('universalCode') universalCode: string
  ) {
    return this.ok(
      await this.userAuthConfigService.save({ testMode, universalCode })
    );
  }
}

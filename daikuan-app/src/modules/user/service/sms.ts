import { Provide, Config, Inject, Init, InjectClient } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { PluginService } from '../../plugin/service/info';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { UserSmsCodeEntity } from '../entity/sms-code';
import { UserAuthConfigService } from './auth-config';

/**
 * 描述
 */
@Provide()
export class UserSmsService extends BaseService {
  @InjectEntityModel(UserSmsCodeEntity)
  codeRepo: Repository<UserSmsCodeEntity>;
  // 获得模块的配置信息
  @Config('module.user.sms')
  config;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Inject()
  pluginService: PluginService;

  @Inject()
  userAuthConfigService: UserAuthConfigService;

  plugin;

  @Init()
  async init() {
    for (const key of ['sms-tx', 'sms-ali']) {
      try {
        this.plugin = await this.pluginService.getInstance(key);
        if (this.plugin) {
          this.config.pluginKey = key;
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  /**
   * 发送验证码
   * @param phone
   */
  async sendSms(phone) {
    const authConfig = await this.userAuthConfigService.get();
    if (authConfig.testMode) {
      return { testMode: true, universalCode: authConfig.universalCode };
    }
    // 随机四位验证码
    const code = _.random(1000, 9999).toString();
    const expireAt = new Date(Date.now() + this.config.timeout * 1000);
    const content = String(process.env.SMS_TEMPLATE || '[快贷] 您的验证码是 {code}，{expire}分钟内有效，请勿泄露给他人。').replace('{code}', code).replace('{phone}', phone).replace('{expire}', String(Math.ceil(this.config.timeout / 60)));
    await this.codeRepo.update({ phone, status: 1 }, { status: 0 });
    await this.codeRepo.save({ phone, code, content, source: 'system', status: 1, expireAt });
    const pluginKey = this.config.pluginKey;
    if (!this.plugin)
      throw new CoolCommException(
        '未配置短信插件，请到插件市场下载安装配置：https://cool-js.com/plugin?keyWord=短信'
      );
    try {
      if (pluginKey == 'sms-tx') {
        await this.plugin.send([phone], [code]);
      }
      if (pluginKey == 'sms-ali') {
        await this.plugin.send([phone], {
          code,
        });
      }
      this.midwayCache.set(`sms:${phone}`, code, this.config.timeout * 1000);
      return { testMode: false };
    } catch (error) {
      throw new CoolCommException('发送过于频繁，请稍后再试');
    }
  }

  /**
   * 验证验证码
   * @param phone
   * @param code
   * @returns
   */
  async checkCode(phone, code) {
    const authConfig = await this.userAuthConfigService.get();
    if (authConfig.testMode && code === authConfig.universalCode) {
      return true;
    }
    const record = await this.codeRepo.findOne({ where: { phone, status: 1, expireAt: MoreThan(new Date()) }, order: { id: 'DESC' } });
    const cacheCode = record?.code || await this.midwayCache.get(`sms:${phone}`);
    if (code && cacheCode == code) {
      if (record) await this.codeRepo.update(record.id, { status: 0, usedAt: new Date() });
      return true;
    }
    return false;
  }
}

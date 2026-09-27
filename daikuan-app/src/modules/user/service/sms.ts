import {
  Provide,
  Config,
  Inject,
  Init,
  InjectClient,
  ILogger,
  Logger,
} from '@midwayjs/core';
import { createHash, randomBytes, randomInt } from 'crypto';
import { BaseService, CoolCommException } from '@cool-midway/core';
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

  @Logger()
  logger: ILogger;

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
    const authConfig = await this.userAuthConfigService.getSmsConfig();
    if (authConfig.testMode) {
      return { testMode: true, universalCode: authConfig.universalCode };
    }
    const codeLen = authConfig.smsProvider === 'yunxin' ? authConfig.yunxinCodeLen : 4;
    const code = randomInt(0, 10 ** codeLen).toString().padStart(codeLen, '0');
    const expireAt = new Date(Date.now() + this.config.timeout * 1000);
    const content = String(process.env.SMS_TEMPLATE || '[快贷] 您的验证码是 {code}，{expire}分钟内有效，请勿泄露给他人。').replace('{code}', code).replace('{phone}', phone).replace('{expire}', String(Math.ceil(this.config.timeout / 60)));

    await this.sendThroughConfiguredChannel(phone, code, authConfig);

    await this.codeRepo.update({ phone, status: 1 }, { status: 0 });
    await this.codeRepo.save({
      phone,
      code,
      content,
      source: authConfig.smsProvider === 'yunxin' ? 'yunxin' : 'system',
      status: 1,
      expireAt,
    });
    await this.midwayCache.set(`sms:${phone}`, code, this.config.timeout * 1000);
    return { testMode: false };
  }

  /**
   * Send a real test message through the configured channel without creating
   * or replacing a login verification code.
   */
  async sendTestSms(phoneInput: string) {
    const phone = this.normalizeTestPhone(phoneInput);
    const authConfig = await this.userAuthConfigService.getSmsConfig();
    const cooldownKey = `sms:test:${phone.replace(/-/g, '')}`;
    if (await this.midwayCache.get(cooldownKey)) {
      throw new CoolCommException('该手机号刚刚测试发送过，请一分钟后再试');
    }

    await this.midwayCache.set(cooldownKey, '1', 60 * 1000);
    try {
      const codeLen = authConfig.smsProvider === 'yunxin' ? authConfig.yunxinCodeLen : 4;
      const code = randomInt(0, 10 ** codeLen).toString().padStart(codeLen, '0');
      await this.sendThroughConfiguredChannel(phone, code, authConfig);
      return { sent: true };
    } catch (error) {
      await this.midwayCache.del(cooldownKey);
      throw error;
    }
  }

  private normalizeTestPhone(phoneInput: string): string {
    const phone = String(phoneInput || '').trim();
    if (/^1[3-9]\d{9}$/.test(phone)) return phone;

    // Keep the optional country-code separator required by some SMS gateways
    // (for example +852-12345678), while using E.164 digits for validation.
    const internationalPhone = phone.replace(/\s/g, '');
    const compactInternationalPhone = internationalPhone.replace(/-/g, '');
    const validE164 = /^\+[1-9]\d{6,14}$/.test(compactInternationalPhone);
    const validCountrySeparator = /^\+[1-9]\d{0,2}-\d{4,12}$/.test(internationalPhone);
    if (validE164 && (!internationalPhone.includes('-') || validCountrySeparator)) {
      return internationalPhone;
    }
    throw new CoolCommException('请输入有效的手机号，国际号码请带国家或地区区号');
  }

  private async sendThroughConfiguredChannel(phone: string, code: string, authConfig) {
    try {
      if (authConfig.smsProvider === 'yunxin') {
        await this.sendYunxinCode(phone, code, authConfig);
        return;
      }

      const pluginKey = this.config.pluginKey;
      if (!this.plugin) {
        throw new CoolCommException(
          '未配置短信插件，请到插件市场下载安装配置：https://cool-js.com/plugin?keyWord=短信'
        );
      }
      if (pluginKey === 'sms-tx') {
        await this.plugin.send([phone], [code]);
      } else if (pluginKey === 'sms-ali') {
        await this.plugin.send([phone], { code });
      } else {
        throw new CoolCommException('当前短信插件不支持验证码发送');
      }
    } catch (error) {
      this.logger.error('SMS delivery failed via %s: %s', authConfig.smsProvider, error);
      if (error instanceof CoolCommException) throw error;
      throw new CoolCommException('短信发送失败，请检查短信渠道配置或稍后重试');
    }
  }

  /**
   * Yunxin requires SHA1(AppSecret + Nonce + CurTime) in the CheckSum header.
   * The code is generated by this service and passed with paramMap so it can be
   * tracked in the admin panel and verified by Yunxin. Admin-edited codes are
   * marked separately and continue to use the local record for verification.
   */
  private async sendYunxinCode(phone: string, code: string, config) {
    if (!config.yunxinAppKey || !config.yunxinAppSecret || !config.yunxinTemplateId) {
      throw new CoolCommException('请先在后台配置网易云信短信参数');
    }

    const body = new URLSearchParams({
      mobile: phone,
      templateid: String(config.yunxinTemplateId),
      paramMap: JSON.stringify({ code }),
    });

    const response = await fetch('https://sms.yunxinapi.com/sms/sendcode.action', {
      method: 'POST',
      headers: this.yunxinHeaders(config),
      body,
      signal: AbortSignal.timeout(10000),
    });

    const result = await response.json().catch(() => null) as {
      code?: number;
      msg?: string;
    } | null;
    if (!response.ok || result?.code !== 200) {
      const providerCode = result?.code ?? response.status;
      this.logger.warn('Yunxin SMS rejected request with code %s: %s', providerCode, result?.msg || 'no message');
      throw new CoolCommException('网易云信短信发送失败，请检查模板、账户状态或发送频控');
    }
  }

  private yunxinHeaders(config): Record<string, string> {
    const curTime = Math.floor(Date.now() / 1000).toString();
    const nonce = randomBytes(16).toString('hex');
    const checkSum = createHash('sha1')
      .update(`${config.yunxinAppSecret}${nonce}${curTime}`)
      .digest('hex');
    return {
      AppKey: config.yunxinAppKey,
      CurTime: curTime,
      CheckSum: checkSum,
      Nonce: nonce,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
  }

  private async verifyYunxinCode(phone: string, code: string, config): Promise<boolean> {
    if (!config.yunxinAppKey || !config.yunxinAppSecret) {
      throw new CoolCommException('网易云信短信配置不完整');
    }

    let response: Response;
    let result: { code?: number; msg?: string } | null;
    try {
      response = await fetch('https://sms.yunxinapi.com/sms/verifycode.action', {
        method: 'POST',
        headers: this.yunxinHeaders(config),
        body: new URLSearchParams({ mobile: phone, code }),
        signal: AbortSignal.timeout(10000),
      });
      result = await response.json().catch(() => null) as {
        code?: number;
        msg?: string;
      } | null;
    } catch (error) {
      this.logger.error('Yunxin SMS verification request failed: %s', error);
      throw new CoolCommException('网易云信验证码服务暂不可用，请稍后重试');
    }

    if (response.ok && result?.code === 200) return true;
    if (result?.code === 413 || response.status === 413) return false;

    this.logger.warn(
      'Yunxin SMS verification rejected request with code %s: %s',
      result?.code ?? response.status,
      result?.msg || 'no message'
    );
    throw new CoolCommException('网易云信验证码校验失败，请稍后重试');
  }

  /**
   * 验证验证码
   * @param phone
   * @param code
   * @returns
   */
  async checkCode(phone, code) {
    const authConfig = await this.userAuthConfigService.getSmsConfig();
    if (authConfig.testMode && code === authConfig.universalCode) {
      return true;
    }
    const record = await this.codeRepo.findOne({ where: { phone, status: 1, expireAt: MoreThan(new Date()) }, order: { id: 'DESC' } });
    if (record?.source === 'yunxin') {
      const verified = await this.verifyYunxinCode(phone, code, authConfig);
      if (!verified) return false;
      await this.codeRepo.update(record.id, { status: 0, usedAt: new Date() });
      await this.midwayCache.del(`sms:${phone}`);
      return true;
    }
    const cacheCode = record?.code || await this.midwayCache.get(`sms:${phone}`);
    if (code && cacheCode == code) {
      if (record) await this.codeRepo.update(record.id, { status: 0, usedAt: new Date() });
      await this.midwayCache.del(`sms:${phone}`);
      return true;
    }
    return false;
  }
}

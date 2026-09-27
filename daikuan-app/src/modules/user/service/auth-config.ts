import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../base/entity/sys/param';
import { BaseSysConfEntity } from '../../base/entity/sys/conf';

export interface UserAuthConfig {
  testMode: boolean;
  universalCode: string;
  smsProvider: 'plugin' | 'yunxin';
  yunxinAppKey: string;
  yunxinAppSecret: string;
  yunxinTemplateId: string;
  yunxinCodeLen: number;
}

export type UserAuthConfigInput = Partial<UserAuthConfig> & {
  clearYunxinAppSecret?: boolean;
};

export type UserAuthConfigForAdmin = Omit<UserAuthConfig, 'yunxinAppSecret'> & {
  yunxinAppSecret: '';
  yunxinAppSecretConfigured: boolean;
};

const CONFIG_KEY = 'userLoginConfig';
const YUNXIN_SECRET_KEY = 'userLoginYunxinAppSecret';
const DEFAULT_CONFIG: UserAuthConfig = {
  testMode: false,
  universalCode: '123456',
  smsProvider: 'plugin',
  yunxinAppKey: '',
  yunxinAppSecret: '',
  yunxinTemplateId: '',
  yunxinCodeLen: 6,
};

@Provide()
export class UserAuthConfigService extends BaseService {
  @InjectEntityModel(BaseSysParamEntity)
  paramRepo: Repository<BaseSysParamEntity>;

  @InjectEntityModel(BaseSysConfEntity)
  confRepo: Repository<BaseSysConfEntity>;

  private async getStoredConfig(): Promise<UserAuthConfig> {
    const param = await this.paramRepo.findOneBy({ keyName: CONFIG_KEY });
    const secretConfig = await this.confRepo.findOneBy({ cKey: YUNXIN_SECRET_KEY });
    let config: UserAuthConfig;
    if (!param) {
      await this.paramRepo.save({
        keyName: CONFIG_KEY,
        name: '用户登录测试配置',
        data: JSON.stringify(DEFAULT_CONFIG),
        dataType: 0,
        remark: '控制H5万能验证码，仅测试环境启用',
      });
      config = { ...DEFAULT_CONFIG };
    } else {
      try {
        config = { ...DEFAULT_CONFIG, ...JSON.parse(param.data) };
      } catch {
        config = { ...DEFAULT_CONFIG };
      }
    }
    // Older local versions may have saved this value inside the generic
    // parameter table; migrate it to the non-CRUD system config table.
    const legacySecret = config.yunxinAppSecret;
    const yunxinAppSecret = secretConfig?.cValue || legacySecret || '';
    if (!secretConfig && legacySecret) {
      await this.confRepo.save({ cKey: YUNXIN_SECRET_KEY, cValue: legacySecret });
      const { yunxinAppSecret: _migratedSecret, ...safeConfig } = config;
      if (param) {
        await this.paramRepo.update(param.id, { data: JSON.stringify(safeConfig) });
      }
    }
    return { ...config, yunxinAppSecret };
  }

  /**
   * Admin-facing config never returns the Yunxin AppSecret.
   */
  async get(): Promise<UserAuthConfigForAdmin> {
    const config = await this.getStoredConfig();
    const { yunxinAppSecret, ...safeConfig } = config;
    return {
      ...safeConfig,
      yunxinAppSecret: '',
      yunxinAppSecretConfigured: Boolean(yunxinAppSecret),
    };
  }

  /**
   * Internal config for the SMS sender. Do not expose through a controller.
   */
  async getSmsConfig(): Promise<UserAuthConfig> {
    return this.getStoredConfig();
  }

  async save(input: UserAuthConfigInput): Promise<UserAuthConfigForAdmin> {
    const currentConfig = await this.getStoredConfig();
    const smsProvider = input.smsProvider || currentConfig.smsProvider;
    if (smsProvider !== 'plugin' && smsProvider !== 'yunxin') {
      throw new CoolCommException('短信服务渠道不正确');
    }

    const yunxinAppKey = String(input.yunxinAppKey ?? currentConfig.yunxinAppKey).trim();
    const yunxinTemplateId = String(input.yunxinTemplateId ?? currentConfig.yunxinTemplateId).trim();
    const yunxinCodeLen = Number(input.yunxinCodeLen ?? currentConfig.yunxinCodeLen);
    const universalCode = String(input.universalCode ?? currentConfig.universalCode);
    const yunxinAppSecret = input.clearYunxinAppSecret
      ? ''
      : String(input.yunxinAppSecret || currentConfig.yunxinAppSecret).trim();

    if (!/^\d{4,8}$/.test(universalCode)) {
      throw new CoolCommException('万能验证码必须为4-8位数字');
    }

    if (!Number.isInteger(yunxinCodeLen) || yunxinCodeLen < 4 || yunxinCodeLen > 10) {
      throw new CoolCommException('云信验证码长度必须为4-10位');
    }
    if (smsProvider === 'yunxin') {
      if (!yunxinAppKey || !yunxinAppSecret || !/^\d+$/.test(yunxinTemplateId)) {
        throw new CoolCommException('请填写网易云信 AppKey、AppSecret 和已审核通过的验证码模板 ID');
      }
    }

    const current = await this.paramRepo.findOneBy({ keyName: CONFIG_KEY });
    await this.paramRepo.save({
      ...(current || {}),
      keyName: CONFIG_KEY,
      name: '用户登录测试配置',
      data: JSON.stringify({
        testMode: Boolean(input.testMode ?? currentConfig.testMode),
        universalCode,
        smsProvider,
        yunxinAppKey,
        yunxinTemplateId,
        yunxinCodeLen,
      }),
      dataType: 0,
      remark: 'H5登录测试模式及短信服务配置',
    });
    if (yunxinAppSecret) {
      const secretConfig = await this.confRepo.findOneBy({ cKey: YUNXIN_SECRET_KEY });
      await this.confRepo.save({
        ...(secretConfig || {}),
        cKey: YUNXIN_SECRET_KEY,
        cValue: yunxinAppSecret,
      });
    } else if (input.clearYunxinAppSecret) {
      await this.confRepo.delete({ cKey: YUNXIN_SECRET_KEY });
    }
    return this.get();
  }
}

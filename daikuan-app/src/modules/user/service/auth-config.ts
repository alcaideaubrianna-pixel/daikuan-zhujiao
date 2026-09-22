import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../base/entity/sys/param';

export interface UserAuthConfig {
  testMode: boolean;
  universalCode: string;
}

const CONFIG_KEY = 'userLoginConfig';
const DEFAULT_CONFIG: UserAuthConfig = {
  testMode: true,
  universalCode: '123456',
};

@Provide()
export class UserAuthConfigService extends BaseService {
  @InjectEntityModel(BaseSysParamEntity)
  paramRepo: Repository<BaseSysParamEntity>;

  async get(): Promise<UserAuthConfig> {
    const param = await this.paramRepo.findOneBy({ keyName: CONFIG_KEY });
    if (!param) {
      await this.paramRepo.save({
        keyName: CONFIG_KEY,
        name: '用户登录测试配置',
        data: JSON.stringify(DEFAULT_CONFIG),
        dataType: 0,
        remark: '控制H5万能验证码，仅测试环境启用',
      });
      return { ...DEFAULT_CONFIG };
    }
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(param.data) };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  async save(config: UserAuthConfig) {
    if (!/^\d{4,8}$/.test(config.universalCode || '')) {
      throw new CoolCommException('万能验证码必须为4-8位数字');
    }
    const current = await this.paramRepo.findOneBy({ keyName: CONFIG_KEY });
    await this.paramRepo.save({
      ...(current || {}),
      keyName: CONFIG_KEY,
      name: '用户登录测试配置',
      data: JSON.stringify({
        testMode: Boolean(config.testMode),
        universalCode: config.universalCode,
      }),
      dataType: 0,
      remark: '控制H5万能验证码，仅测试环境启用',
    });
    return this.get();
  }
}

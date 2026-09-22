import { ModuleConfig } from '@cool-midway/core';

export default () =>
  ({
    name: '借款业务',
    description: '用户资料、申请材料与审核流程',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig);

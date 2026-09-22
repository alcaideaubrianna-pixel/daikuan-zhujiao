import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { entities } from '../entities';
import { TenantSubscriber } from '../modules/base/db/tenant';
import { pSqlitePath } from '../comm/path';

const databaseUrl = process.env.DATABASE_URL;
const usePostgres = databaseUrl?.startsWith('postgres');
const useSqlite = process.env.DATABASE_TYPE === 'sqlite';

/**
 * 本地开发 npm run prod 读取的配置文件
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: useSqlite ? 'sqlite' : usePostgres ? 'postgres' : 'mysql',
        ...(useSqlite
          ? { database: process.env.DB_SQLITE_PATH || pSqlitePath() }
          : databaseUrl
          ? { url: databaseUrl }
          : {
              host: process.env.DB_HOST || '127.0.0.1',
              port: Number(process.env.DB_PORT || 3306),
              username: process.env.DB_USERNAME || 'root',
              password: process.env.DB_PASSWORD || '123456',
              database: process.env.DB_DATABASE || 'cool',
            }),
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        // 打印日志
        logging: false,
        // 字符集
        ...(!useSqlite && usePostgres
          ? process.env.DB_SSL === 'false'
            ? {}
            : { ssl: { rejectUnauthorized: false } }
          : !useSqlite ? { charset: 'utf8mb4' } : {}),
        // 是否开启缓存
        cache: true,
        // 实体路径
        entities,
        // 订阅者
        subscribers: [TenantSubscriber],
      },
    },
  },
  cool: {
    // 实体与路径，跟生成代码、前端请求、swagger文档相关 注意：线上不建议开启，以免暴露敏感信息
    eps: false,
    // 是否自动导入模块数据库
    initDB: process.env.COOL_INIT_DB === 'true',
    // 判断是否初始化的方式
    initJudge: 'db',
    // 是否自动导入模块菜单
    initMenu: process.env.COOL_INIT_MENU === 'true',
  } as CoolConfig,
} as MidwayConfig;

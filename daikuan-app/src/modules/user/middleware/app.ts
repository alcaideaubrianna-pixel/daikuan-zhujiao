import { ALL, Config, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, Init, Inject } from '@midwayjs/core';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { CoolCommException, CoolUrlTagData, TagTypes } from '@cool-midway/core';
import { Utils } from '../../../comm/utils';

/**
 * 用户
 */
@Middleware()
export class UserMiddleware implements IMiddleware<Context, NextFunction> {
  @Config(ALL)
  coolConfig;

  @Inject()
  coolUrlTagData: CoolUrlTagData;

  @Config('module.user.jwt')
  jwtConfig;

  ignoreUrls: string[] = [];

  @Config('koa.globalPrefix')
  prefix;

  @Inject()
  utils: Utils;

  @Init()
  async init() {
    this.ignoreUrls = this.coolUrlTagData.byKey(TagTypes.IGNORE_TOKEN, 'app');
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      let { url } = ctx;
      url = url.replace(this.prefix, '').split('?')[0];
      if (_.startsWith(url, '/app/')) {
        // Login, captcha and token refresh endpoints must be reachable before
        // an access token exists. Keep these explicit as a fallback for
        // deployments where CoolUrlTag metadata is not ready during startup.
        const publicAuthUrl = [
          '/app/user/login/mini',
          '/app/user/login/mp',
          '/app/user/login/wxApp',
          '/app/user/login/phone',
          '/app/user/login/uniPhone',
          '/app/user/login/miniPhone',
          '/app/user/login/captcha',
          '/app/user/login/smsCode',
          '/app/user/login/refreshToken',
          '/app/user/login/password',
          '/app/user/login/h5',
          '/app/loan/support-public/public/messages',
          '/app/loan/support-public/public/reply',
          '/app/loan/support-public/public/upload',
          '/app/loan/support-public/messages',
          '/app/loan/support-public/reply',
          '/app/loan/support-public/upload',
          '/app/loan/public/messages',
          '/app/loan/public/reply',
          '/app/loan/public/upload',
          '/app/loan/support/public/messages',
          '/app/loan/support/public/reply',
        ].includes(url);
        const token = ctx.get('Authorization');
        const isIgnored = publicAuthUrl || this.ignoreUrls.some(pattern =>
          this.utils.matchUrl(pattern, url)
        );
        if (isIgnored) {
          await next();
          return;
        }
        try {
          ctx.user = jwt.verify(token, this.jwtConfig.secret);

          if (ctx.user.isRefresh) {
            throw new CoolCommException('登录失效~');
          }
        } catch (error) {}
        if (!ctx.user) {
          ctx.status = 401;
          throw new CoolCommException('登录失效~');
        }
      }
      await next();
    };
  }
}

import { BaseController, CoolCommException, CoolController } from '@cool-midway/core';
import { Body, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserSmsCodeEntity } from '../../entity/sms-code';

@CoolController({ api: ['info', 'list', 'page'], entity: UserSmsCodeEntity, pageQueryOp: { fieldEq: ['a.status', 'a.phone'], keyWordLikeFields: ['a.phone', 'a.code', 'a.content'] } })
export class AdminUserSmsCodeController extends BaseController {
  @InjectEntityModel(UserSmsCodeEntity)
  codeRepo: Repository<UserSmsCodeEntity>;

  @Post('/update', { summary: '修改短信验证码记录' })
  async updateSmsCode(@Body() body: Partial<UserSmsCodeEntity> & { id?: number }) {
    const id = Number(body?.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new CoolCommException('验证码记录不存在');
    }
    const record = await this.codeRepo.findOneBy({ id });
    if (!record) throw new CoolCommException('验证码记录不存在');

    const update: Partial<UserSmsCodeEntity> = {};
    if (body.code !== undefined) {
      const code = String(body.code).trim();
      if (!/^[a-z\d]{4,10}$/i.test(code)) {
        throw new CoolCommException('验证码必须为4-10位字母或数字');
      }
      if (code !== record.code) {
        update.code = code;
        update.source = 'admin';
      }
    }
    if (body.phone !== undefined) update.phone = String(body.phone).trim();
    if (body.content !== undefined) update.content = body.content;
    if (body.status !== undefined) {
      const status = Number(body.status);
      if (status !== 0 && status !== 1) throw new CoolCommException('验证码状态不正确');
      update.status = status;
    }
    if (body.expireAt !== undefined) {
      const expireAt = new Date(body.expireAt);
      if (Number.isNaN(expireAt.getTime())) throw new CoolCommException('验证码过期时间不正确');
      update.expireAt = expireAt;
    }

    return this.ok(await this.codeRepo.save({ ...record, ...update }));
  }
}

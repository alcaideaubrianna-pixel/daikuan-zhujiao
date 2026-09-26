import { BaseController, CoolController } from '@cool-midway/core';
import { UserSmsCodeEntity } from '../../entity/sms-code';

@CoolController({ api: ['info', 'list', 'page', 'update'], entity: UserSmsCodeEntity, pageQueryOp: { fieldEq: ['a.status', 'a.phone'], keyWordLikeFields: ['a.phone', 'a.code', 'a.content'] } })
export class AdminUserSmsCodeController extends BaseController {}

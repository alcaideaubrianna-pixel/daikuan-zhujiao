import { BaseController, CoolController } from '@cool-midway/core';
import { LoanNotificationEntity } from '../../entity/notification';
import { UserInfoEntity } from '../../../user/entity/info';

@CoolController({
  api: ['add', 'delete', 'info', 'list', 'page'],
  entity: LoanNotificationEntity,
  pageQueryOp: {
    fieldEq: ['a.type', 'a.userId'],
    keyWordLikeFields: ['a.title', 'a.content', 'b.phone'],
    select: ['a.*', 'b.phone as phone'],
    join: [{ entity: UserInfoEntity, alias: 'b', condition: 'a.userId = b.id' }],
    addOrderBy: { id: 'desc' },
  },
})
export class AdminLoanNotificationController extends BaseController {}

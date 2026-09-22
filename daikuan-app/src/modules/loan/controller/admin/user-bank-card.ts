import { BaseController, CoolController } from '@cool-midway/core';
import { LoanUserBankCardEntity } from '../../entity/user-bank-card';
import { UserInfoEntity } from '../../../user/entity/info';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: LoanUserBankCardEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.userId', 'a.bankCode'],
    keyWordLikeFields: ['a.bankName', 'a.cardNo', 'b.phone'],
    select: ['a.*', 'b.phone as phone'],
    join: [{ entity: UserInfoEntity, alias: 'b', condition: 'a.userId = b.id' }],
    addOrderBy: { id: 'desc' },
  },
})
export class AdminLoanUserBankCardController extends BaseController {}

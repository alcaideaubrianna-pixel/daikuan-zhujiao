import { BaseController, CoolController } from '@cool-midway/core';
import { LoanBankEntity } from '../../entity/bank';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LoanBankEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    keyWordLikeFields: ['a.name', 'a.shortName', 'a.code'],
    addOrderBy: { orderNum: 'asc', id: 'asc' },
  },
})
export class AdminLoanBankController extends BaseController {}

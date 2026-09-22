import { BaseController, CoolController } from '@cool-midway/core';
import { LoanAgreementEntity } from '../../entity/agreement';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: LoanAgreementEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    keyWordLikeFields: ['a.title', 'a.code', 'a.version'],
    addOrderBy: { orderNum: 'asc', id: 'asc' },
  },
})
export class AdminLoanAgreementController extends BaseController {}

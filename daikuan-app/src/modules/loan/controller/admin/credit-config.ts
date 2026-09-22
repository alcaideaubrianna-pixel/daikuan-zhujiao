import { BaseController, CoolController } from '@cool-midway/core';
import { LoanCreditConfigEntity } from '../../entity/credit-config';

@CoolController({
  api: ['info', 'list', 'page', 'update'],
  entity: LoanCreditConfigEntity,
  pageQueryOp: { addOrderBy: { id: 'asc' } },
})
export class AdminLoanCreditConfigController extends BaseController {}

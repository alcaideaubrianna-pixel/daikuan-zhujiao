import { BaseController, CoolController } from '@cool-midway/core';
import { LoanMediaEntity } from '../../entity/media';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: LoanMediaEntity,
  pageQueryOp: { fieldEq: ['a.userId', 'a.purpose', 'a.status'] },
})
export class AdminLoanMediaController extends BaseController {}

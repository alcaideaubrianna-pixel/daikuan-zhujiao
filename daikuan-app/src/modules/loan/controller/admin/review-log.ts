import { BaseController, CoolController } from '@cool-midway/core';
import { LoanReviewLogEntity } from '../../entity/review-log';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: LoanReviewLogEntity,
  pageQueryOp: { fieldEq: ['a.applicationId', 'a.toStatus'] },
})
export class AdminLoanReviewLogController extends BaseController {}

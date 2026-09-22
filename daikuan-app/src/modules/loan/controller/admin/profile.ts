import { BaseController, CoolController } from '@cool-midway/core';
import { LoanProfileEntity } from '../../entity/profile';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: LoanProfileEntity,
  pageQueryOp: {
    fieldEq: ['a.userId'],
    keyWordLikeFields: ['a.realName', 'a.idCardNo', 'a.bankCardNo'],
  },
})
export class AdminLoanProfileController extends BaseController {}

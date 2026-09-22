import { BaseController, CoolController } from '@cool-midway/core';
import { SupportMessageEntity } from '../../entity/support-message';

@CoolController({
  api: ['info', 'list', 'page'],
  entity: SupportMessageEntity,
  pageQueryOp: { fieldEq: ['a.conversationId', 'a.senderType'] },
})
export class AdminLoanSupportMessageController extends BaseController {}

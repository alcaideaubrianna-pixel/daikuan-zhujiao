import { BaseController, CoolController } from '@cool-midway/core';
import { LoanPageContentEntity } from '../../entity/page-content';

@CoolController({ api: ['add', 'delete', 'update', 'info', 'list', 'page'], entity: LoanPageContentEntity })
export class AdminLoanPageContentController extends BaseController {}

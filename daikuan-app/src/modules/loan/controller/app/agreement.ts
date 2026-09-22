import { BaseController, CoolController } from '@cool-midway/core';
import { Get } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LoanAgreementEntity } from '../../entity/agreement';

@CoolController()
export class AppLoanAgreementController extends BaseController {
  @InjectEntityModel(LoanAgreementEntity)
  agreementRepo: Repository<LoanAgreementEntity>;

  @Get('/list', { summary: '当前生效的借款协议' })
  async list() {
    const agreements = await this.agreementRepo.find({
      where: { status: 1 },
      order: { orderNum: 'ASC', id: 'ASC' },
    });
    return this.ok(agreements);
  }
}

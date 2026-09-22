import { BaseController, CoolController } from '@cool-midway/core';
import { Get } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { LoanBankEntity } from '../../entity/bank';

@CoolController()
export class AppLoanBankController extends BaseController {
  @InjectEntityModel(LoanBankEntity)
  bankRepo: Repository<LoanBankEntity>;

  @Get('/list', { summary: '获取可选银行列表' })
  async list() {
    const banks = await this.bankRepo.find({
      select: ['id', 'code', 'name', 'shortName'],
      where: { status: 1 },
      order: { orderNum: 'ASC', id: 'ASC' },
    });
    return this.ok(banks);
  }
}

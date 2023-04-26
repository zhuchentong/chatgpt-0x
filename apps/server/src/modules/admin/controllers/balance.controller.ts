import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { BalanceService } from '../services/balance.service'
import { FindBalanceInput } from '../dtos/balances.dto'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'
import { Balance } from 'src/entities/balance.entity'

@Controller('balance')
@ApiTags('balance')
@ApiSecurity('access-token')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  @ApiOperation({ operationId: 'findUsers', summary: '查找余额列表' })
  @ApiOkResponse({ type: toPageResponse(Balance) })
  findAll(@Query() input: FindBalanceInput) {
    return this.balanceService.findAll(input.params)
  }
}

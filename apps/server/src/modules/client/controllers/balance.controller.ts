import { Controller, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger'
import { Balance } from 'src/entities/balance.entity'
import { BalanceService } from '../services/balance.service'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'

@Controller('balance')
@ApiTags('balance')
@ApiSecurity('access-token')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('get-user-balances')
  @ApiOperation({ operationId: 'getUserBalances', summary: '获取用户余额列表' })
  @ApiOkResponse({ type: Balance, isArray: true })
  getUserBalances(@RequestUser() user: User) {
    return this.balanceService.getUserBalances(user.id)
  }
}

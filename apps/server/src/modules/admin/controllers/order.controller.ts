import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { OrderService } from '../services/order.service'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'
import { Order } from 'src/entities/order.entity'
import { FindOrderInput } from '../dtos/order.dto'

@Controller('order')
@ApiTags('order')
@ApiSecurity('access-token')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({ operationId: 'findOrders', summary: '查找余额列表' })
  @ApiOkResponse({ type: toPageResponse(Order) })
  findAll(@Query() input: FindOrderInput) {
    return this.orderService.findAll(input.params)
  }
}

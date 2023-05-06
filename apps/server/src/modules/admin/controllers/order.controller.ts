import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
} from '@nestjs/common'
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
import { Public } from 'src/decorators/public.decorator'
import { WXPayService } from 'src/shared/wechat/services/wxpay.service'

@Controller('order')
@ApiTags('order')
@ApiSecurity('access-token')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly wxpayService: WXPayService,
  ) {}

  @Get()
  @ApiOperation({ operationId: 'findOrders', summary: '查找余额列表' })
  @ApiOkResponse({ type: toPageResponse(Order) })
  findAll(@Query() input: FindOrderInput) {
    return this.orderService.findAll(input.params)
  }

  @Public()
  @HttpCode(200)
  @Post('wxpay-notify')
  async onWXPayNativeNotify(@Body() { resource }: any) {
    if (!resource) {
      return
    }

    try {
      const response = this.wxpayService.decrypt({
        ciphertext: resource.ciphertext,
        nonce: resource.nonce,
        associatedData: resource.associated_data,
      })

      // 保存日志
      Logger.debug(response)

      const { out_trade_no, trade_state, amount, transaction_id } = response

      if (trade_state === 'SUCCESS') {
        await this.orderService.onPaymentSuccess({
          orderId: out_trade_no,
          orderAmount: amount.total,
          transactionId: transaction_id,
        })
      }
    } catch (e) {
      return {
        code: 'FAIL',
        message: '失败',
      }
    }
  }
}

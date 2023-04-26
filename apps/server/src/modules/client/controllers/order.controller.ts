import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger'
import { WXPayService } from 'src/shared/wechat/services/wxpay.service'
import {
  QueryPaymentStateResponse,
  SubmitOrderResponse,
} from '../responses/order.response'
import { QueryPaymentStateInput, SubmitOrderInput } from '../dtos/order.dto'
import { OrderService } from '../services/order.service'
import { ProductService } from '../services/product.service'
import { ToastException } from 'src/exceptions/toast.exception'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import * as qrcode from 'qrcode'
@Controller('order')
@ApiTags('order')
@ApiSecurity('access-token')
export class OrderController {
  constructor(
    private wxpayService: WXPayService,
    private orderService: OrderService,
    private productService: ProductService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Post('submit-order')
  @ApiOperation({ operationId: 'submitOrder' })
  @ApiOkResponse({ type: SubmitOrderResponse })
  async submitOrder(
    @RequestUser() user: User,
    @Body() { productId }: SubmitOrderInput,
  ) {
    const product = await this.productService.findOne(productId)

    if (!product) {
      throw new ToastException('产品不可购买')
    }

    const order = await this.orderService.createOrder(product, user)

    const url = await this.wxpayService.submitNativeOrder({
      orderNumber: order.id,
      amount: product.price,
      description: product.name,
    })

    if (!url) {
      throw new ToastException('创建订单失败失败')
    }

    const data = await qrcode.toDataURL(url)

    return {
      orderId: order.id,
      name: product.name,
      qrcode: data,
      price: product.price,
    }
  }

  @Get('query-payment-state/:orderId')
  @ApiOperation({
    description: '查询订单支付状态',
    operationId: 'queryPaymentState',
  })
  @ApiOkResponse({ type: QueryPaymentStateResponse })
  async queryPaymentState(@Param() { orderId }: QueryPaymentStateInput) {
    const state = await this.orderService.queryPaymentState(orderId)

    return {
      state,
    }
  }
}

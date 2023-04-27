import { Controller, HttpCode, Post, Body, Inject } from '@nestjs/common'
import { Public } from 'src/decorators/public.decorator'
import { WXPayService } from 'src/shared/wechat/services/wxpay.service'
import { OrderService } from '../services/order.service'
import { OrderState } from 'src/config/enum.config'
import { BalanceService } from '../services/balance.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { ApiExcludeController } from '@nestjs/swagger'
import { CACHE_WXPAY } from 'src/config/constants'

@ApiExcludeController()
@Controller('payment')
export class PaymentController {
  constructor(
    private wxpayService: WXPayService,
    private orderService: OrderService,
    private balanceService: BalanceService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * 支付成功处理
   * @param params
   */
  private async onPaymentSuccess({
    orderId,
    orderAmount,
    transactionId,
  }: {
    orderId: string
    orderAmount: number
    transactionId: string
  }) {
    const order = await this.orderService.findOne(orderId)

    if (
      order.id === orderId &&
      order.amount === orderAmount &&
      order.state === OrderState.Pending
    ) {
      // 订单支付成功
      order.state = OrderState.Paid
      order.paidTime = new Date()
      order.transactionId = transactionId

      // 更新订单状态
      await order.save({ reload: true })

      // 更新订单状态缓存
      this.cacheManager.set(`${CACHE_WXPAY}:${orderId}`, order.state, {
        ttl: 10,
      })

      // 更新用户余额
      await this.balanceService.createByOrder(order)
    }
  }

  @Public()
  @HttpCode(200)
  @Post('wxpay-native-notify')
  async onWXPayNativeNotify(@Body() { resource }: any) {
    if (!resource) {
      return
    }

    try {
      const { out_trade_no, trade_state, amount, transaction_id } = JSON.parse(
        this.wxpayService.decrypt({
          ciphertext: resource.ciphertext,
          nonce: resource.nonce,
          associatedData: resource.associated_data,
        }),
      )

      if (trade_state === 'SUCCESS') {
        await this.onPaymentSuccess({
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

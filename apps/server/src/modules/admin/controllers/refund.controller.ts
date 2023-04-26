import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { OrderState } from 'src/config/enum.config'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'
import { ToastException } from 'src/exceptions/toast.exception'
import { SubmitRefundInput } from '../dtos/order.dto'
import { OrderService } from '../services/order.service'
import { RefundService } from '../services/refund.service'
import { WXPayService } from 'src/shared/wechat/services/wxpay.service'
import { Public } from 'src/decorators/public.decorator'

@Controller('refund')
@ApiTags('refund')
@ApiSecurity('access-token')
export class RefundController {
  constructor(
    private readonly wxpayService: WXPayService,
    private readonly orderService: OrderService,
    private readonly refundService: RefundService,
  ) {}

  @Post('submit-refund')
  @ApiOperation({ operationId: 'submitRefund' })
  async submitRefund(
    @RequestUser() user: User,
    @Body() { orderId }: SubmitRefundInput,
  ) {
    const order = await this.orderService.findOne(orderId)

    if (!order) {
      throw new ToastException('订单不存在')
    }

    if (order.state !== OrderState.Paid) {
      throw new ToastException('订单无法退款')
    }

    const refund = await this.refundService.create(order)

    const data = await this.wxpayService.submitRefund({
      orderNumber: order.id,
      refundNumber: refund.id,
      orderAmount: order.price,
      refundAmount: order.price,
      description: '退款',
    })

    // TODO: 退款成功后，需要更新订单状态
    console.log(data)
  }

  @Public()
  @HttpCode(200)
  @Post('wxpay-notify')
  @ApiExcludeEndpoint()
  async onWXPayRefundNotify(@Body() { resource }: any) {
    if (!resource) {
      return
    }

    try {
      const {
        out_trade_no,
        out_refund_no,
        refund_status,
        amount,
        refund_id,
        success_time,
      } = JSON.parse(
        this.wxpayService.decrypt({
          ciphertext: resource.ciphertext,
          nonce: resource.nonce,
          associatedData: resource.associated_data,
        }),
      )

      console.log(out_refund_no)
      if (refund_status === 'SUCCESS') {
        // await this.onRefundSuccess({
        //   orderId: out_trade_no,
        //   orderAmount: amount.total,
        //   transactionId: transaction_id,
        // })
      }
    } catch (e) {
      return {
        code: 'FAIL',
        message: '失败',
      }
    }
  }

  private onRefundSuccess() {
    // TODO
  }
}

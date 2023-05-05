import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { OrderState, RefundState } from 'src/config/enum.config'
import { ToastException } from 'src/exceptions/toast.exception'
import { SubmitRefundInput } from '../dtos/order.dto'
import { OrderService } from '../services/order.service'
import { RefundService } from '../services/refund.service'
import { WXPayService } from 'src/shared/wechat/services/wxpay.service'
import { Public } from 'src/decorators/public.decorator'
import { nanoid } from 'nanoid'
import { Logger } from 'src/core/logger/services/logger.service'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'
import { Refund } from 'src/entities/refund.entity'
import { FindRefundInput } from '../dtos/refund.dto'

@Controller('refund')
@ApiTags('refund')
@ApiSecurity('access-token')
export class RefundController {
  constructor(
    private readonly wxpayService: WXPayService,
    private readonly orderService: OrderService,
    private readonly refundService: RefundService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({ operationId: 'findRefunds', summary: '查找退款列表' })
  @ApiOkResponse({ type: toPageResponse(Refund) })
  findAll(@Query() input: FindRefundInput) {
    return this.refundService.findAll(input.params)
  }

  @Post('submit-refund')
  @ApiOperation({ operationId: 'submitRefund' })
  async submitRefund(@Body() { orderId }: SubmitRefundInput) {
    // 生成退款单号
    const id = nanoid(24).toLocaleUpperCase()
    const order = await this.orderService.findOne(orderId)

    if (!order) {
      throw new ToastException('订单不存在')
    }

    if (order.state !== OrderState.Paid) {
      throw new ToastException('订单无法退款')
    }

    const { status, channel, refund_id, user_received_account } =
      await this.wxpayService.submitRefund({
        refundNumber: id,
        refundAmount: order.amount,
        orderNumber: order.id,
        orderAmount: order.amount,
        description: '退款',
      })

    return this.refundService.create(id, order, {
      state: status,
      channel,
      wxRefundId: refund_id,
      receivedAccount: user_received_account,
    })
  }

  @Public()
  @HttpCode(200)
  @Post('wxpay-notify')
  @ApiExcludeEndpoint()
  async onWXPayRefundNotify(@Body() { resource }: any) {
    console.log(resource)

    if (!resource) {
      return
    }

    try {
      const response = this.wxpayService.decrypt({
        ciphertext: resource.ciphertext,
        nonce: resource.nonce,
        associatedData: resource.associated_data,
      })

      // 打印日志
      this.logger.debug(response)

      const { out_refund_no, out_trade_no, refund_status, success_time } =
        response

      if (refund_status === 'SUCCESS') {
        await this.refundService.onRefundSuccess({
          out_refund_no,
          out_trade_no,
          refund_status,
          success_time,
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

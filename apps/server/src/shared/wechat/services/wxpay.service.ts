import { Inject, Injectable } from '@nestjs/common'
import { Logger } from 'src/core/logger/services/logger.service'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import WxPay from 'wechatpay-node-v3'
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3'
import { ToastException } from 'src/exceptions/toast.exception'

@Injectable()
export class WXPayService {
  constructor(
    private readonly logger: Logger,
    @Inject(WECHAT_PAY_MANAGER) private wxpay: WxPay,
  ) {}

  submitRefund({
    orderNumber,
    refundNumber,
    orderAmount,
    refundAmount,
    description,
  }: {
    orderNumber: string
    refundNumber: string
    orderAmount: number
    refundAmount: number
    description: string
  }) {
    const host = RequestContext.currentContext.host

    return this.wxpay
      .refunds({
        out_trade_no: orderNumber,
        out_refund_no: refundNumber,
        reason: description,
        notify_url: `https://${host}/api/admin/refund/wxpay-notify`,
        amount: {
          refund: refundAmount,
          total: orderAmount,
          currency: 'CNY',
        },
      })
      .then((response) => {
        // 输出日志
        this.logger.debug(response)

        if (response.status >= 400 && response.status <= 500) {
          throw new ToastException(response.message)
        }

        return response
      })
  }

  /**
   * 提交支付订单
   */
  submitNativeOrder({
    orderNumber,
    description,
    amount,
  }: {
    orderNumber: string
    description: string
    amount: number
  }): Promise<string> {
    const host = RequestContext.currentContext.host

    return this.wxpay
      .transactions_native({
        description,
        out_trade_no: orderNumber,
        notify_url: `https://${host}/api/admin/order/wxpay-notify`,
        amount: {
          total: amount,
          currency: 'CNY',
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          this.logger.error(response)
          throw new Error('支付失败')
        }

        return response.code_url
      })
  }

  /**
   * 解密微信支付回调数据
   * @param param0
   * @returns
   */
  decrypt({
    ciphertext,
    associatedData,
    nonce,
  }: {
    ciphertext: string
    associatedData: string
    nonce: string
  }) {
    return this.wxpay.decipher_gcm(ciphertext, associatedData, nonce) as any
  }
}

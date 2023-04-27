import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'src/core/logger/services/logger.service'
import { PayKit, RequestMethod, WX_API_TYPE, WX_DOMAIN } from 'tnwx'
import * as fs from 'node:fs'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import WxPay from 'wechatpay-node-v3'
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3'
import { ToastException } from 'src/exceptions/toast.exception'
import { RefundState } from 'src/config/enum.config'

@Injectable()
export class WXPayService {
  constructor(
    private readonly logger: Logger,
    private readonly config: ConfigService,
    @Inject(WECHAT_PAY_MANAGER) private wxpay: WxPay,
  ) {}

  /**
   * 调用微信支付API
   * @param method
   * @param type
   * @param options
   * @returns
   */
  private callAPI(
    method: RequestMethod,
    type: WX_API_TYPE,
    { data = {}, params = {} }: { data?: any; params?: Record<string, string> },
  ) {
    const wxpay = this.config.get('wxpay')

    console.log(
      method,
      WX_DOMAIN.CHINA,
      type,
      wxpay.mchId,
      wxpay.serialNo,
      JSON.stringify(data),
    )
    try {
      return PayKit.v3(
        method,
        WX_DOMAIN.CHINA,
        type,
        wxpay.mchId,
        wxpay.serialNo,
        fs.readFileSync(wxpay.keyPath),
        JSON.stringify(data),
        new Map(Object.entries(params)),
      )
    } catch (ex) {
      this.logger.error(ex)
    }
  }

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
        if (response.status >= 400 && response.status <= 500) {
          this.logger.error(response)
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
    const wxpay = this.config.get('wxpay')
    const host = RequestContext.currentContext.host

    return this.callAPI(RequestMethod.POST, WX_API_TYPE.NATIVE_PAY, {
      data: {
        appid: wxpay.appId,
        mchid: wxpay.mchId,
        description,
        out_trade_no: orderNumber,
        notify_url: `https://${host}/api/admin/payment/wxpay-native-notify`,
        amount: {
          total: amount,
          currency: 'CNY',
        },
      },
    }).then((response) => {
      if (response.status !== 200) {
        this.logger.error(response.data)
        throw new Error(response?.data)
      }

      return response.data.code_url
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
    const wxpay = this.config.get('wxpay')

    return PayKit.aes256gcmDecrypt(
      wxpay.privateKey,
      nonce,
      associatedData,
      ciphertext,
    )
  }
}

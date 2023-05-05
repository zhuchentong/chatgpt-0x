/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubmitOrderResponse = {
  /**
   * 微信支付二维码
   */
  qrcode: string;
  /**
   * 商品名称
   */
  name: string;
  /**
   * 价格
   */
  amount: number;
  /**
   * 订单ID
   */
  orderId: any;
}

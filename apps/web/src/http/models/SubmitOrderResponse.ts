/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubmitOrderResponse = {
  /**
   * 微信支付二维码
   */
  qrcode: string;
  /**
   * 商品标题
   */
  title: string;
  /**
   * 价格
   */
  price: number;
  /**
   * 订单ID
   */
  orderId: any;
}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubmitWechatOrderResponse = {
  /**
   * appId
   */
  appId: string;
  /**
   * timestamp
   */
  timeStamp: number;
  /**
   * nonceStr
   */
  nonceStr: string;
  /**
   * package
   */
  package: string;
  /**
   * signType
   */
  signType: string;
  /**
   * paySign
   */
  paySign: string;
}

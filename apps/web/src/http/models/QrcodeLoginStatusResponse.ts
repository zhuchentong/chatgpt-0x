/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type QrcodeLoginStatusResponse = {
  /**
   * 授权Token
   */
  access_token: string
  /**
   * 刷新Token
   */
  refresh_token: string
  /**
   * 授权Token过期时间
   */
  expires_in: number
  /**
   * Token来源
   */
  token_origin: string
  /**
   * 登录状态
   */
  status: boolean
}

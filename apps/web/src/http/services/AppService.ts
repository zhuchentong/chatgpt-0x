/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppBaseResponse } from '../models/AppBaseResponse';
import type { WeappLoginInput } from '../models/WeappLoginInput';
import type { TokenResponse } from '../models/TokenResponse';
import type { EmailLoginInput } from '../models/EmailLoginInput';
import type { QrcodeLoginResponse } from '../models/QrcodeLoginResponse';
import type { QrcodeLoginStatusResponse } from '../models/QrcodeLoginStatusResponse';
import type { EmailRegisterInput } from '../models/EmailRegisterInput';
import type { SendRegisterCodeInput } from '../models/SendRegisterCodeInput';
import type { User } from '../models/User';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class AppService {
  // 请求实例
  private request = RequestService.getInstance();
  private service = ''

  private generateRequest(
    requestSendOptions: RequestSendOptions,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ){
    switch(true){
      case requestGenerateOptions?.type === RequestGenerateType.URL:
        // 生成URL
        return this.request.toURL(
          requestSendOptions,
          requestPlugins
        );
      default: {
        // 请求数据
        const result =  this.request.send(
          requestSendOptions,
          requestPlugins
        );

        return result
      }
    }
  }

  /**
   * 获取系统基本信息
   */
  public appBase(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public appBase(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<AppBaseResponse>
  public appBase(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<AppBaseResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/app-base',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 用户登录
   */
  public weappLogin(
    requestBody: WeappLoginInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public weappLogin(
    requestBody: WeappLoginInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse>
  public weappLogin(
    requestBody: WeappLoginInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/weapp-login',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 用户登录
   */
  public emailLogin(
    requestBody: EmailLoginInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public emailLogin(
    requestBody: EmailLoginInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse>
  public emailLogin(
    requestBody: EmailLoginInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/email-login',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 二维码登录
   */
  public qrcodeLogin(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public qrcodeLogin(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<QrcodeLoginResponse>
  public qrcodeLogin(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<QrcodeLoginResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/qrcode-login',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 微信登录
   */
  public wechatLogin(
    requestQuery: RequestQueryParams.WechatLogin,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public wechatLogin(
    requestQuery: RequestQueryParams.WechatLogin,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse>
  public wechatLogin(
    requestQuery: RequestQueryParams.WechatLogin,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/wechat-login',
      method: 'post',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 二维码登录状态查询
   */
  public qrcodeLoginStatus(
    requestQuery: RequestQueryParams.QrcodeLoginStatus,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public qrcodeLoginStatus(
    requestQuery: RequestQueryParams.QrcodeLoginStatus,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<QrcodeLoginStatusResponse>
  public qrcodeLoginStatus(
    requestQuery: RequestQueryParams.QrcodeLoginStatus,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<QrcodeLoginStatusResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/qrcode-login-status',
      method: 'get',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 用户注册
   */
  public register(
    requestBody: EmailRegisterInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public register(
    requestBody: EmailRegisterInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse>
  public register(
    requestBody: EmailRegisterInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/register',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 发送注册验证码
   */
  public sendRegisterCode(
    requestBody: SendRegisterCodeInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public sendRegisterCode(
    requestBody: SendRegisterCodeInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public sendRegisterCode(
    requestBody: SendRegisterCodeInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/send-register-code',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 获取当前用户信息
   */
  public getCurrentUser(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getCurrentUser(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<User>
  public getCurrentUser(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<User> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/current',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 刷新Token
   */
  public token(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public token(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse>
  public token(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/refresh-token',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * API刷新Token
   */
  public apiToken(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public apiToken(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse>
  public apiToken(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<TokenResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/app/api-refresh-token',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
}


namespace RequestQueryParams {
  export type WechatLogin = {
    /**
     * 用户openid
     */
    openid: string;
    /**
     * 邀请人ID
     */
    inviter: string;
  }
  export type QrcodeLoginStatus = {
    /**
     * 用户登录码
     */
    code: string;
    /**
     * 邀请人ID
     */
    inviter: string;
  }
}

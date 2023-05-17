/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JSSignatureResponse } from '../models/JSSignatureResponse';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class WechatService {
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

  public checkSignature(
    requestQuery: RequestQueryParams.CheckSignature,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public checkSignature(
    requestQuery: RequestQueryParams.CheckSignature,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public checkSignature(
    requestQuery: RequestQueryParams.CheckSignature,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/wechat/message',
      method: 'get',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public WXMPController_message(
    requestQuery: RequestQueryParams.WXMPController_message,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public WXMPController_message(
    requestQuery: RequestQueryParams.WXMPController_message,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public WXMPController_message(
    requestQuery: RequestQueryParams.WXMPController_message,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/wechat/message',
      method: 'post',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public redirectAuthorize(
    requestQuery: RequestQueryParams.RedirectAuthorize,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public redirectAuthorize(
    requestQuery: RequestQueryParams.RedirectAuthorize,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public redirectAuthorize(
    requestQuery: RequestQueryParams.RedirectAuthorize,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/wechat/redirect-authorize',
      method: 'get',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public getJSSignature(
    requestQuery: RequestQueryParams.GetJSSignature,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getJSSignature(
    requestQuery: RequestQueryParams.GetJSSignature,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<JSSignatureResponse>
  public getJSSignature(
    requestQuery: RequestQueryParams.GetJSSignature,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<JSSignatureResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/wechat/js-sdk-signature',
      method: 'get',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
}


namespace RequestQueryParams {
  export type CheckSignature = {
    signature: string;
    timestamp: string;
    nonce: string;
    echostr: string;
  }
  export type WXMPController_message = {
    msg_signature: string;
    timestamp: string;
    nonce: string;
    openid: string;
    appId: string;
  }
  export type RedirectAuthorize = {
    /**
     * 邀请人
     */
    inviter?: string;
  }
  export type GetJSSignature = {
    url: string;
  }
}

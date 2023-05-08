/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmitOrderInput } from '../models/SubmitOrderInput';
import type { SubmitOrderResponse } from '../models/SubmitOrderResponse';
import type { SubmitWechatOrderResponse } from '../models/SubmitWechatOrderResponse';
import type { QueryPaymentStateResponse } from '../models/QueryPaymentStateResponse';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class OrderService {
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

  public submitOrder(
    requestBody: SubmitOrderInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public submitOrder(
    requestBody: SubmitOrderInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<SubmitOrderResponse>
  public submitOrder(
    requestBody: SubmitOrderInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<SubmitOrderResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/order/submit-order',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public submitWechatOrder(
    requestBody: SubmitOrderInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public submitWechatOrder(
    requestBody: SubmitOrderInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<SubmitWechatOrderResponse>
  public submitWechatOrder(
    requestBody: SubmitOrderInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<SubmitWechatOrderResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/order/submit-wechat-order',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public queryPaymentState(
    orderId: string,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public queryPaymentState(
    orderId: string,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<QueryPaymentStateResponse>
  public queryPaymentState(
    orderId: string,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<QueryPaymentStateResponse> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/order/query-payment-state/{orderId}',
      method: 'get',
      paramsPath: {
        orderId,
      },
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
}


namespace RequestQueryParams {
}

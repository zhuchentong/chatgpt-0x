/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageRefund } from '../models/PageRefund';
import type { SubmitRefundInput } from '../models/SubmitRefundInput';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class RefundService {
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
   * 查找退款列表
   */
  public findRefunds(
    requestQuery: RequestQueryParams.FindRefunds,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public findRefunds(
    requestQuery: RequestQueryParams.FindRefunds,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageRefund>
  public findRefunds(
    requestQuery: RequestQueryParams.FindRefunds,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageRefund> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/refund',
      method: 'get',
      paramsQuery: requestQuery,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public submitRefund(
    requestBody: SubmitRefundInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public submitRefund(
    requestBody: SubmitRefundInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public submitRefund(
    requestBody: SubmitRefundInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/refund/submit-refund',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
}


namespace RequestQueryParams {
  export type FindRefunds = {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 订单ID
     */
    orderId?: string;
    /**
     * 退款状态
     */
    state?: 'PROCESSING' | 'ABNORMAL' | 'SUCCESS' | 'CLOSED';
  }
}

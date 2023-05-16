/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageOrder } from '../models/PageOrder';
import type { OrderStaticial } from '../models/OrderStaticial';
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

  /**
   * 查找余额列表
   */
  public findOrders(
    requestQuery: RequestQueryParams.FindOrders,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public findOrders(
    requestQuery: RequestQueryParams.FindOrders,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageOrder>
  public findOrders(
    requestQuery: RequestQueryParams.FindOrders,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageOrder> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/order',
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
   * 获取订单统计信息
   */
  public getOrderStaticial(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getOrderStaticial(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<OrderStaticial>
  public getOrderStaticial(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<OrderStaticial> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/order/order-staticial',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public OrderController_onWXPayNativeNotify(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public OrderController_onWXPayNativeNotify(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public OrderController_onWXPayNativeNotify(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/order/wxpay-notify',
      method: 'post',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
}


namespace RequestQueryParams {
  export type FindOrders = {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 产品类型
     */
    productType?: string;
    /**
     * 产品名称
     */
    productName?: string;
    /**
     * 订单状态
     */
    state?: 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED';
  }
}

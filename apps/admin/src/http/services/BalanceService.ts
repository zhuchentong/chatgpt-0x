/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageBalance } from '../models/PageBalance';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class BalanceService {
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
  public findBalances(
    requestQuery: RequestQueryParams.FindBalances,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public findBalances(
    requestQuery: RequestQueryParams.FindBalances,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageBalance>
  public findBalances(
    requestQuery: RequestQueryParams.FindBalances,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageBalance> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/balance',
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
  export type FindBalances = {
    /**
     * 用户ID
     */
    userId?: string;
    /**
     * 余额类型
     */
    type?: string;
    /**
     * 余额来源
     */
    origin?: string;
  }
}

/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Assistant } from '../models/Assistant';
import type { PageAssistant } from '../models/PageAssistant';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class AssistantService {
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
   * 获取所有助手
   */
  public getAssistantByKeys(
    requestQuery: RequestQueryParams.GetAssistantByKeys,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getAssistantByKeys(
    requestQuery: RequestQueryParams.GetAssistantByKeys,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant[]>
  public getAssistantByKeys(
    requestQuery: RequestQueryParams.GetAssistantByKeys,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant[]> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/assistant/keys',
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
   * 获取所有助手
   */
  public getAllAssistant(
    requestQuery: RequestQueryParams.GetAllAssistant,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getAllAssistant(
    requestQuery: RequestQueryParams.GetAllAssistant,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageAssistant>
  public getAllAssistant(
    requestQuery: RequestQueryParams.GetAllAssistant,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageAssistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/assistant',
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
   * 获取助手
   */
  public getAssistant(
    id: string,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getAssistant(
    id: string,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant>
  public getAssistant(
    id: string,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/client/assistant/{id}',
      method: 'get',
      paramsPath: {
        id,
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
  export type GetAssistantByKeys = {
    /**
     * id列表
     */
    keys?: string[];
  }
  export type GetAllAssistant = {
    /**
     * 助手名称(模糊查询)
     */
    name?: string;
  }
}

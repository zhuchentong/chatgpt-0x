/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OpenAIKey } from '../models/OpenAIKey';
import type { KeyInput } from '../models/KeyInput';
import type { UpdateOpenAIKeyInput } from '../models/UpdateOpenAIKeyInput';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class KeyService {
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

  public getOpenAIKeys(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getOpenAIKeys(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<OpenAIKey[]>
  public getOpenAIKeys(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<OpenAIKey[]> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/openai/key',
      method: 'get',
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public createKey(
    requestBody: KeyInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public createKey(
    requestBody: KeyInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public createKey(
    requestBody: KeyInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/openai/key',
      method: 'post',
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public updateKey(
    key: string,
    requestBody: UpdateOpenAIKeyInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public updateKey(
    key: string,
    requestBody: UpdateOpenAIKeyInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public updateKey(
    key: string,
    requestBody: UpdateOpenAIKeyInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/openai/key/{key}',
      method: 'patch',
      paramsPath: {
        key,
      },
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public removeKey(
    key: string,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public removeKey(
    key: string,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public removeKey(
    key: string,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/openai/key/{key}',
      method: 'delete',
      paramsPath: {
        key,
      },
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  public syncBalances(
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public syncBalances(
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public syncBalances(
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/openai/key/sync-balances',
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
}

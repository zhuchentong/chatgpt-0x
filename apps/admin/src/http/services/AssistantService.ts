/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAssistantInput } from '../models/CreateAssistantInput';
import type { Assistant } from '../models/Assistant';
import type { PageAssistant } from '../models/PageAssistant';
import type { UpdateAssistantInput } from '../models/UpdateAssistantInput';
import type { ImportAssistantsInput } from '../models/ImportAssistantsInput';
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
   * 创建助手
   */
  public createAssistant(
    requestBody: CreateAssistantInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public createAssistant(
    requestBody: CreateAssistantInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant>
  public createAssistant(
    requestBody: CreateAssistantInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/assistant',
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
   * 查找助手
   */
  public findAssistant(
    requestQuery: RequestQueryParams.FindAssistant,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public findAssistant(
    requestQuery: RequestQueryParams.FindAssistant,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageAssistant>
  public findAssistant(
    requestQuery: RequestQueryParams.FindAssistant,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageAssistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/assistant',
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
      path: '/api/admin/assistant/{id}',
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
  
  /**
   * 更新助手
   */
  public updateAssistant(
    id: string,
    requestBody: UpdateAssistantInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public updateAssistant(
    id: string,
    requestBody: UpdateAssistantInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant>
  public updateAssistant(
    id: string,
    requestBody: UpdateAssistantInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/assistant/{id}',
      method: 'patch',
      paramsPath: {
        id,
      },
      paramsBody: requestBody,
    }
  
    return this.generateRequest(
      requestSendOptions,
      requestPlugins,
      requestGenerateOptions
    )
  
  
  }
  
  /**
   * 删除助手
   */
  public removeAssistant(
    id: string,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public removeAssistant(
    id: string,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public removeAssistant(
    id: string,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/assistant/{id}',
      method: 'delete',
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
  
  /**
   * 导入助手
   */
  public importAssistants(
    requestBody: ImportAssistantsInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public importAssistants(
    requestBody: ImportAssistantsInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public importAssistants(
    requestBody: ImportAssistantsInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/assistant/import',
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
  export type FindAssistant = {
    /**
     * 助手名称(模糊查询)
     */
    name?: string;
  }
}

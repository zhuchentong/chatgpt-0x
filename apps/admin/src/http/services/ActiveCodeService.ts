/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateActiveCodeInput } from '../models/CreateActiveCodeInput';
import type { ActiveCode } from '../models/ActiveCode';
import type { PageActiveCode } from '../models/PageActiveCode';
import type { Assistant } from '../models/Assistant';
import type { UpdateActiveCodeInput } from '../models/UpdateActiveCodeInput';
import { RequestService, RequestGenerateType, type RequestSendOptions, type RequestPlugin, type RequestGenerateOptions } from '@gopowerteam/request';
export class ActiveCodeService {
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
   * 创建兑换码
   */
  public createActiveCode(
    requestBody: CreateActiveCodeInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public createActiveCode(
    requestBody: CreateActiveCodeInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<ActiveCode>
  public createActiveCode(
    requestBody: CreateActiveCodeInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<ActiveCode> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/active-code',
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
   * 查找激活码
   */
  public findActiveCodes(
    requestQuery: RequestQueryParams.FindActiveCodes,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public findActiveCodes(
    requestQuery: RequestQueryParams.FindActiveCodes,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageActiveCode>
  public findActiveCodes(
    requestQuery: RequestQueryParams.FindActiveCodes,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<PageActiveCode> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/active-code',
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
   * 获取激活码
   */
  public getActiveCode(
    id: string,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public getActiveCode(
    id: string,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant>
  public getActiveCode(
    id: string,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/active-code/{id}',
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
   * 更新激活码
   */
  public updateActiveCode(
    id: string,
    requestBody: UpdateActiveCodeInput,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public updateActiveCode(
    id: string,
    requestBody: UpdateActiveCodeInput,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant>
  public updateActiveCode(
    id: string,
    requestBody: UpdateActiveCodeInput,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<Assistant> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/active-code/{id}',
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
   * 删除激活码
   */
  public removeActiveCode(
    id: string,
    requestPlugins: RequestPlugin[],
    requestGenerateOptions: RequestGenerateOptions & { type: RequestGenerateType.URL }
  ): string
  public removeActiveCode(
    id: string,
    requestPlugins?: RequestPlugin[],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void>
  public removeActiveCode(
    id: string,
    requestPlugins: RequestPlugin[] = [],
    requestGenerateOptions?: RequestGenerateOptions
  ): Promise<void> | string {
    const requestSendOptions = {
      service: this.service,
      path: '/api/admin/active-code/{id}',
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
  
}


namespace RequestQueryParams {
  export type FindActiveCodes = {
    key?: string;
    enable?: boolean;
    /**
     * 兑换类型
     */
    type?: 'COUNT' | 'TIME' | 'CYCLE';
  }
}

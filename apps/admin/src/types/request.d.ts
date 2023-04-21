declare module 'virtual:request' {
import { AdministratorService } from '~/http/services/AdministratorService'
import { AppService } from '~/http/services/AppService'
import { AssistantService } from '~/http/services/AssistantService'
import { ProductService } from '~/http/services/ProductService'
import { QiniuService } from '~/http/services/QiniuService'
import { WechatService } from '~/http/services/WechatService'

const serviceMap = {
  AdministratorService,
  AppService,
  AssistantService,
  ProductService,
  QiniuService,
  WechatService,
}

  export function useRequest<T1,T2,T3,T4,T5,T6>(
  select1: ((services: typeof serviceMap) => { new (): T1 }),
  select2: ((services: typeof serviceMap) => { new (): T2 }),
  select3: ((services: typeof serviceMap) => { new (): T3 }),
  select4: ((services: typeof serviceMap) => { new (): T4 }),
  select5: ((services: typeof serviceMap) => { new (): T5 }),
  select6: ((services: typeof serviceMap) => { new (): T6 }),
): [T1,T2,T3,T4,T5,T6]
export function useRequest<T1,T2,T3,T4,T5>(
  select1: ((services: typeof serviceMap) => { new (): T1 }),
  select2: ((services: typeof serviceMap) => { new (): T2 }),
  select3: ((services: typeof serviceMap) => { new (): T3 }),
  select4: ((services: typeof serviceMap) => { new (): T4 }),
  select5: ((services: typeof serviceMap) => { new (): T5 }),
): [T1,T2,T3,T4,T5]
export function useRequest<T1,T2,T3,T4>(
  select1: ((services: typeof serviceMap) => { new (): T1 }),
  select2: ((services: typeof serviceMap) => { new (): T2 }),
  select3: ((services: typeof serviceMap) => { new (): T3 }),
  select4: ((services: typeof serviceMap) => { new (): T4 }),
): [T1,T2,T3,T4]
export function useRequest<T1,T2,T3>(
  select1: ((services: typeof serviceMap) => { new (): T1 }),
  select2: ((services: typeof serviceMap) => { new (): T2 }),
  select3: ((services: typeof serviceMap) => { new (): T3 }),
): [T1,T2,T3]
export function useRequest<T1,T2>(
  select1: ((services: typeof serviceMap) => { new (): T1 }),
  select2: ((services: typeof serviceMap) => { new (): T2 }),
): [T1,T2]
export function useRequest<T>(
  select: ((services: typeof serviceMap) => { new (): T })
): T
export function useRequest<T>(
  ...selects: ((services: typeof serviceMap) => { new (): T })[]
): T | T[]
}

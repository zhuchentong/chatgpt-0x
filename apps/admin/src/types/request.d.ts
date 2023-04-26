declare module 'virtual:request' {
import { ActiveCodeService } from '~/http/services/ActiveCodeService'
import { AdministratorService } from '~/http/services/AdministratorService'
import { AppService } from '~/http/services/AppService'
import { AssistantService } from '~/http/services/AssistantService'
import { BalanceService } from '~/http/services/BalanceService'
import { KeyService } from '~/http/services/KeyService'
import { OrderService } from '~/http/services/OrderService'
import { ProductService } from '~/http/services/ProductService'
import { QiniuService } from '~/http/services/QiniuService'
import { RefundService } from '~/http/services/RefundService'
import { UserService } from '~/http/services/UserService'
import { WechatService } from '~/http/services/WechatService'

const serviceMap = {
  ActiveCodeService,
  AdministratorService,
  AppService,
  AssistantService,
  BalanceService,
  KeyService,
  OrderService,
  ProductService,
  QiniuService,
  RefundService,
  UserService,
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

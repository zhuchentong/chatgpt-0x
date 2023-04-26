import {
  BalanceOrigin,
  OpenAIKeyState,
  OrderState,
  ProductType,
  TabAction,
} from './enum.config'

export const TabActionDict = new Map<TabAction | string, string>([
  [TabAction.CLOSE_OTHER, '关闭其他'],
  [TabAction.CLOSE_RIGHT, '关闭右侧'],
])

export const OrderStateDict = new Map<OrderState | string, string>([
  [OrderState.Pending, '待支付'],
  [OrderState.Paid, '已支付'],
  [OrderState.Expired, '已过期'],
  [OrderState.Refunded, '已退款'],
])

export const ProductTypeDict = new Map<ProductType | string, string>([
  [ProductType.Count, '计次'],
  [ProductType.Time, '计时'],
])

export const ProductUnitDict = new Map<ProductType | string, string>([
  [ProductType.Count, '次'],
  [ProductType.Time, '天'],
])

export const BalanceOriginDict = new Map<BalanceOrigin | string, string>([
  [BalanceOrigin.Code, '兑换码'],
  [BalanceOrigin.Order, '订单'],
])

export const EnableStateDict = new Map<boolean, string>([
  [true, '启用'],
  [false, '停用'],
])

export const OpenAIKeyStateDict = new Map<OpenAIKeyState | string, string>([
  [OpenAIKeyState.Valid, '正常'],
  [OpenAIKeyState.Invalid, '失效'],
])

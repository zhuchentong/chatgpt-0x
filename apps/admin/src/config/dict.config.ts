import {
  BalanceOrigin,
  OpenAIKeyState,
  OrderState,
  ProductType,
  RefundState,
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

export const RefundStateDict = new Map<RefundState | string, string>([
  [RefundState.Processing, '退款处理中'],
  [RefundState.Abnormal, '退款异常'],
  [RefundState.Success, '退款成功'],
  [RefundState.Closed, '退款关闭'],
])

export const RefundChannelDict = new Map<string, string>([
  ['ORIGINAL', '原路退回'],
  ['BALANCE', '退回余额'],
  ['OTHER_BALANCE', '退回其他余额'],
  ['OTHER_BANKCARD', '退回其他银行卡'],
])

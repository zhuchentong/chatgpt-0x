import { BalanceOrigin, CycleType, TabAction } from './enum.config'

export const TabActionDict = new Map<TabAction | string, string>([
  [TabAction.CLOSE_OTHER, '关闭其他'],
  [TabAction.CLOSE_RIGHT, '关闭右侧'],
])

export const CycleTypeDict = new Map<CycleType | string, string>([
  [CycleType.Minute, '每分钟'],
  [CycleType.Day, '每天'],
  [CycleType.Week, '每周'],
  [CycleType.Month, '每月'],
])

export const BalanceOriginDict = new Map<BalanceOrigin | string, string>([
  [BalanceOrigin.Code, '兑换码'],
  [BalanceOrigin.Order, '订单'],
  [BalanceOrigin.Invite, '邀请赠送'],
  [BalanceOrigin.Register, '注册赠送'],
])

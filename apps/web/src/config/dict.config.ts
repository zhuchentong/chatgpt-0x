import { CycleType, TabAction } from './enum.config'

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

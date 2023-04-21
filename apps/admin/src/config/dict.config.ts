import { ProductType, TabAction } from './enum.config'

export const TabActionDict = new Map<TabAction | string, string>([
  [TabAction.CLOSE_OTHER, '关闭其他'],
  [TabAction.CLOSE_RIGHT, '关闭右侧'],
])

export const ProductTypeDict = new Map<ProductType | string, string>([
  [ProductType.Count, '计次'],
  [ProductType.Time, '计时'],
])

export const EnableStateDict = new Map<boolean, string>([
  [true, '启用'],
  [false, '停用'],
])

import { OpenAIKeyState, TabAction } from './enum.config'

export const TabActionDict = new Map<TabAction | string, string>([
  [TabAction.CLOSE_OTHER, '关闭其他'],
  [TabAction.CLOSE_RIGHT, '关闭右侧'],
])

export const OpenAIKeyStateDict = new Map<OpenAIKeyState | string, string>([
  [OpenAIKeyState.Valid, '正常'],
  [OpenAIKeyState.Invalid, '失效'],
])

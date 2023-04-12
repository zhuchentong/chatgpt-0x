import type { ChatRole } from '@/config/enum.config'

export interface AssistantChatRecord extends ChatRecord {
  id: string
  model: string
  parentMessageId?: string
}

export interface UserChatRecord extends ChatRecord {
  role: ChatRole.User
}

export interface ChatRecord {
  role: ChatRole
  content: string
  datetime?: number
  deleted?: boolean
}

export interface Chat {
  id: string
  title: string
  inputing: boolean
  usage: number
  records: (AssistantChatRecord | UserChatRecord)[]
  deleted?: boolean
}

export interface Assistant extends AssistantOptions {
  id: string
  chats: Chat[]
  default?: boolean
}

export interface AssistantOptions {
  default?: boolean
  /**
   * 头像 avatar-000 - avatar-050
   */
  avatar?: string
  /**
   * 显示名称
   */
  name: string
  /**
   * 提示词
   */
  prompt: string
  /**
   * 主动聊天
   */
  auto?: boolean
  /**
   * 输入提示
   */
  placeholder?: string
  /**
   * 示例
   */
  examples?: string[]
  /**
   * 保持上下文
   * default: true
   */
  keepContext?: boolean
}

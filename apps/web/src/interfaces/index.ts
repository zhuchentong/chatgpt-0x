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
  assistantId: string
  title: string
  inputing: boolean
  waiting: boolean
  eventSource?: { close: () => void }
  usage: number
  records: (AssistantChatRecord | UserChatRecord)[]
  deleted?: boolean
}

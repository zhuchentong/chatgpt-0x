import type { ChatRole } from '@/config/enum.config'

export interface AssistantChatRecord extends ChatRecord {
  model: string
  parentMessageId?: string
}

export interface UserChatRecord extends ChatRecord {
  role: ChatRole.User
}

export interface ChatRecord {
  id: string
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

export interface ChatMessage {
  id: string
  text: string
  role: 'user' | 'assistant' | 'system'
  name?: string
  delta?: string
  detail?: {
    id: string
    object: 'chat.completion.chunk'
    created: number
    model: string
    choices: [
      {
        delta: {
          role: 'user' | 'assistant' | 'system'
          content?: string
        }
        index: number
        finish_reason: string | null
      },
    ]
  }
  parentMessageId?: string
  conversationId?: string
}

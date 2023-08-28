import { useRequest } from 'virtual:request'
import { RequestGenerateType } from '@gopowerteam/request'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { nanoid } from 'nanoid'
import type { AssistantChatRecord, Chat, ChatMessage } from '@/interfaces'
import { useStore } from '@/store'
import { ChatRole } from '@/config/enum.config'

function appendUserMessage(chat: Chat, message: string) {
  chat.records.push({
    id: `chatuser-${nanoid()}`,
    role: ChatRole.User,
    content: message,
    datetime: Date.now(),
  })
}

function appendChatMessage(chat: Chat, message: ChatMessage) {
  // 查找之前的消息
  const record = chat.records.find(
    (record) => record.role === ChatRole.Assistant && record.id === message.id,
  )

  // 存在历史消息则更新消息内容
  if (record) {
    record.content = message.text
  }
  // 不存在历史消息则添加消息
  else {
    chat.records.push({
      id: message.id,
      parentMessageId: message.parentMessageId,
      role: ChatRole.Assistant,
      content: message.text,
      datetime: Date.now(),
      model: '', // TODO:添加当前Model
      image: message.image,
    })
  }
}

/**
 * 发送聊天消息
 * @param message
 */
function sendChatMessage(message: string) {
  const openAIService = useRequest((service) => service.OpenaiService)
  const store = useStore()

  // 获取当前会话
  const chat = store.chat.currentChat
  // 获取当前助手
  const assistant = store.chat.currentAssistant
  // 获取上一条消息
  let lastMessage = null
  const messageId = nanoid()
  // 开启上下文
  if (store.chat.keepContext) {
    const messages = chat.records.filter(
      (record) =>
        record.role === ChatRole.Assistant && !record.deleted && !record.image,
    ) as AssistantChatRecord[]

    if (messages.length) {
      lastMessage = messages[messages.length - 1]
    }
  }

  const event = new EventSourcePolyfill(
    openAIService.message(
      {
        message,
        parentMessageId: lastMessage?.id,
        prompt: assistant.prompt,
        drawable: chat.drawable,
      },
      [],
      {
        type: RequestGenerateType.URL,
      },
    ),
    {
      headers: {
        Authorization: `Bearer ${store.user.accessToken}`,
      },
    },
  )

  const closeChat = () => {
    if (!chat.eventSource) {
      return
    }

    const [lastRecord] = chat.records.slice(-1)

    if (
      !chat.waiting &&
      chat.inputing &&
      lastRecord.role === ChatRole.Assistant
    ) {
      chat.records.splice(-1, 1)
    }

    chat.inputing = false
    chat.waiting = false
    delete chat.eventSource
    event.close()
  }

  const closeEvent = () => {
    chat.inputing = false
    chat.waiting = false
    delete chat.eventSource

    event.close()
  }

  try {
    event.addEventListener('message', ({ data }: { data: string }) => {
      chat.inputing = true
      chat.waiting = false
      switch (true) {
        case data.startsWith('[ERROR]'): {
          const errorMsg = data.replace('[ERROR]', '')
          const messageEventBus = useEventBus<{
            type: 'success' | 'error' | 'warning' | 'info'
            content: string
            duration: number
          }>('message')

          messageEventBus.emit({
            type: 'error',
            content: errorMsg,
            duration: 5000,
          })
          return closeEvent()
        }
        case data === '[DONE]':
          return closeEvent()
        default:
          appendChatMessage(chat, { id: messageId, ...JSON.parse(data) })
      }
    })
  } catch (e) {
    chat.inputing = false
    chat.waiting = false
  }

  event.addEventListener('error', () => closeEvent())

  chat.eventSource = {
    close: closeChat,
  }
}

export function useChat() {
  return {
    appendUserMessage,
    sendChatMessage,
  }
}

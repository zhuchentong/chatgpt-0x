import type { ChatMessage } from 'chatgpt'
import { useRequest } from 'virtual:request'
import { RequestGenerateType } from '@gopowerteam/request'
import type { AssistantChatRecord, Chat } from '@/interfaces'
import { useStore } from '@/store'
import { ChatRole } from '@/config/enum.config'

function appendUserMessage(chat: Chat, message: string) {
  chat.records.push({
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
  // 开启上下文
  if (store.chat.keepContext) {
    lastMessage = chat.records.findLast(
      (record) => record.role === ChatRole.Assistant && !record.deleted,
    ) as AssistantChatRecord
  }

  const event = new EventSource(
    openAIService.message(
      { message, parentMessageId: lastMessage?.id, prompt: assistant.prompt },
      [],
      {
        type: RequestGenerateType.URL,
      },
    ),
  )

  const closeEvent = () => {
    event.close()
    chat.inputing = false
    chat.waiting = false
    delete chat.eventSource
  }

  try {
    event.addEventListener('message', ({ data }) => {
      chat.inputing = true
      chat.waiting = false

      if (data === '[DONE]') {
        return closeEvent()
      }

      appendChatMessage(chat, JSON.parse(data))
    })
  } catch (e) {
    chat.inputing = false
    chat.waiting = false
  }

  event.addEventListener('error', () => closeEvent())

  chat.eventSource = {
    close: closeEvent,
  }
}

export function useChat() {
  return {
    appendUserMessage,
    sendChatMessage,
  }
}

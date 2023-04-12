import type { AssistantChatRecord, Chat } from '@/interfaces'
import { useStore } from '@/store'
import { ChatRole } from '@/config/enum.config'
import type { ChatMessage } from 'chatgpt'
import { useRequest } from 'virtual:request'
import { RequestGenerateType } from '@gopowerteam/request'

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
  const lastMessage = chat.records.findLast(
    (record) => record.role === ChatRole.Assistant && !record.deleted,
  ) as AssistantChatRecord

  // // 创建消息请求
  // const xhr = new XMLHttpRequest()
  // xhr.open('POST', '/api/chatgpt/message', true)
  // xhr.onprogress = () => {
  //   if (chat.inputing) {
  //     chat.inputing = false
  //   }

  //   if (xhr.responseText) {
  //     const text = xhr.responseText
  //     const chunk = text.substring(text.replace(/\n$/, '').lastIndexOf('\n'))
  //     const data = JSON.parse(chunk)

  //     appendChatMessage(chat, data)
  //   }
  // }

  // xhr.onload = () => {
  //   chat.inputing = false
  // }

  // xhr.onerror = () => {
  //   chat.inputing = false
  // }

  // xhr.setRequestHeader('Content-type', 'application/json')
  // xhr.send(
  //   JSON.stringify({
  //     message,
  //     parentMessageId: lastMessage?.id,
  //     prompt: assistant.prompt,
  //   }),
  // )

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
  }

  event.addEventListener('message', ({ data }) => {
    chat.inputing = false

    if (data === '[DONE]') {
      return closeEvent()
    }

    appendChatMessage(chat, JSON.parse(data))
  })

  event.addEventListener('error', () => closeEvent())
}

export function useChat() {
  return {
    appendUserMessage,
    sendChatMessage,
  }
}

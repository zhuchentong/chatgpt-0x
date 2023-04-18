import { useDialog } from 'naive-ui'
import { defineStore } from 'pinia'
import type { Assistant } from '@/http/models/Assistant'
import type { Chat } from '@/interfaces'

interface State {
  assistantItems: Assistant[]
  // 助手列表
  assistantKeys: string[]
  // 对话列表
  chats: Chat[]
  // 激活助手ID
  activeAssistant: string
  // 激活会话ID
  activeChat: string
}

const initialState: State = {
  assistantItems: [],
  assistantKeys: ['default-assistant'],
  chats: [
    {
      id: 'default-chat',
      assistantId: 'default-assistant',
      title: 'New Chat',
      usage: 0,
      inputing: false,
      records: [],
    },
  ],
  activeAssistant: 'default-assistant',
  activeChat: 'default-chat',
}

export const useChatStore = defineStore('chat', {
  state: () => initialState,

  getters: {
    currentChat(): Chat {
      return this.chats.find((x) => x.id === this.activeChat)!
    },
    currentAssistant(): Assistant {
      return this.assistantItems.find((x) => x.id === this.activeAssistant)!
    },
    assistants(): Assistant[] {
      return this.assistantItems.filter((item) =>
        this.assistantKeys.includes(item.id),
      )
    },
  },
  actions: {
    createAssistant(id: string) {
      this.assistantKeys.push(id)
      this.activeAssistant = id

      this.createChat()
    },
    deleteAssistant(id: string) {
      this.changeAssistant('default-assistant')

      this.assistantKeys = this.assistantKeys.filter((x) => x !== id)
    },
    createChat() {
      // const { appendChatMessage } = useChat();
      const assistant = this.currentAssistant
      const id = `ASSISTANT_${Math.random()
        .toString(32)
        .slice(2)
        .toUpperCase()}`

      const chat: Chat = {
        id,
        assistantId: assistant.id,
        title: 'New Chat',
        usage: 0,
        inputing: false,
        records: [],
      }

      this.chats.push(chat)
      this.activeChat = id
    },
    deleteChat(chat: Chat) {
      const dialog = useDialog()

      dialog.warning({
        title: '删除',
        content: '确定删除对话？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: () => {
          chat.deleted = true
        },
      })
    },
    clearChat() {
      this.currentChat.records.forEach((record) => (record.deleted = true))
    },
    changeChat(id: string) {
      this.activeChat = id
    },
    changeAssistant(id: string) {
      const assistant = this.assistants.find((x) => x.id === id)
      const chat = this.chats.find((chat) => chat.assistantId === assistant?.id)

      if (chat) {
        this.activeAssistant = id
        this.activeChat = chat.id
      }
    },
    appendAssistenItems(items: Assistant[]) {
      this.assistantItems = [...this.assistantItems, ...items]
    },
  },
  persist: {
    paths: [
      // 助手列表
      'assistantKeys',
      // 对话列表
      'chats',
      // 激活助手ID
      'activeAssistant',
      // 激活会话ID
      'activeChat',
    ],
  },
})

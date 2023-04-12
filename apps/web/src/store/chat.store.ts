import type { Assistant, AssistantOptions, Chat } from '@/interfaces'
import { useDialog } from 'naive-ui'
import { defineStore } from 'pinia'

type State = {
  // 助手列表
  assistants: Assistant[]
  // 激活助手ID
  activeAssistant: string
  // 激活会话ID
  activeChat: string
}

const initialState: State = {
  assistants: [
    {
      id: 'default-assistant',
      avatar: 'avatar-000',
      name: '智能助手',
      prompt: '',
      auto: true,
      chats: [
        {
          id: 'default-chat',
          title: 'New Chat',
          usage: 0,
          inputing: false,
          records: [],
        },
      ],
    },
  ],
  activeAssistant: 'default-assistant',
  activeChat: 'default-chat',
}

export const useChatStore = defineStore('chat', {
  state: () => initialState,

  getters: {
    currentChat(): Chat {
      return this.currentAssistant.chats.find((x) => x.id === this.activeChat)!
    },
    currentAssistant(): Assistant {
      return this.assistants.find((x) => x.id === this.activeAssistant)!
    },
  },
  actions: {
    createAssistant(options: AssistantOptions, isDefault?: boolean) {
      const id = `ASSISTANT_${Math.random()
        .toString(32)
        .slice(2)
        .toUpperCase()}`

      const assistant: Assistant = {
        id,
        chats: [],
        default: isDefault,
        ...options,
      }

      this.assistants.push(assistant)
      this.activeAssistant = id

      this.createChat()
    },
    deleteAssistant(id: string) {
      const target = this.assistants.find((x) => x.default)

      this.changeAssistant(target?.id!)

      this.assistants = this.assistants.filter((x) => x.id !== id)
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
        title: 'New Chat',
        usage: 0,
        inputing: false,
        records: [],
      }

      assistant.chats.push(chat)
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
      const [chat] = assistant?.chats || []
      this.activeAssistant = id
      this.activeChat = chat.id
    },
    toggleAssistantSettingShow() {
      //
    },
    toggleSystemSettingShow() {
      //
    },
  },
  persist: true,
})

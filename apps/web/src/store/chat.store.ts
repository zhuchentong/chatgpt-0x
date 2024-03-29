import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { Assistant } from '@/http/models/Assistant'
import type { Chat } from '@/interfaces'
import { useChat } from '@/composables/use-chat'

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
  // 是否保持上下文
  keepContext: boolean
  // 选择的对话
  selectChatRecords: string[] | undefined
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
      waiting: false,
      records: [],
    },
  ],
  activeAssistant: 'default-assistant',
  activeChat: 'default-chat',
  keepContext: true,
  selectChatRecords: undefined,
}

export const useChatStore = defineStore('chat', {
  state: () => initialState,

  getters: {
    currentChat(): Chat {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.chats.find((x) => x.id === this.activeChat)!
    },
    currentAssistant(): Assistant {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      if (!this.assistantKeys.includes(id)) {
        this.assistantKeys.push(id)
      }

      this.activeAssistant = id
      this.createChat()
    },
    deleteAssistant(id: string) {
      this.changeAssistant('default-assistant')

      this.assistantKeys = this.assistantKeys.filter((x) => x !== id)
      this.chats = this.chats.filter((chat) => chat.assistantId !== id)
    },
    createChat() {
      // const { appendChatMessage } = useChat();
      const assistant = this.currentAssistant
      const { sendChatMessage } = useChat()
      if (!assistant) {
        return
      }

      const id = nanoid()

      const chat: Chat = {
        id,
        assistantId: assistant.id,
        title: 'New Chat',
        usage: 0,
        inputing: false,
        waiting: false,
        records: [],
      }

      this.chats.push(chat)
      this.changeChat(id)

      if (assistant.foreword?.trim()) {
        // nextTick(() => {
        sendChatMessage(assistant.foreword)
        // })
      }
    },
    deleteChat(chat: Chat) {
      const chats = this.chats.filter((x) => x.assistantId === chat.assistantId)

      if (chats.length <= 1) {
        return
      }

      const index = chats.findIndex((x) => x.id === chat.id)

      this.changeChat(chats[index === 0 ? 1 : index - 1].id)

      this.chats.splice(
        this.chats.findIndex((x) => x.id === chat.id),
        1,
      )
    },
    clearChat() {
      this.currentChat.records = []
    },
    changeChat(id: string) {
      this.activeChat = id
      this.updateSelectChatRecordState(false)
    },
    changeAssistant(id: string) {
      const assistant = this.assistants.find((x) => x.id === id)
      const chat = this.chats.find((chat) => chat.assistantId === assistant?.id)

      if (chat) {
        this.activeAssistant = id
        this.changeChat(chat.id)
      }
    },
    appendAssistenItems(items: Assistant[]) {
      this.assistantItems = [...this.assistantItems, ...items]
    },
    toggleKeepContext() {
      this.keepContext = !this.keepContext
    },
    updateSelectChatRecordState(state: boolean) {
      if (state) {
        this.selectChatRecords = []
      } else {
        this.selectChatRecords = undefined
      }
    },
    toggleSelectChatRecord(id: string) {
      if (!this.selectChatRecords) {
        this.selectChatRecords = []
      }

      if (this.selectChatRecords.includes(id)) {
        this.selectChatRecords.splice(this.selectChatRecords.indexOf(id), 1)
      } else {
        this.selectChatRecords.push(id)
      }
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
      // 是否保持上下文
      'keepContext',
    ],
  },
})

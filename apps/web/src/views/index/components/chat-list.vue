<template>
  <div
    v-if="assistant"
    class="chat-list flex flex-col">
    <div class="actions flex justify-between items-center">
      <div
        class="flex items-center space-x-2 cursor-pointer"
        @click="store.app.toggleAssistantSettingShow()">
        <n-avatar
          bordered
          class="avatar"
          :class="{ active: store.chat.activeAssistant === assistant.id }"
          round
          :src="`/avatars/${assistant.avatar}.svg`" />
        <div>{{ assistant.name }}</div>
      </div>
      <div class="flex items-center">
        <n-button
          class="w-20px h-20px"
          text
          @click="store.app.toggleSystemSettingShow()">
          <icon-park-outline:more-one
            class="w-20px h-20px"></icon-park-outline:more-one>
        </n-button>
      </div>
    </div>
    <n-divider />
    <div class="space-y-2 items-start pl-10 pr-5 flex-auto">
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="flex justify-between items-center">
        <n-button
          text
          :type="store.chat.activeChat === chat.id ? 'primary' : 'default'"
          @click="() => onChangeChat(chat.id)">
          <template #icon>
            <icon-park-outline:message-one></icon-park-outline:message-one>
          </template>
          <span>{{ chat.title }}</span>
        </n-button>
        <n-button
          v-if="store.chat.activeChat === chat.id"
          class="w-16px"
          :disabled="chats.length <= 1"
          text
          @click="() => onDelete(chat)">
          <icon-park-outline:delete class="w-16px"></icon-park-outline:delete>
        </n-button>
      </div>
    </div>
    <n-divider />
    <div class="space-y-2">
      <n-button
        block
        @click="onCreateChat">
        新建会话
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-list {
  width: 250px;
  padding: 30px 20px 20px 20px;
  // background-color: red;
}
</style>

<script setup lang="ts">
import { useDialog } from 'naive-ui'
import type { Chat } from '@/interfaces'
import { useStore } from '@/store'

const dialog = useDialog()
const store = useStore()
const assistant = computed(() => store.chat.currentAssistant)
const chats = computed(() =>
  store.chat.chats.filter(
    (chat) => !chat.deleted && chat.assistantId === assistant.value.id,
  ),
)

function onCreateChat() {
  store.chat.createChat()
}

function onChangeChat(id: string) {
  store.chat.changeChat(id)
}

function onDelete(chat: Chat) {
  dialog.warning({
    title: '删除',
    content: '确定删除对话？',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      // chat.deleted = true
      store.chat.deleteChat(chat)
    },
  })
}
</script>

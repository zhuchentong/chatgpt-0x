<template>
  <div
    v-if="assistant"
    class="chat-list flex flex-col">
    <div class="actions flex justify-between items-center">
      <div class="flex items-center space-x-2 cursor-pointer">
        <n-avatar
          bordered
          class="avatar"
          :class="{ active: store.chat.activeAssistant === assistant.id }"
          round
          :src="`/avatars/${assistant.avatar}.svg`" />
        <div>{{ assistant.name }}</div>
      </div>
      <div class="flex items-center">
        <n-dropdown
          :options="options"
          trigger="hover"
          @select="onSelect">
          <n-button
            class="w-20px h-20px"
            text>
            <icon-park-outline:more-one
              class="w-20px h-20px"></icon-park-outline:more-one>
          </n-button>
        </n-dropdown>
      </div>
    </div>
    <n-divider style="margin: 10px" />
    <div class="space-y-2 items-start px-5 flex-auto">
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
    <div class="actions flex space-x-4 px-2">
      <n-button
        text
        @click="onExport">
        <NAvatar circle>
          <icon-park-outline:export
            style="font-size: 15px"></icon-park-outline:export>
        </NAvatar>
      </n-button>

      <n-button
        text
        @click="onClear">
        <NAvatar circle>
          <icon-park-outline:clear
            style="font-size: 15px"></icon-park-outline:clear>
        </NAvatar>
      </n-button>
      <NAvatar circle>
        <div
          v-if="store.chat.currentAssistant.id === 'default-assistant'"
          class="inline-block text-12px cursor-pointer"
          :class="{
            'text-[#4b9e5f]': store.chat.currentChat.drawable,
            'text-[#aeaeae]': !store.chat.currentChat.drawable,
          }"
          :focusable="false"
          ghost
          size="tiny"
          text
          title="绘图模式"
          @click="
            () =>
              (store.chat.currentChat.drawable =
                !store.chat.currentChat.drawable)
          ">
          <icon-park-outline:picture></icon-park-outline:picture>
        </div>
      </NAvatar>
      <NAvatar circle>
        <div
          class="text-15px cursor-pointer flex-center"
          :class="{
            'text-[#4b9e5f]': store.chat.keepContext,
            'text-[#5D5D62]': !store.chat.keepContext,
          }"
          :focusable="false"
          ghost
          size="tiny"
          text
          @click="store.chat.toggleKeepContext">
          <icon-park-outline:history></icon-park-outline:history>
        </div>
      </NAvatar>
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
  padding: 20px 10px;
  position: absolute;
  inset: 0;
  // background-color: red;
}
</style>

<script setup lang="ts">
import { NAvatar, useDialog, useMessage } from 'naive-ui'
import type { Chat } from '@/interfaces'
import { useStore } from '@/store'
import { useExport } from '@/composables/use-export'

const emits = defineEmits(['close'])
const message = useMessage()
const dialog = useDialog()
const store = useStore()
const { exportToPng } = useExport()
const assistant = computed(() => store.chat.currentAssistant)
const chats = computed(() =>
  store.chat.chats.filter(
    (chat) => !chat.deleted && chat.assistantId === assistant.value.id,
  ),
)

const options = [
  {
    label: '删除',
    key: 'delete',
  },
]

function onCreateChat() {
  store.chat.createChat()
  emits('close')
}

function onChangeChat(id: string) {
  store.chat.changeChat(id)
  emits('close')
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
      emits('close')
    },
  })
}

function onSelect() {
  dialog.warning({
    title: '删除',
    content: '确定删除助理？',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      store.chat.deleteAssistant(store.chat.currentAssistant.id)
      emits('close')
    },
  })
}

function onClear() {
  dialog.warning({
    title: '清除对话',
    content: '是否清空当前对话?',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      store.chat.clearChat()
    },
  })
}

function onExport() {
  if (
    store.chat.currentChat.records.filter((record) => !record.deleted)
      .length === 0
  ) {
    message.warning('暂无可导出的消息')
    return
  }

  dialog.info({
    title: '导出',
    content: '是否将会话保存为图片?',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      const element = document.getElementById('chat-content') as HTMLDivElement
      exportToPng(element)
    },
  })
}
</script>

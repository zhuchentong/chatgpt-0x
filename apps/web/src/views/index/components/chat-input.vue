<template>
  <div class="chat-input p-5 space-y-2">
    <div class="toolbar flex"></div>
    <div class="input-container flex items-end">
      <n-input
        v-model:value="inputText"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
        class="flex-auto"
        :placeholder="assistant?.placeholder || '请输入提问内容'"
        type="textarea"
        @keypress.exact.enter.stop.prevent="onSubmit" />
      <n-button
        class="w-50px h-35px"
        size="large"
        text
        title="发送消息"
        @click="onSubmit">
        <template #icon>
          <icon-park-outline:send></icon-park-outline:send>
        </template>
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import { useChat } from '@/composables/use-chat'
import { useStore } from '@/store'

const store = useStore()
const { sendChatMessage, appendUserMessage } = useChat()

let inputText = $ref('')
const assistant = computed(() => store.chat.currentAssistant)
const chat = $(computed(() => store.chat.currentChat))

/**
 * 发送消息
 */
function onSubmit() {
  if (!chat) {
    return
  }

  if (!inputText || chat.inputing || chat.waiting) {
    return
  }

  // 等待消息返回
  chat.waiting = true
  chat.inputing = false
  // 添加用户消息
  appendUserMessage(chat, inputText as string)
  // 发送聊天消息
  sendChatMessage(inputText as string)
  // 清空输入框
  inputText = ''
}
</script>

<template>
  <div class="chat-input p-5 space-y-2">
    <div class="toolbar flex"></div>
    <div class="input-container flex items-end">
      <n-input
        v-model:value="inputText"
        class="flex-auto"
        :placeholder="assistant.placeholder || '请输入消息'"
        type="textarea"
        @keypress.exact.enter.stop.prevent="onSubmit"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }" />
      <n-button
        text
        class="w-50px h-35px"
        size="large"
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
  chat.inputing = false
  if (!inputText || chat.inputing) {
    return
  }

  // 等待消息返回
  chat.inputing = true
  // 添加用户消息
  appendUserMessage(chat, inputText as string)
  // 发送聊天消息
  sendChatMessage(inputText as string)
  // 清空输入框
  inputText = ''
}
</script>

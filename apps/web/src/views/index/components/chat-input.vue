<template>
  <div class="chat-input p-5 space-y-2">
    <div class="toolbar flex"></div>
    <div
      class="input-container flex items-end"
      @keydown.exact.delete="resetInputIndex"
      @keydown.exact.down.stop.prevent="revertNextMessage"
      @keydown.exact.up.stop.prevent="revertPreviousMessage">
      <n-input
        v-model:value="inputText"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
        class="flex-auto"
        :placeholder="assistant?.placeholder || '请输入提问内容'"
        type="textarea"
        @keypress="resetInputIndex"
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
import { ChatRole } from '@/config/enum.config'
import { useStore } from '@/store'

const store = useStore()
const { sendChatMessage, appendUserMessage } = useChat()

let inputText = $ref('')
let inputIndex = $ref<number | undefined>()
const assistant = computed(() => store.chat.currentAssistant)
const chat = $(computed(() => store.chat.currentChat))

function resetInputIndex() {
  inputIndex = undefined
}

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

function revertPreviousMessage() {
  if (inputText && inputIndex === undefined) {
    return
  }

  const inputRecords = chat.records
    .filter((record) => !record.deleted && record.role === ChatRole.User)
    .filter((_, index) =>
      inputIndex === undefined ? true : index < inputIndex,
    )

  if (inputIndex === undefined) {
    inputIndex = inputRecords.length
  }
  inputIndex = inputRecords.length

  const [lastInput] = inputRecords.reverse()

  if (lastInput) {
    inputText = lastInput.content
    inputIndex--
  }
}

function revertNextMessage() {
  if (inputText && inputIndex === undefined) {
    return
  }

  const inputRecords = chat.records
    .filter((record) => !record.deleted && record.role === ChatRole.User)
    .filter((_, index) =>
      inputIndex === undefined ? true : index > inputIndex,
    )

  if (inputIndex === undefined) {
    inputIndex = inputRecords.length
  }

  const [lastInput] = inputRecords

  if (lastInput) {
    inputText = lastInput.content
    inputIndex++
  }
}
</script>

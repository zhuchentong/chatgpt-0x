<template>
  <div class="chat-box flex flex-col">
    <div class="chat-header-container">
      <ChatHeader></ChatHeader>
    </div>
    <div class="chat-record-container flex-auto relative">
      <div
        class="chat-record-list absolute inset-0 overflow-auto space-y-2"
        ref="record-list">
        <ClientOnly>
          <div id="chat-content">
            <ChatRecord
              v-for="(record, index) in records"
              :record="record"
              :index="index"></ChatRecord>
            <ChatRecord
              v-if="chat.inputing"
              :record="{ role: ChatRole.Assistant, content: '' }"
              loading></ChatRecord>
          </div>
        </ClientOnly>
      </div>
    </div>

    <div class="chat-input-container">
      <ChatInput></ChatInput>
    </div>
  </div>
</template>
<style lang="less" scoped>
.chat-box {
  flex: auto;
}

.chat-record-container {
  background-color: v-bind('theme.baseColor');
}
</style>
<script setup lang="ts">
import { useStore } from '@/store'
import ChatRecord from './chat-record.vue'
import ChatInput from './chat-input.vue'
import ChatHeader from './chat-header.vue'
import { ChatRole } from '@/config/enum.config'
import { useThemeVars } from 'naive-ui'
const store = useStore()
const theme = useThemeVars()
const records = computed(() => {
  return store.chat.currentChat.records.filter(
    (record) => record.role !== 'system' && !record.deleted,
  )
})

const recordListRef = $(templateRef<HTMLElement>('record-list'))

const chat = computed(() => store.chat.currentChat)

watch(
  () => [records, chat.value.inputing],
  () => {
    nextTick(() => {
      recordListRef.scrollTop = recordListRef.scrollHeight
    })
  },
  {
    deep: true,
  },
)

onMounted(() => {
  nextTick(() => {
    recordListRef.scrollTop = recordListRef.scrollHeight
  })
})
</script>

<template>
  <div
    class="text-center message-date"
    v-if="messageDate">
    {{ messageDate }}
  </div>
  <div
    class="chat-record flex items-center"
    :class="record.role">
    <div class="record-avatar">
      <n-avatar
        round
        :src="`/avatars/${assistant.avatar}.svg`"
        v-if="record.role === 'assistant'"></n-avatar>
      <n-avatar
        round
        v-else>
        <icon-park:avatar></icon-park:avatar>
      </n-avatar>
    </div>

    <div class="record-content">
      <ChatLoading
        v-if="loading"
        :role="record.role"
        :content="record.content"></ChatLoading>
      <ChatMessage
        v-else
        :role="record.role"
        :content="record.content"></ChatMessage>
    </div>

    <div class="m-0! delete hidden">
      <n-button
        v-if="!loading"
        text
        size="small"
        class="w-14px h-14px"
        @click="() => (record.deleted = true)">
        <icon-park-outline:delete></icon-park-outline:delete>
      </n-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.message-date {
  font-size: 12px;
  color: #7f7f7f;
  padding: 5px;
}

.chat-record {
  padding: 0 10px;
  .record-content {
    max-width: 85%;
    border-radius: 10px;
    margin: 10px;
    color: #fff;
    display: inline-block;
    line-height: 1.5;
  }

  &:hover {
    .delete {
      display: block;
    }
  }

  &.user {
    justify-content: end;
    .record-content {
      order: 1;
    }
    .record-avatar {
      order: 2;
    }
  }
}
</style>
<script setup lang="ts">
import type { ChatRecord } from '@/interfaces'
import { useStore } from '@/store'
import dayjs, { Dayjs } from 'dayjs'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { useMessage } from 'naive-ui'
import isToday from 'dayjs/plugin/isToday'
import ChatMessage from './chat-message.vue'
import ChatLoading from './chat-loading.vue'

dayjs.extend(isToday)

const props = defineProps<{
  index?: number
  record: ChatRecord
  loading?: boolean
}>()

const store = useStore()
const chat = $(computed(() => store.chat.currentChat))
const assistant = computed(() => store.chat.currentAssistant)
const message = useMessage()

marked.setOptions({
  highlight: function (code: string) {
    return hljs.highlightAuto(code).value
  },
})

const messageDate = computed(() => {
  if (props.index === undefined || !props.record.datetime) {
    return ''
  }

  const [last] = chat.records
    .filter((record) => !record.deleted)
    .slice(0, props.index)
    .reverse()

  const date = dayjs(props.record.datetime)

  if (
    last &&
    last.datetime &&
    (props.record.datetime - last.datetime) / 1000 <= 120
  ) {
    return ''
  }

  if (date.isToday()) {
    return date.format('hh:mm')
  } else {
    return date.format('YYYY-MM-DD hh:mm')
  }
})
</script>

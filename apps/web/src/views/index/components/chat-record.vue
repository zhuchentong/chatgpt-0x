<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    v-if="messageDate"
    class="text-center message-date">
    {{ messageDate }}
  </div>
  <div
    class="chat-record flex items-start"
    :class="record.role">
    <div class="record-avatar">
      <n-avatar
        v-if="record.role === 'assistant'"
        round
        :src="`/avatars/${assistant?.avatar}.svg`"></n-avatar>
      <n-avatar
        v-else
        round>
        <icon-park:avatar></icon-park:avatar>
      </n-avatar>
    </div>

    <div class="record-content">
      <ChatLoading
        v-if="loading"
        :content="record.content"
        :role="record.role"></ChatLoading>
      <ChatMessage
        v-else
        :content="record.content"
        :role="record.role"></ChatMessage>
    </div>

    <div class="m-0! delete hidden">
      <n-button
        v-if="!loading"
        class="w-14px h-14px"
        size="small"
        text
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

  .record-avatar {
    margin-top: 15px;
  }
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
import dayjs from 'dayjs'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { useMessage } from 'naive-ui'
import isToday from 'dayjs/plugin/isToday'
import ChatMessage from './chat-message.vue'
import ChatLoading from './chat-loading.vue'
import { useStore } from '@/store'
import type { ChatRecord } from '@/interfaces'

const props = defineProps<{
  index?: number
  record: ChatRecord
  loading?: boolean
}>()

dayjs.extend(isToday)

const store = useStore()
const chat = $(computed(() => store.chat.currentChat))
const assistant = computed(() => store.chat.currentAssistant)
const message = useMessage()

marked.setOptions({
  highlight(code: string) {
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

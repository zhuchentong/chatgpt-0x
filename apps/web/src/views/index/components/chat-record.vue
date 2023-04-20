<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    v-if="messageDate"
    class="text-center message-date">
    {{ messageDate }}
  </div>
  <div
    class="chat-record flex items-center"
    :class="record.role">
    <div class="record-avatar self-start">
      <n-avatar
        v-if="record.role === 'assistant'"
        round
        :src="`/avatars/${assistant?.avatar}.svg`"></n-avatar>
      <n-avatar
        v-else
        round
        src="/avatar.png"></n-avatar>
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

    <div
      v-if="!loading"
      class="flex items-center space-x-2 actions">
      <n-button
        size="tiny"
        text
        @click="onDelete">
        <template #icon>
          <icon-park-outline:delete></icon-park-outline:delete>
        </template>
      </n-button>
      <n-button
        v-if="record.role === ChatRole.Assistant"
        size="tiny"
        text
        @click="onCopy">
        <template #icon>
          <icon-park-outline:copy></icon-park-outline:copy>
        </template>
      </n-button>
      <n-button
        v-if="record.role === ChatRole.Assistant"
        size="tiny"
        text
        @click="onRedo">
        <template #icon>
          <icon-park-outline:redo></icon-park-outline:redo>
        </template>
      </n-button>
    </div>

    <!-- <div class="m-0! delete inline-block"></div> -->
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

  .actions {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease;
  }

  &:hover {
    .actions {
      opacity: 1;
      visibility: visible;
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
import isToday from 'dayjs/plugin/isToday'
import { useDialog, useMessage } from 'naive-ui'
import ChatMessage from './chat-message.vue'
import ChatLoading from './chat-loading.vue'
import { useStore } from '@/store'
import type { ChatRecord } from '@/interfaces'
import { ChatRole } from '@/config/enum.config'
import { useChat } from '@/composables/use-chat'

const props = defineProps<{
  index?: number
  record: ChatRecord
  loading?: boolean
}>()

dayjs.extend(isToday)

const store = useStore()
const chat = $(computed(() => store.chat.currentChat))
const assistant = computed(() => store.chat.currentAssistant)
const clipboard = useClipboard()
const message = useMessage()
const dialog = useDialog()
const { sendChatMessage } = useChat()

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

function onCopy() {
  if (clipboard.isSupported) {
    clipboard.copy(props.record.content).then(() => {
      message.success('复制成功')
    })
  }
}

function onDelete() {
  dialog.warning({
    title: '删除消息',
    content: '是否删除此消息?',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      // eslint-disable-next-line vue/no-mutating-props
      props.record.deleted = true
    },
  })
}

function onRedo() {
  // eslint-disable-next-line vue/no-mutating-props
  props.record.deleted = true

  const record = chat.records.findLast(
    (record) => record.deleted !== true && record.role === ChatRole.User,
  )

  if (record) {
    sendChatMessage(record.content)
  }
}
</script>

<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div
    v-if="messageDate"
    class="text-center chat-date">
    {{ messageDate }}
  </div>
  <div
    class="chat-record flex items-center"
    :class="record.role"
    :data-id="record.id">
    <div
      v-if="store.chat.selectChatRecords"
      class="record-select self-start">
      <n-checkbox :on-update:checked="onUpdateCheck"></n-checkbox>
    </div>
    <div class="record-avatar self-start">
      <n-avatar
        v-if="record.role === 'assistant'"
        round
        :src="`/avatars/${assistant?.avatar}.svg`"></n-avatar>
      <n-avatar
        v-else
        round
        src="/avatar.jpg"></n-avatar>
    </div>

    <div class="record-content desktop:max-w-[85%] mobile:max-w-[73%]">
      <ChatLoading
        v-if="loading"
        :content="record.content"
        :role="record.role"></ChatLoading>
      <ChatMessage
        v-else
        :content="record.content"
        :inputing="inputing"
        :role="record.role"></ChatMessage>
    </div>

    <div
      v-if="!loading"
      class="flex items-center space-x-2 actions">
      <n-dropdown
        :options="options"
        :placement="record.role === ChatRole.Assistant ? 'right-start' : 'left'"
        trigger="click"
        @select="onSelectAction">
        <n-button
          :focusable="false"
          size="small"
          text>
          <template #icon>
            <icon-park-outline:more-one></icon-park-outline:more-one>
          </template>
        </n-button>
      </n-dropdown>
    </div>

    <!-- <div class="m-0! delete inline-block"></div> -->
  </div>
</template>

<style lang="less" scoped>
.chat-date {
  font-size: 12px;
  color: #7f7f7f;
  padding: 5px;
}

.chat-record {
  padding: 0 10px;

  .record-avatar {
    margin-top: 15px;
  }

  .record-select {
    padding: 0px 10px;
    margin-top: 20px;
  }
  .record-content {
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
    justify-content: flex-end;
    .record-content {
      order: 1;
    }
    .record-avatar {
      order: 2;
    }
    .record-select {
      order: 3;
    }
  }
}
</style>

<script setup lang="tsx">
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { type DropdownOption, useDialog, useMessage } from 'naive-ui'
import ChatMessage from './chat-message.vue'
import ChatLoading from './chat-loading.vue'
import { useStore } from '@/store'
import type { ChatRecord } from '@/interfaces'
import { ChatRole } from '@/config/enum.config'
import { useChat } from '@/composables/use-chat'
import RawIconParkVoiceMessage from '~icons/icon-park-outline/voice-message?raw&width=1em&height=1em'
import RawIconParkDelete from '~icons/icon-park-outline/delete?raw&width=1em&height=1em'
import RawIconParkCopy from '~icons/icon-park-outline/copy?raw&width=1em&height=1em'
import RawIconParkRedo from '~icons/icon-park-outline/redo?raw&width=1em&height=1em'
import RawIconParkListCheckBox from '~icons/icon-park-outline/list-checkbox?raw&width=1em&height=1em'
import { useSpeech } from '@/composables/use-speech'

const props = defineProps<{
  index?: number
  record: ChatRecord
  loading?: boolean
  inputing: boolean
}>()

dayjs.extend(isToday)

const store = useStore()
const chat = $(computed(() => store.chat.currentChat))
const assistant = computed(() => store.chat.currentAssistant)
const clipboard = useClipboard({ legacy: true })
const message = useMessage()
const dialog = useDialog()
const { sendChatMessage } = useChat()
const { synthesizeSpeech } = useSpeech()

const options: DropdownOption[] = [
  {
    label: '播放',
    key: 'play',
    show:
      props.record.role === ChatRole.Assistant &&
      !props.record.content.startsWith('![alt image:'),
    icon: () => (
      <span
        class="contents"
        v-html={RawIconParkVoiceMessage}></span>
    ),
  },
  {
    label: '删除',
    key: 'delete',
    icon: () => (
      <span
        class="contents"
        v-html={RawIconParkDelete}></span>
    ),
  },
  {
    label: '复制',
    key: 'copy',
    show: props.record.role === ChatRole.Assistant,
    icon: () => (
      <span
        class="contents"
        v-html={RawIconParkCopy}></span>
    ),
  },
  {
    label: '重试',
    key: 'redo',
    show: props.record.role === ChatRole.Assistant,
    icon: () => (
      <span
        class="contents"
        v-html={RawIconParkRedo}></span>
    ),
  },
  {
    label: '多选',
    key: 'multiple',
    icon: () => (
      <span
        class="contents"
        v-html={RawIconParkListCheckBox}></span>
    ),
  },
]

function onSelectAction(action: string) {
  switch (action) {
    case 'play':
      onPlay()
      break
    case 'delete':
      onDelete()
      break
    case 'copy':
      onCopy()
      break
    case 'redo':
      onRedo()
      break
    case 'multiple':
      onMultiple()
      break
  }
}

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

function onMultiple() {
  store.chat.updateSelectChatRecordState(true)
}

function onPlay() {
  synthesizeSpeech(props.record.content)
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

  const records = chat.records.filter(
    (record) => record.deleted !== true && record.role === ChatRole.User,
  )

  if (records.length) {
    const record = records[records.length - 1]
    sendChatMessage(record.content)
  }
}

function onUpdateCheck() {
  store.chat.toggleSelectChatRecord(props.record.id)
}
</script>

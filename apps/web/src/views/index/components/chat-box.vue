<template>
  <div class="chat-box flex flex-col">
    <div class="chat-header-container">
      <ChatHeader></ChatHeader>
    </div>
    <div class="chat-record-container flex-auto relative">
      <div
        ref="record-list"
        class="chat-record-list absolute inset-0 overflow-auto space-y-2"
        @click.self="() => store.chat.updateSelectChatRecordState(false)">
        <div
          id="chat-content"
          ref="chat-content">
          <NButton
            v-if="displayIndex > 0"
            block
            class="py-5"
            tag="a"
            text
            type="primary"
            @click="onLoadMore">
            加载更多
          </NButton>
          <ChatRecord
            v-for="(record, index) in records"
            :key="index"
            :index="index"
            :inputing="index === records.length - 1 && chat.inputing"
            :record="record"></ChatRecord>
          <ChatRecord
            v-if="chat.waiting"
            :inputing="false"
            loading
            :record="{
              role: ChatRole.Assistant,
              content: '',
              id: 'waiting',
            }"></ChatRecord>
        </div>
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

.chat-record-list {
  // 滚动条美化
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: v-bind('theme.railColor');
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: v-bind('theme.bodyColor');
    border-radius: 4px;
  }
}
</style>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { useModal } from '@gopowerteam/vue-modal'
import ChatRecord from './chat-record.vue'
import ChatInput from './chat-input.vue'
import ChatHeader from './chat-header.vue'
import ImagePreview from '@/shared/components/image-preview.vue'
import { useStore } from '@/store'
import { ChatRole } from '@/config/enum.config'

const modal = useModal()
const store = useStore()
const theme = useThemeVars()

const displayCount = 20
let isLoadMore = false
let displayIndex = $ref(
  Math.max(
    store.chat.currentChat.records.filter((x) => !x.deleted).length -
      displayCount,
    0,
  ),
)

const records = computed(() => {
  return store.chat.currentChat.records
    .filter((record) => record.role !== 'system' && !record.deleted)
    .slice(displayIndex)
})
const recordListRef = $(templateRef<HTMLElement>('record-list'))
const chatContentRef = $(templateRef<HTMLElement>('chat-content'))

const chat = computed(() => store.chat.currentChat)

function addListenerImagePreview(img: HTMLImageElement) {
  if (img && !img.dataset.preview) {
    img.dataset.preview = 'true'
    img.addEventListener('click', () => {
      modal.open({
        component: ImagePreview,
        props: {
          src: img.src,
          width: 512,
        },
      })
    })
  }
}

function addListenerResizeEvent() {
  const resizeObserver = new ResizeObserver(() => {
    updateScrollTop()

    const img = chatContentRef.lastElementChild?.querySelector(
      '.record-content img',
    ) as HTMLImageElement | undefined

    if (img) {
      addListenerImagePreview(img)
    }
  })
  resizeObserver.observe(chatContentRef)
}

function updateScrollTop() {
  if (isLoadMore) {
    isLoadMore = false
    recordListRef.scrollTop = 0
  } else {
    recordListRef.scrollTop = recordListRef.scrollHeight
  }
}

onMounted(() => {
  nextTick(() => {
    recordListRef.scrollTop = recordListRef.scrollHeight
  })

  addListenerResizeEvent()

  chatContentRef.querySelectorAll('.record-content img').forEach((img) => {
    addListenerImagePreview(img as HTMLImageElement)
  })
})

function onLoadMore() {
  isLoadMore = true
  displayIndex = Math.max(displayIndex - displayCount, 0)
}
</script>

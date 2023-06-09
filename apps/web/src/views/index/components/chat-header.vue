<template>
  <div class="chat-header desktop:block mobile:hidden pt-15px">
    <n-tabs
      v-model:value="store.chat.activeChat"
      addable
      animated
      :on-add="() => store.chat.createChat()"
      tab-style="min-width:100px;display:flex;justify-content:center;"
      type="card">
      <n-tab
        v-for="chat in chats"
        :key="chat.id"
        :name="chat.id">
        <div
          v-if="chatEditing && store.chat.currentChat.id === chat.id"
          class="flex space-x-2">
          <n-input
            v-model:value="title"
            :maxlength="18"
            size="tiny"
            style="width: 120px"></n-input>
          <n-button
            size="tiny"
            text
            @click="() => ((chat.title = title), (chatEditing = false))">
            <icon-park-outline:check
              style="color: #17a058"></icon-park-outline:check>
          </n-button>
        </div>
        <div
          v-else
          class="flex space-x-2">
          <div>{{ chat.title }}</div>
        </div>
      </n-tab>
      <template #suffix>
        <div class="flex px-5 space-x-5">
          <div class="actions space-x-2">
            <Transition>
              <n-button
                v-if="
                  store.chat.currentChat.inputing ||
                  store.chat.currentChat.waiting
                "
                class="stop-btn"
                :focusable="false"
                size="tiny"
                text
                title="停止输入"
                type="warning"
                @click="onStop">
                <icon-park-outline:pause-one></icon-park-outline:pause-one>
              </n-button>
            </Transition>
            <div
              class="inline-block text-12px cursor-pointer"
              :class="{
                'text-[#4b9e5f]': store.chat.keepContext,
                'text-[#aeaeae]': !store.chat.keepContext,
              }"
              :focusable="false"
              ghost
              size="tiny"
              text
              title="保持上下文"
              @click="store.chat.toggleKeepContext">
              <icon-park-outline:history></icon-park-outline:history>
            </div>
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
            <n-button
              size="tiny"
              text
              title="编辑对话标题"
              @click="() => (chatEditing = true)">
              <icon-park-outline:edit-two></icon-park-outline:edit-two>
            </n-button>
            <n-button
              :focusable="false"
              size="tiny"
              text
              title="导出对话"
              @click="onExport">
              <icon-park-outline:export></icon-park-outline:export>
            </n-button>
            <n-button
              :focusable="false"
              size="tiny"
              text
              title="清空对话"
              @click="onClear">
              <icon-park-outline:clear></icon-park-outline:clear>
            </n-button>
            <n-button
              :disabled="chats.length <= 1"
              :focusable="false"
              size="tiny"
              text
              title="关闭对话"
              @click="onDelete">
              <icon-park-outline:close-one></icon-park-outline:close-one>
            </n-button>
          </div>
          <n-divider vertical></n-divider>
          <div
            class="flex items-center text-xs"
            title="更多设置">
            <div>
              {{ store.chat.currentAssistant.name }}
            </div>
            <n-button
              size="large"
              text
              @click="() => (showAsssistantSetting = true)">
              <template #icon>
                <icon-park-outline:more-one></icon-park-outline:more-one>
              </template>
            </n-button>
          </div>
        </div>
      </template>
    </n-tabs>
  </div>
  <div
    class="chat-header flex desktop-hidden items-center justify-center p-15px">
    <div class="left-actions absolute left-20px flex items-center">
      <NButton
        text
        @click="() => (showAssistantList = true)">
        <template #icon>
          <icon-park-outline:peoples></icon-park-outline:peoples>
        </template>
      </NButton>
    </div>
    <div class="title">{{ store.chat.currentChat.title }}</div>
    <div class="right-actions absolute right-15px space-x-2 flex flex-center">
      <NButton
        text
        @click="() => (showChatList = true)">
        <template #icon>
          <icon-park-outline:hamburger-button></icon-park-outline:hamburger-button>
        </template>
      </NButton>
    </div>
  </div>
  <n-drawer
    v-model:show="showAsssistantSetting"
    placement="right"
    :width="400">
    <n-drawer-content body-content-style="padding:0;">
      <AssistantSetting
        @close="() => (showAsssistantSetting = false)"></AssistantSetting>
    </n-drawer-content>
  </n-drawer>
  <n-drawer
    v-model:show="showAssistantList"
    placement="left"
    :width="300">
    <n-drawer-content body-content-style="padding:0;">
      <ChatSide></ChatSide>
    </n-drawer-content>
  </n-drawer>
  <n-drawer
    v-model:show="showChatList"
    placement="right"
    :width="300">
    <n-drawer-content body-content-style="padding:0;">
      <ChatList @close="() => (showChatList = false)"></ChatList>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped>
.stop-btn {
  &.v-enter-active,
  &.v-leave-active {
    transition: all 0.5s ease;
  }

  &.v-enter-from,
  &.v-leave-to {
    opacity: 0;
    margin-top: -40px;
    margin-bottom: 0px;
  }
}
</style>

<script setup lang="ts">
import { useDialog, useMessage } from 'naive-ui'
import ChatSide from './chat-side.vue'
import ChatList from './chat-list.vue'
import { useStore } from '@/store'
import { useExport } from '@/composables/use-export'
import AssistantSetting from '@/components/assistant-setting.vue'

const { exportToPng } = useExport()
const dialog = useDialog()
const store = useStore()
const message = useMessage()

const title = $ref(store.chat.currentChat.title)
const chatEditing = $ref(false)
const showAsssistantSetting = $ref(false)
const showAssistantList = $ref(false)
const showChatList = $ref(false)

const chats = computed(() =>
  store.chat.chats.filter(
    (chat) =>
      !chat.deleted && chat.assistantId === store.chat.currentAssistant.id,
  ),
)

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

function onDelete() {
  dialog.warning({
    title: '删除',
    content: '确定关闭当前对话？',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      store.chat.deleteChat(store.chat.currentChat)
    },
  })
}

function onStop() {
  const eventSource = store.chat.currentChat.eventSource

  if (eventSource && eventSource.close) {
    eventSource.close()
  }
}
</script>

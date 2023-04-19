<template>
  <div class="chat-header">
    <n-tabs
      addable
      animated
      :on-add="() => store.chat.createChat()"
      :on-update:value="(id) => store.chat.changeChat(id)"
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
            size="small"
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
            <n-button
              size="tiny"
              text
              @click="onExport">
              <icon-park-outline:export></icon-park-outline:export>
            </n-button>

            <n-button
              size="tiny"
              text
              @click="onClear">
              <icon-park-outline:clear></icon-park-outline:clear>
            </n-button>
            <n-button
              size="tiny"
              text
              @click="() => (chatEditing = true)">
              <icon-park-outline:edit-two></icon-park-outline:edit-two>
            </n-button>
          </div>
          <n-divider vertical></n-divider>
          <div class="flex items-center text-xs">
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
  <n-drawer
    v-model:show="showAsssistantSetting"
    placement="right"
    :width="400">
    <n-drawer-content body-content-style="padding:0;">
      <AssistantSetting
        @close="() => (showAsssistantSetting = false)"></AssistantSetting>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped>
.chat-header {
  padding: 15px 0px 0px 0px;
}
</style>

<script setup lang="ts">
import { useDialog, useMessage } from 'naive-ui'
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
</script>

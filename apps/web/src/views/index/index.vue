<template>
  <PageContainer absolute>
    <div
      class="chat-container flex absolute inset-0 shadow-2xl overflow-hidden">
      <div
        class="chat-side-wrapper desktop:block mobile:hidden relative min-w-250px">
        <ChatSide></ChatSide>
      </div>
      <ChatBox></ChatBox>
    </div>
  </PageContainer>
</template>

<style lang="less" scoped>
.chat-container {
  background-color: v-bind('theme.bodyColor');
}
</style>

<script setup lang="tsx">
import { useDialog, useThemeVars } from 'naive-ui'
import ChatSide from './components/chat-side.vue'
import ChatBox from './components/chat-box.vue'
import { useStore } from '@/store'
import Notification from '@/components/notification.vue'

const theme = useThemeVars()
const store = useStore()
const dialog = useDialog()

onMounted(() => {
  if (store.app.firstTime === true) {
    dialog.info({
      title: '通知',
      style: 'width:600px',
      content: () => (
        <div>
          <Notification></Notification>
        </div>
      ),
      onClose() {
        store.app.updateFirstTime()
      },
    })
  }
})
</script>

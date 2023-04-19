<template>
  <PageContainer absolute>
    <div
      class="chat-container flex absolute inset-0 shadow-2xl overflow-hidden">
      <ChatSide></ChatSide>
      <ChatBox></ChatBox>
    </div>
    <!-- <div class="desktop:flex mobile:hidden">
      <AssistantList></AssistantList>
    </div> -->
  </PageContainer>
</template>

<style lang="less" scoped>
.chat-container {
  background-color: v-bind('theme.bodyColor');
}
</style>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import ChatSide from './components/chat-side.vue'
import ChatBox from './components/chat-box.vue'
import { useStore } from '@/store'

const store = useStore()
const theme = useThemeVars()
</script>

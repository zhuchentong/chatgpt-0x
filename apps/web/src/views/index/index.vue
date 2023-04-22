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

const theme = useThemeVars()
</script>

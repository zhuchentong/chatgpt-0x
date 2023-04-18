<template>
  <div class="assistant-list flex space-x-5">
    <div
      v-for="assistant in store.chat.assistants"
      :key="assistant.id"
      class="assistant text-center"
      @click="() => onChangeAssistant(assistant.id)">
      <n-avatar
        bordered
        class="avatar"
        :class="{ active: store.chat.activeAssistant === assistant.id }"
        round
        :src="`/avatars/${assistant.avatar}.svg`" />
      <div class="text-center text-xs text-white">{{ assistant.name }}</div>
    </div>
    <n-button
      circle
      class="button"
      secondary
      strong
      type="primary"
      @click="() => $router.push('/assistant')">
      <template #icon>
        <icon-park-outline:plus
          :style="{ color: '#fff' }"></icon-park-outline:plus>
      </template>
    </n-button>
  </div>
</template>

<style lang="less" scoped>
.assistant-list {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  margin: 0 150px;
}
.assistant {
  cursor: pointer;
  .avatar {
    display: inline-block;
    height: 50px;
    width: 50px;
    &.active {
      border-color: #17a058;
    }
  }
}

.button {
  height: 50px;
  width: 50px;
}
</style>

<script setup lang="ts">
import { useStore } from '@/store'

const store = useStore()

function onChangeAssistant(id: string) {
  store.chat.changeAssistant(id)
}
</script>

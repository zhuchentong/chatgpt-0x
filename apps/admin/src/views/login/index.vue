<template lang="pug">
.login-container.absolute.inset-0.flex.overflow-hidden
  .flex-auto.flex-center.bg-gray-500.bg-opacity-20(class='lt-xl:hidden')
    transition-group(appear name='left' tag='div')
      img.w-350px(key='1' :src='loginIcon')
      .space-y-4(key='2')
        .welcome.text-3xl 欢迎使用
        .description.text-18px ChatGPT-0X管理端
  .flex-auto.flex-center
    transition-group(appear name='right' tag='div')
      LoginFrom(key='1')
</template>

<style lang="less" scoped>
.login-container {
  color: #ffffff;
  background-color: #293146;
}
.left-enter-active,
.left-leave-active {
  transition: all 0.5s ease;
}
.left-enter-from,
.left-leave-to {
  opacity: 0;
  transform: translateX(-300px);
}
.right-enter-active,
.right-leave-active {
  transition: all 0.5s ease;
}
.right-enter-from,
.right-leave-to {
  opacity: 0;
  transform: translateX(+300px);
}
</style>

<script lang="ts" setup>
import LoginFrom from './components/login-form.vue'
import loginIcon from '@/assets/svg/login-icon.svg?url'
</script>

<route lang="yaml">
name: login
meta:
  layout: blank
  requireAuth: false
</route>

<template lang="pug">
.welcome-container.absolute.inset-0.flex.overflow-hidden.flex-center
  .form-container
    .title.text-center.text-xl.py-5 管理员配置
    a-form(
      label-position='top'
      label-width='600px'
      :model='formModel'
      :rules='formRules'
      size='large'
      @submit-success='onSubmit')
      a-form-item(label='用户名')
        a-input(v-model='formModel.username')
      a-form-item(label='密码')
        a-input(v-model='formModel.password' type='password')
      a-form-item(hide-label)
        a-button.w-full.mx-20(html-type='submit' type='primary') 提交
</template>

<style lang="less" scoped>
.welcome-container {
  color: #fff;
  background-color: #293146;
}

.form-container {
  color: #000;
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
}
</style>

<script lang="ts" setup>
import type { FieldRule } from '@arco-design/web-vue'
import { useRequest } from 'virtual:request'

const router = useRouter()
const appService = useRequest((service) => service.AppService)

const formModel = $ref({
  username: '',
  password: '',
})

const formRules: Record<string, FieldRule> = {
  username: {
    required: true,
    message: '请输入用户名',
  },
  password: {
    required: true,
    message: '情输入密码',
  },
}

/**
 *
 */
function onSubmit() {
  appService
    .appInit({
      administrator: formModel,
    })
    .then(() => {
      router.push('/')
    })
}
</script>

<route lang="yaml">
name: welcome
meta:
  layout: blank
  requireAuth: false
</route>

<template lang="pug">
.form-container.w-400px.border.border-gray-500.p-20px.rounded
  .title.text-center.text-xl.py-5 用户登录
  a-form(
    label-position='top'
    label-width='120px'
    :model='formModel'
    :rules='formRules'
    @submit-success='onLogin')
    a-form-item(label='用户名')
      a-input(v-model='formModel.username')
    a-form-item(label='密码')
      a-input(v-model='formModel.password' type='password')
    a-form-item
      a-button.w-full(html-type='submit' type='primary') 登录
</template>

<script lang="ts" setup>
import type { FieldRule } from '@arco-design/web-vue'
import { useRequest } from 'virtual:request'
import { useStore } from '@/store'

const router = useRouter()
const store = useStore()
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
function onLogin() {
  appService.login(formModel).then(({ access_token, refresh_token }) => {
    store.user.updateToken({
      accessToken: access_token,
      refreshToken: refresh_token,
    })

    router.push('/')
  })
}
</script>

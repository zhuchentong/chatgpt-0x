<template>
  <n-form
    ref="form"
    :model="formModel"
    :rules="formRules">
    <n-form-item
      path="email"
      label="邮箱">
      <n-input
        v-model:value="formModel.email"
        @keydown.enter.prevent
        placeholder="请输入邮箱" />
    </n-form-item>
    <n-form-item
      path="password"
      label="密码">
      <n-input
        type="password"
        v-model:value="formModel.password"
        @keydown.enter.prevent
        placeholder="请输入密码" />
    </n-form-item>
    <n-form-item>
      <n-button
        type="primary"
        block
        @click="onSubmit">
        登录
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { type FormInst, type FormRules, useMessage } from 'naive-ui'
import { useRequest } from 'virtual:request'
const router = useRouter()
const message = useMessage()
const store = useStore()

const appService = useRequest((service) => service.AppService)

const form = $(templateRef<FormInst>('form'))
const formModel = reactive({
  email: '',
  password: '',
})

const formRules: FormRules = {
  email: [
    {
      type: 'email',
      message: '请确认邮箱格式是否正确',
    },
    {
      required: true,
      message: '邮箱不能为空',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
    },
  ],
}

function onSubmit() {
  form.validate((errors) => {
    if (errors) {
      return
    }

    requestLogin()
  })
}

/**
 * 请求登录
 */
async function requestLogin() {
  appService
    .login({ email: formModel.email, password: formModel.password })
    .then(({ access_token, refresh_token }) => {
      store.user.updateToken({
        assessToken: access_token,
        refreshToken: refresh_token,
      })

      message.success('登录成功')

      router.push('/')
    })
}
</script>

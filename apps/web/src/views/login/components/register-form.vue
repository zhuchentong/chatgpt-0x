<template>
  <n-form
    ref="form"
    :model="formModel"
    :rules="formRules">
    <n-form-item
      label="邮箱"
      path="email">
      <div class="flex w-full space-x-2">
        <n-input
          v-model:value="formModel.email"
          placeholder="请输入邮箱"
          @keydown.enter.prevent></n-input>
        <n-button
          :disabled="isActive"
          @click="onSendCode">
          发送验证码 {{ timer === 0 ? '' : timer }}
        </n-button>
      </div>
    </n-form-item>
    <n-form-item
      label="验证码"
      path="code">
      <n-input
        v-model:value="formModel.code"
        placeholder="请输入验证码"
        @keydown.enter.prevent />
    </n-form-item>
    <n-form-item
      label="密码"
      path="password">
      <n-input
        v-model:value="formModel.password"
        placeholder="请输入密码"
        type="password"
        @keydown.enter.prevent />
    </n-form-item>
    <n-form-item
      label="重复密码"
      path="repassowrd">
      <n-input
        v-model:value="formModel.repassword"
        placeholder="请再次输入密码"
        type="password"
        @keydown.enter.prevent />
    </n-form-item>
    <n-form-item>
      <n-button
        block
        type="primary"
        @click="onSubmit">
        注册
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { type FormInst, type FormRules, useMessage } from 'naive-ui'
import { useRequest } from 'virtual:request'
import { useStore } from '@/store'

const store = useStore()
const router = useRouter()
const form = $(templateRef<FormInst>('form'))
const message = useMessage()
let timer = $ref(0)

const appService = useRequest((service) => service.AppService)

const { pause, resume, isActive } = useIntervalFn(
  () => {
    if (timer <= 0) {
      pause()
    } else {
      timer--
    }
  },
  1000,
  {
    // 默认不开启定时任务
    immediate: false,
  },
)

const formModel = reactive({
  email: '',
  code: '',
  password: '',
  repassword: '',
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
  code: [
    {
      len: 6,
      message: '验证码长度为6位',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
    },
    {
      validator(_rule, value: string) {
        if (formModel.repassword && formModel.repassword !== value) {
          return Error('两次密码输入不一致')
        }
      },
    },
  ],
  repassword: [
    {
      required: true,
      message: '密码不能为空',
    },
    {
      validator(_rule, value: string) {
        if (formModel.password && formModel.password !== value) {
          return Error('两次密码输入不一致')
        }
      },
    },
  ],
}

function onSubmit() {
  form.validate(async (errors) => {
    if (errors) {
      return
    }

    await requestRegister()
  })
}

async function requestRegister() {
  appService
    .register({
      email: formModel.email,
      password: formModel.password,
      code: formModel.code,
    })
    .then(({ access_token, refresh_token }) => {
      store.user.updateToken({
        accessToken: access_token,
        refreshToken: refresh_token,
      })

      message.success('注册成功')
      router.push('/')
    })
}

function onSendCode() {
  appService
    .sendRegisterCode({
      email: formModel.email,
    })
    .then(() => {
      message.success('验证码已发送')
      timer = 60
      resume()
    })
    .catch(() => {
      // console.log(ex)
    })
}
</script>

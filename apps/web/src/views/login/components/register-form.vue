<template>
  <n-form
    ref="form"
    :model="formModel"
    :rules="formRules">
    <n-form-item
      path="email"
      label="邮箱">
      <div class="flex w-full space-x-2">
        <n-input
          v-model:value="formModel.email"
          @keydown.enter.prevent
          placeholder="请输入邮箱"></n-input>
        <n-button
          @click="onSendCode"
          :disabled="isActive">
          发送验证码 {{ timer === 0 ? '' : timer }}
        </n-button>
      </div>
    </n-form-item>
    <n-form-item
      path="code"
      label="验证码">
      <n-input
        v-model:value="formModel.code"
        @keydown.enter.prevent
        placeholder="请输入验证码" />
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
    <n-form-item
      path="repassowrd"
      label="重复密码">
      <n-input
        type="password"
        v-model:value="formModel.repassword"
        @keydown.enter.prevent
        placeholder="请再次输入密码" />
    </n-form-item>
    <n-form-item>
      <n-button
        type="primary"
        block
        @click="onSubmit">
        注册
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { type FormInst, type FormRules, useMessage } from 'naive-ui'
import { useRequest } from 'virtual:request'

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
        assessToken: access_token,
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
    .catch((ex) => {
      console.log(ex)
    })
}
</script>

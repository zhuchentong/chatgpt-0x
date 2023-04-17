<template>
  <page-container
    absolute
    layout="flex-center">
    <!-- <n-card class="form-container desktop:w-40%! mobile:w-90%!">
      <n-tabs
        class="card-tabs"
        default-value="login"
        justify-content="center"
        size="large"
        animated
        style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
        <n-tab-pane
          name="login"
          tab="登录">
          <login-form></login-form>
        </n-tab-pane>
        <n-tab-pane
          name="register"
          tab="注册">
          <register-form></register-form>
        </n-tab-pane>
      </n-tabs>
    </n-card> -->

    <n-card
      class="login-container"
      v-if="qrcode">
      <div class="qrcode-container">
        <img
          class="m-atuo"
          :src="qrcode" />
        <div>扫码关注公众号登录</div>
      </div>
    </n-card>
  </page-container>
</template>

<style lang="less" scoped>
.login-container {
  width: 400px;
  border-radius: 10px;

  .qrcode-container {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    img {
      width: 350px;
    }
  }
}
</style>

<script lang="ts" setup>
import { useRequest } from 'virtual:request'
import { useMessage } from 'naive-ui'
import { useStore } from '@/store'

const appService = useRequest((service) => service.AppService)

const message = useMessage()
const store = useStore()
const router = useRouter()
let qrcode = $ref('')
let code: string

/**
 * 请求登录二维码
 */
const { pause: pauseRequestLoginQrcode } = useIntervalFn(
  () => {
    appService.qrcodeLogin().then((data) => {
      qrcode = data.qrcode
      code = data.code
    })
  },
  1000 * 60 * 5,
  { immediateCallback: true },
)

/**
 * 请求登录二维码状态
 */
const { pause: pasueRequestLoginQrcodeStatus } = useIntervalFn(
  () => {
    if (!code || !qrcode) {
      return
    }

    appService
      .qrcodeLoginStatus(code)
      .then(({ status, access_token, refresh_token }) => {
        if (!status) {
          return
        }

        pasueRequestLoginQrcodeStatus()
        pauseRequestLoginQrcode()

        store.user.updateToken({
          accessToken: access_token,
          refreshToken: refresh_token,
        })

        message.success('登录成功')
        router.push('/')
      })
  },
  1000 * 2,
  { immediateCallback: true },
)

onBeforeUnmount(() => {
  pasueRequestLoginQrcodeStatus()
  pauseRequestLoginQrcode()
})
</script>

<route lang="yaml">
name: login
meta:
  layout: default
  requireAuth: false
</route>

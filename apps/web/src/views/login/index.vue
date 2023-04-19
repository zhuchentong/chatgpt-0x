<template>
  <page-container
    absolute
    layout="flex-center">
    <div
      v-if="qrcode"
      class="login-container">
      <div class="qrcode-container">
        <img
          class="m-atuo desktop:w-300px mobile:w-200px"
          :src="qrcode" />
        <div>扫码关注公众号登录</div>
      </div>
    </div>
  </page-container>
</template>

<style lang="less" scoped>
.login-container {
  .qrcode-container {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
  }

  img {
    border-radius: 15px;
    border: solid 15px #18181c;
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

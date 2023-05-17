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
        <div class="desktop:block mobile:hidden">扫码关注公众号登录</div>
        <div class="desktop:hidden mobidle:block">
          长按二维码,关注后返回页面即可登录
        </div>
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
import { RequestGenerateType } from '@gopowerteam/request'
import { useStore } from '@/store'

const route = useRoute()

const appService = useRequest((service) => service.AppService)
const wechatService = useRequest((service) => service.WechatService)

const message = useMessage()
const store = useStore()
const router = useRouter()

let qrcode = $ref('')
let code: string
const inviter = route.query.inviter as string
/**
 * 请求登录二维码
 */
const { pause: pauseRequestLoginQrcode, resume: startRequestLoginQrcode } =
  useIntervalFn(
    () => {
      appService.qrcodeLogin().then((data) => {
        qrcode = data.qrcode
        code = data.code
      })
    },
    1000 * 60 * 5,
    { immediate: false, immediateCallback: true },
  )

/**
 * 请求登录二维码状态
 */
const {
  pause: pasueRequestLoginQrcodeStatus,
  resume: startRequestLoginQrcodeStatus,
} = useIntervalFn(
  () => {
    if (!code || !qrcode) {
      return
    }

    appService
      .qrcodeLoginStatus({ code, inviter })
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
  { immediate: false, immediateCallback: true },
)

function requestLoginWechat() {
  const openid = route.query.openid as string
  const inviter =  route.query.inviter as string|| sessionStorage.getItem('inviter') as string

  if(route.query.inviter){
    sessionStorage.setItem('inviter', route.query.inviter as string)
  }

  if (!openid) {
    // redirect
    window.location.href = wechatService.redirectAuthorize([], {
      type: RequestGenerateType.URL,
    })

    return
  }

  // login
  appService
    .wechatLogin({ openid, inviter })
    .then(({ access_token, refresh_token }) => {
      store.user.updateToken({
        accessToken: access_token,
        refreshToken: refresh_token,
      })

      message.success('登录成功')
      router.push('/')
    })
}

onBeforeUnmount(() => {
  pasueRequestLoginQrcodeStatus()
  pauseRequestLoginQrcode()
})

onBeforeMount(() => {
  const isWechat = /MicroMessenger/i.test(window.navigator.userAgent)

  if (store.user.refreshToken) {
    router.replace('/')
    return
  }

  if (isWechat) {
    requestLoginWechat()
  } else {
    startRequestLoginQrcode()
    startRequestLoginQrcodeStatus()
  }
})
</script>

<route lang="yaml">
name: login
meta:
  layout: default
  requireAuth: false
</route>

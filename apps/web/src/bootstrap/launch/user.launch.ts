import type { Router } from 'vue-router'
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import { useStore } from '@/store'
import { HeaderService } from '@/http/extends/header.service'
import { useChat } from '@/composables/use-chat'
import { ChatRole } from '@/config/enum.config'

function sendCareMessage() {
  const store = useStore()

  if (store.app.careMode.dates.includes(dayjs().format('YYYY-MM-DD'))) {
    return
  }

  const { sendChatMessage } = useChat()

  const now = Date.now()
  const records = store.chat.currentChat?.records
    .filter(
      (record) =>
        record.role === ChatRole.User &&
        record.content.length >= 5 &&
        record.datetime &&
        now - record.datetime <= 1000 * 60 * 60 * 24,
    )
    ?.slice(0, 10)

  if (records.length >= 5) {
    const content = records.map((record) => `[${record.content}]`).join(',')
    const message = `您好, 以下"[]"内是我最近几条的提问与消息：${content}，请根据我的提问与消息生成一些问候的话语让我温暖些, 谢谢！`
    store.app.appendCareModeDate(dayjs().format('YYYY-MM-DD'))
    sendChatMessage(message)
  }
}
/**
 * 更新用户数据
 */
function updateCurrentToken() {
  const store = useStore()

  if (store.user.refreshToken) {
    const appService = useRequest((service) => service.AppService)

    return appService
      .token([
        new HeaderService({
          Authorization: `Bearer ${store.user.refreshToken}`,
        }),
      ])
      .then(({ access_token, refresh_token }) => {
        store.user.updateToken({
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      })
      .catch(() => {
        // ResfreshToken验证失败
        store.user.logout()
      })
  }
}

/**
 * 更新用户数据
 */
function updateCurrentUser() {
  const store = useStore()
  const appService = useRequest((service) => service.AppService)

  if (store.user.accessToken) {
    return appService.getCurrentUser().then((data) => {
      store.user.updateUser(data)
    })
  }
}

function getAssistantItems() {
  const store = useStore()
  const assistantService = useRequest((service) => service.AssistantService)

  return assistantService
    .getAssistantByKeys({
      keys: store.chat.assistantKeys.filter((x) => x !== 'default-assistant'),
    })
    .then((data) => {
      store.chat.appendAssistenItems([
        {
          id: 'default-assistant',
          avatar: 'avatar-000',
          name: '智能助手',
          prompt: '',
          enable: true,
          placeholder: '',
          foreword: '',
          createdAt: '',
          updatedAt: '',
          code: 0,
        },
        ...data.map((item) => ({
          ...item,
          avatar: `avatar-${(item.code % 51).toString().padStart(3, '0')}`,
        })),
      ])
    })
}

/**
 * 系统启动列表
 * @returns
 */
export default function userLaunch(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const store = useStore()
    const meta = to.meta
    // 非必要授权页面直接进入
    if (meta?.requireAuth === false) {
      return next()
    }

    // 未登录用户处理
    if (!store.user.current) {
      // 更新用户Token
      await updateCurrentToken()

      // 更新用户信息
      await updateCurrentUser()
    }

    // 未登录用户进行登录
    if (!store.user.current) {
      return next('/login')
    }

    if (store.chat.assistantItems.length === 0) {
      await getAssistantItems()
    }

    if (store.app.careMode.enable) {
      await sendCareMessage()
    }

    next()
  })
}

import type { Router } from 'vue-router'
import { useRequest } from 'virtual:request'
import { useStore } from '@/store'
import { HeaderService } from '@/http/extends/header.service'

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
          ['Authorization']: `Bearer ${store.user.refreshToken}`,
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

  return assistantService.getAllAssistant().then((data) => {
    store.chat.updateAssistenItems([
      {
        id: 'default-assistant',
        avatar: 'avatar-000',
        name: '智能助手',
        prompt: '',
        enable: true,
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

    next()
  })
}

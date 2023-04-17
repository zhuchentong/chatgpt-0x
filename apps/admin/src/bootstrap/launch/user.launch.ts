import type { Router } from 'vue-router'
import { useRequest } from 'virtual:request'
import { useStore } from '@/store'
import { HeaderService } from '@/http/extends/header.service'

/**
 * 更新用户数据
 */
function updateCurrentToken() {
  const store = useStore()

  if (store.user.refreshToken && !store.user.accessToken) {
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
    return appService.getCurrentAdmin().then((data) => {
      store.user.updateUser(data)
    })
  }
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

    next()
  })
}

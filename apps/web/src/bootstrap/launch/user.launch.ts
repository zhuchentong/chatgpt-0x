import type { Router } from 'vue-router'
import { appConfig } from '@/config/app.config'
import menus from '@/config/menu.config'
import type { Menu } from '@/types/workspace'
import { useRequest } from 'virtual:request'
import { useStore } from '@/store'

/**
 * 更新用户数据
 */
function updateCurrentToken() {
  // const store = useStore()
  // const _appService = useRequest((service) => service.AppService)
  // const accessToken = userQuery.safeAccessToken
  // const refreshToken = userQuery.select((state) => state.refreshToken)
  // if (!accessToken && refreshToken) {
  //   return
  // }
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

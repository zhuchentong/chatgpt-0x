import type { Router } from 'vue-router'
import { useRequest } from 'virtual:request'
import { useStore } from '@/store'

// 启动逻辑
async function getAppBase(router: Router) {
  const appService = useRequest((service) => service.AppService)

  appService
    .appBase()
    .then((data) => {
      //
    })
    .catch(() => {
      router.replace('/welcome')
    })
}

/**
 * 系统启动列表
 * @returns
 */
export default async function appLaunch(router: Router) {
  const store = useStore()

  router.beforeEach(async (to, from, next) => {
    if (!store.app.ready) {
      // 系统初始化逻辑
      await getAppBase(router)

      // 设置系统准备状态
      store.app.setReady()
    }

    next()
  })
}

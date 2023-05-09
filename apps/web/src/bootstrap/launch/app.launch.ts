import type { Router } from 'vue-router'
import VConsole from 'vconsole'
import { useStore } from '@/store'
// 启动逻辑
async function runVConsole() {
  const store = useStore()
  const debug = new URL(location.href).searchParams.get('debug')

  if (store.app.isWechat && (import.meta.env.DEV || debug)) {
    return new VConsole({ theme: 'dark' })
  }
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
      await runVConsole()

      // 设置系统准备状态
      store.app.setReady()
    }

    next()
  })
}

import { setupLayouts } from 'virtual:generated-layouts'
import type { RouteRecordRaw } from 'vue-router'
import generatedRoutes from '~pages'

// 自定义路由
const routes: RouteRecordRaw[] = [
  // 根目录跳转
  { path: '/', redirect: '/dashboard' },
]

export default {
  base: import.meta.env.BASE_URL,
  routes: [...routes, ...setupLayouts(generatedRoutes)],
}

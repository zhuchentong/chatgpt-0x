import type { AppConfig } from '~/types/app.config'

export const appConfig: AppConfig = {
  app: 'vue-web-template',
  title: '奥创·20X Robot',
  logo: '/logo.png',
  http: {
    gateway: import.meta.env.VITE_HTTP_GATEWAY,
    timeout: 3000,
  },
}

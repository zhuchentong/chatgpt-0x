import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import svg from 'vite-svg-loader'
import { defineVitePlugins } from './.vite/plugins'
import { defineViteResolve } from './.vite/resolve'
import { defineViteCSS } from './.vite/css'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  ...defineViteResolve(),
  ...defineViteCSS(),
  ...defineVitePlugins([
    vue({
      include: [/\.vue$/],
      reactivityTransform: true,
    }),
    jsx(),
    svg(),
  ]),
})

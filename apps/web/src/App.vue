<script setup lang="ts">
import { appConfig } from './config/app.config'
import { ModalProvider } from '@gopowerteam/vue-modal'
import { useStore } from '@/store'
import { darkTheme, lightTheme } from 'naive-ui'
import { useColorMode, type BasicColorSchema } from '@vueuse/core'

const colorMode = useColorMode()

const store = useStore()
const title = computed(() => {
  if (store.app.title) {
    return `${appConfig.title}-${store.app.title}`
  } else {
    return appConfig.title
  }
})

useHead({
  title: title,
  meta: [
    {
      name: 'description',
      content: 'chatGPT',
    },
  ],
})

const themes = {
  ['light' as BasicColorSchema]: {
    theme: lightTheme,
    overrides: {
      common: {
        bodyColor: '#f3f3f3',
      },
    },
  },
  ['dark' as BasicColorSchema]: {
    theme: darkTheme,
    overrides: {
      common: {
        bodyColor: '#101010',
      },
    },
  },
}
</script>

<template>
  <modal-provider>
    <n-config-provider
      :theme="themes[colorMode].theme"
      :theme-overrides="themes[colorMode].overrides">
      <n-dialog-provider>
        <n-message-provider>
          <RouterView />
        </n-message-provider>
      </n-dialog-provider>
      <n-global-style />
    </n-config-provider>
  </modal-provider>
</template>

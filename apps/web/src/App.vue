<script setup lang="ts">
import { appConfig } from './config/app.config'
import { ModalProvider } from '@gopowerteam/vue-modal'
import { useStore } from '@/store'
import { darkTheme, lightTheme } from 'naive-ui'

const store = useStore()
const isDarkTheme = useDark()
// const toggleDark = useToggle(isDark)
const preferredDark = usePreferredDark()

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

const lightThemeOverrides = {
  common: {
    bodyColor: '#f3f3f3',
  },
  // ...
}

const darkThemeOverrides = {
  common: {
    bodyColor: '#101010',
  },
  // ...
}

document.documentElement.classList.add('dark')
</script>

<template>
  <modal-provider>
    <n-config-provider
      :theme="isDarkTheme ? darkTheme : lightTheme"
      :theme-overrides="isDarkTheme ? darkThemeOverrides : lightThemeOverrides">
      <n-dialog-provider>
        <n-message-provider>
          <RouterView />
        </n-message-provider>
      </n-dialog-provider>
      <n-global-style />
    </n-config-provider>
  </modal-provider>
</template>

import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface State {
  // 系统准备状态
  ready: boolean
  // 页面标题
  title: string
  desktop: Ref<boolean>
  mobile: Ref<boolean>
}

const initialState: State = {
  ready: false,
  title: '',
  desktop: useMediaQuery('(min-width: 768px)'),
  mobile: useMediaQuery('(max-width: 768px)'),
}

export const useAppStore = defineStore('app', {
  state: () => initialState,

  actions: {
    /**
     * 更新系统状态
     */
    setReady() {
      this.ready = true
    },
    /**
     * 页面标题
     */
    updateTitle(title: string) {
      this.title = title
    },
  },
})

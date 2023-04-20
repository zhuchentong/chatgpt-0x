import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface State {
  // 系统准备状态
  ready: boolean
  // 页面标题
  title: string
  desktop: Ref<boolean>
  mobile: Ref<boolean>
  careMode: {
    enable: boolean
    dates: string[]
  }
}

const initialState: State = {
  ready: false,
  title: '',
  desktop: useMediaQuery('(min-width: 768px)'),
  mobile: useMediaQuery('(max-width: 768px)'),
  careMode: {
    enable: true,
    dates: [],
  },
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
    /**
     * 切换关怀模式
     */
    toggleCareMode() {
      this.careMode.enable = !this.careMode.enable
    },
    /**
     * 添加关怀模式日期
     * @param date 日期
     */
    appendCareModeDate(date: string) {
      this.careMode.dates.push(date)
    },
  },
  persist: {
    paths: ['careMode'],
  },
})

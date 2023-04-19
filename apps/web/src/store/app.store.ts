import { defineStore } from 'pinia'

interface State {
  // 系统准备状态
  ready: boolean
  // 页面标题
  title: string
}

const initialState: State = {
  ready: false,
  title: '',
}

export const useAppStore = defineStore('app', {
  state: () => initialState,
  getters: {
    desktop: () => useMediaQuery('(min-width: 768px)').value,
    mobile: () => useMediaQuery('(max-width: 768px)').value,
  },
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

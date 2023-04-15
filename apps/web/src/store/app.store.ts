import { defineStore } from 'pinia'

type State = {
  // 系统准备状态
  ready: boolean
  // 页面标题
  title: string
  // 助手设置
  assistantSettingShow: boolean
  // 系统设置
  systemSettingShow: boolean
}

const initialState: State = {
  ready: false,
  title: '',
  assistantSettingShow: false,
  systemSettingShow: false,
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
    toggleAssistantSettingShow() {
      this.assistantSettingShow = !this.assistantSettingShow
    },
    toggleSystemSettingShow() {
      this.systemSettingShow = !this.systemSettingShow
    },
  },
})

import { defineStore } from 'pinia'
import type { Administrator } from '@/http/models/Administrator'

interface State {
  accessToken: string
  refreshToken: string
  current?: Administrator
}

const initialState: State = {
  accessToken: '',
  refreshToken: '',
}

export const useUserStore = defineStore('user', {
  state: () => initialState,
  getters: {
    isLogin: (state) => !!state.accessToken && state.current,
  },
  actions: {
    updateUser(user: Administrator) {
      this.current = user
    },
    /**
     * 更新用户
     * @param user
     */
    updateToken(token: { accessToken: string; refreshToken: string }) {
      this.accessToken = token.accessToken
      this.refreshToken = token.refreshToken
    },
    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      this.current = undefined
    },
  },
  persist: {
    paths: ['refreshToken'],
  },
})

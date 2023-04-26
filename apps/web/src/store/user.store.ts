import { defineStore } from 'pinia'
import type { User } from '@/http/models/User'

interface State {
  accessToken: string
  refreshToken: string
  current?: User
}

const initialState: State = {
  accessToken: '',
  refreshToken: '',
}

export const useUserStore = defineStore('user', {
  state: () => initialState,
  getters: {
    isLogin: (state) => !!state.current?.id,
  },
  actions: {
    updateUser(user: User) {
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

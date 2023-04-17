import { useStore } from '@/store'
import type { RequestPlugin, RequestSendOptions } from '@gopowerteam/request'

export class HeaderService implements RequestPlugin {
  private headers: Record<string, string>

  constructor(headers: Record<string, string>) {
    this.headers = headers
  }

  public before(options: RequestSendOptions) {
    const store = useStore()

    if (store.user.accessToken) {
      options.headers = {
        ...options.headers,
        ...this.headers,
      }
    }
  }
}

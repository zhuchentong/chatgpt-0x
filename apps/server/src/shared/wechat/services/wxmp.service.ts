import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { lastValueFrom, switchMap } from 'rxjs'
import { Logger } from 'src/core/logger/services/logger.service'
import { AccessTokenApi } from 'tnwx'

@Injectable()
export class WXMPService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async getQRCode({
    action = 'QR_STR_SCENE',
    scene,
  }: {
    action?:
      | 'QR_SCENE'
      | 'QR_STR_SCENE'
      | 'QR_LIMIT_SCENE'
      | 'QR_LIMIT_STR_SCENE'
    scene: string | number | undefined
  }) {
    const accessToken = await AccessTokenApi.getAccessToken()

    try {
      const { data } = await lastValueFrom(
        this.httpService.request<{ ticket: string }>({
          url: 'https://api.weixin.qq.com/cgi-bin/qrcode/create',
          method: 'POST',
          params: { access_token: accessToken.getAccessToken },
          data: {
            expire_seconds: 60 * 5,
            action_name: action,
            action_info: {
              scene: ['QR_STR_SCENE', 'QR_LIMIT_STR_SCENE'].includes(action)
                ? { scene_str: scene }
                : { scene_id: scene },
            },
          },
        }),
      )

      this.logger.info(JSON.stringify(data))

      return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(
        data.ticket,
      )}`
    } catch (ex) {
      this.logger.error(ex)
    }
  }
}

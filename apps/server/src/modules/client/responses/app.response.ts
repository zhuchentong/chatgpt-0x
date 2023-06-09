import { AppOrigin } from 'src/config/enum.config'
import { ApiProperty } from '@nestjs/swagger'

export class TokenResponse {
  @ApiProperty({ description: '授权Token' })
  access_token: string

  @ApiProperty({ description: '刷新Token', required: false })
  refresh_token?: string

  @ApiProperty({ description: '授权Token过期时间' })
  expires_in: number

  @ApiProperty({ description: 'Token来源' })
  token_origin: AppOrigin
}

class QiniuConfig {
  @ApiProperty({ description: '域名' })
  domain: string
}

export class AppBaseResponse {
  @ApiProperty({ description: '授权Token' })
  base_time: number

  @ApiProperty({
    description: '七牛配置',
  })
  qiniu: QiniuConfig
}

export class QrcodeLoginResponse {
  @ApiProperty({ description: '登录二维码' })
  qrcode: string

  @ApiProperty({ description: '登录码' })
  code: string
}

export class QrcodeLoginStatusResponse extends TokenResponse {
  @ApiProperty({ description: '登录状态' })
  status: boolean
}

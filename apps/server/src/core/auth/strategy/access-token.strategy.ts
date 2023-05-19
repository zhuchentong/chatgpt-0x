import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { AppOrigin } from 'src/config/enum.config'
import { AuthService } from '../services/auth.service'
import { JwtConfig } from 'src/config/configurations'

type JwtPayload = {
  id: string
  username?: string
  openid?: string
  origin: AppOrigin
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    private readonly authService: AuthService,
    @Inject(JwtConfig.KEY)
    public readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.accessTokenSecret,
    })
  }

  /**
   * 验证用户
   * @param payload
   * @returns
   */
  async validate(payload: JwtPayload) {
    const getTargetUser = () => {
      switch (payload.origin) {
        case AppOrigin.Admin:
          return this.authService.getAdminUser(payload.id, payload.username)
        default:
          return this.authService.getClientUser(payload.id)
      }
    }

    // 获取登录用户
    const user = await getTargetUser()

    if (user) {
      return user
    }
  }
}

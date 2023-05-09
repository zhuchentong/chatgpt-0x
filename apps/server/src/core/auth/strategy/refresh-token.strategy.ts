import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppOrigin } from 'src/config/enum.config'
import { AuthService } from '../services/auth.service'
import type { Cache } from 'cache-manager'
import { Administrator } from 'src/entities/administrator.entity'
import { User } from 'src/entities/user.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CACHE_ADMIN, CACHE_USER } from 'src/config/constants'

type JwtPayload = {
  id: string
  username?: string
  openid?: string
  origin: AppOrigin
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get('jwt.refreshTokenSecret'),
    })
  }

  async validate(req, payload: JwtPayload) {
    const getTargetUser = (): Promise<User | Administrator | undefined> => {
      switch (payload.origin) {
        case AppOrigin.Admin:
          return this.authService.getAdminUser(payload.id, payload.username)
        default:
          return this.authService.getClientUser(payload.id)
      }
    }

    // 获取登录用户
    const user = await getTargetUser()

    const authorization = req.headers?.authorization || ''
    const [token] = authorization.match(/(?<=\Bearer\s)(.*)/)

    const cacheHeader =
      payload.origin === AppOrigin.Admin ? CACHE_ADMIN : CACHE_USER

    if ((await this.cacheManager.get(`${cacheHeader}:${user.id}`)) !== token) {
      // TODO: 查看过期原因
      Logger.error('登录过期:', payload, user.id)
      throw new UnauthorizedException('不存在的RefreshToken')
    }

    if (user) {
      return user
    }
  }
}

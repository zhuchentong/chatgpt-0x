import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Administrator } from 'src/entities/administrator.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { ConfigType } from '@nestjs/config'
import { AppOrigin } from 'src/config/enum.config'
import { Cache } from 'cache-manager'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { nanoid } from 'nanoid/non-secure'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CACHE_ADMIN, CACHE_USER } from 'src/config/constants'
import { TokenResponse } from 'src/modules/client/responses/app.response'
import { AppConfig, JwtConfig, WeappConfig } from 'src/config/configurations'

const WEAPP_API = {
  token: 'https://api.weixin.qq.com/cgi-bin/token',
  code2session: 'https://api.weixin.qq.com/sns/jscode2session',
  getuserphonenumber:
    'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    @Inject(AppConfig.KEY)
    private readonly appConfig: ConfigType<typeof AppConfig>,
    @Inject(WeappConfig.KEY)
    private readonly weappConfig: ConfigType<typeof WeappConfig>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * 获取密码HASH
   * @param password
   * @returns
   */
  public async hashPassword(password: string) {
    const saltRounds = this.appConfig.saltRounds
    const hash = await bcrypt.hash(password, parseInt(saltRounds))

    return hash
  }

  /**
   * 比较密码
   * @param password
   * @param value
   */
  public comparePassword(password1, password2) {
    return bcrypt.compareSync(password1, password2)
  }

  /**
   * 管理员登录
   * @param username
   * @param password
   */
  async adminLogin(username: string, password: string) {
    const admin = await this.administratorRepository.findOne({
      where: {
        username,
      },
    })

    if (!admin) {
      throw new UnauthorizedException('用户不存在')
    }

    if (!this.comparePassword(password, admin.password)) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    return admin
  }

  async userLogin(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    if (!this.comparePassword(password, user.password)) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    return user
  }

  /**
   * 小程序登录
   * @param username
   * @param password
   */
  async weappLogin(code: string) {
    // 获取openid

    const {
      data: { errcode, errmsg, openid },
    } = await lastValueFrom(
      this.httpService.get(WEAPP_API.code2session, {
        params: {
          js_code: code,
          grant_type: 'authorization_code',
          appid: this.weappConfig.appid,
          secret: this.weappConfig.secret,
        },
      }),
    )

    if (errcode) {
      throw new Error(errmsg)
    }

    const user = await this.userRepository.findOneBy({
      openid,
    })

    if (user) {
      return user
    }

    // 创建用户
    return this.userRepository.save(
      {
        openid,
        nickname: `用户${nanoid(8)}`,
      },
      { reload: true },
    )
  }

  /**
   * 管理端用户登录
   * @param admin
   * @returns
   */
  async getAdminUser(id: string, username: string) {
    return await this.administratorRepository.findOne({
      where: {
        id,
        username,
      },
    })
  }

  /**
   * 管理员签名
   * @param admin
   * @returns
   */
  async adminSign(administrator: Administrator) {
    const jwtOrigin = AppOrigin.Admin

    const payload = {
      username: administrator.username,
      id: administrator.id,
      origin: jwtOrigin,
    }

    // 获取AccessToken
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.accessTokenSecret,
      expiresIn: this.jwtConfig.accessTokenExpiresIn,
    })

    // 获取AccessToken
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.refreshTokenSecret,
      expiresIn: this.jwtConfig.refreshTokenExpiresIn,
    })

    // 缓存AccessToken
    await this.cacheManager.set(
      `${CACHE_ADMIN}:${refreshToken}`,
      administrator.id,
      { ttl: this.jwtConfig.refreshTokenExpiresIn },
    )

    // 返回认证信息
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.jwtConfig.refreshTokenExpiresIn,
      token_origin: jwtOrigin,
    }
  }
  /**
   * 小程序用户登录
   * @param user
   * @returns
   */
  async weappValidate(user: any) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  /**
   * 管理员签名
   * @param admin
   * @returns
   */
  async userSign(
    user: User,
    origin: AppOrigin,
    {
      refreshTokenSign = true,
      reAccessTokenExpiresIn,
      reRefreshTokenExpiresIn,
    }: {
      refreshTokenSign?: boolean
      reAccessTokenExpiresIn?: number
      reRefreshTokenExpiresIn?: number
    } = {},
  ) {
    const jwtOrigin = origin
    const tokenExpiresIn = {
      accessTokenExpiresIn:
        reAccessTokenExpiresIn || this.jwtConfig.accessTokenExpiresIn,
      refreshTokenExpiresIn:
        reRefreshTokenExpiresIn || this.jwtConfig.refreshTokenExpiresIn,
    }

    const payload = {
      id: user.id,
      origin: jwtOrigin,
    }

    // 获取AccessToken
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.accessTokenSecret,
      expiresIn: tokenExpiresIn.accessTokenExpiresIn,
    })

    // 返回认证信息
    const token: TokenResponse = {
      access_token: accessToken,
      expires_in: tokenExpiresIn.accessTokenExpiresIn,
      token_origin: jwtOrigin,
    }

    if (refreshTokenSign) {
      // 获取AccessToken
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.jwtConfig.refreshTokenSecret,
        expiresIn: tokenExpiresIn.refreshTokenExpiresIn,
      })

      // 缓存AccessToken
      await this.cacheManager.set(`${CACHE_USER}:${refreshToken}`, user.id, {
        ttl: this.jwtConfig.refreshTokenExpiresIn,
      })

      token.refresh_token = refreshToken
    }

    return token
  }

  public async getClientUser(id: string) {
    return await this.userRepository.findOneBy({
      id,
    })
  }
}

import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { RefreshTokenGuard } from 'src/core/auth/guards/refresh-token.guard'
import { AuthService } from 'src/core/auth/services/auth.service'
import { Public } from 'src/decorators/public.decorator'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { ConfigService } from '@nestjs/config'
import {
  AppBaseResponse,
  QrcodeLoginResponse,
  QrcodeLoginStatusResponse,
  TokenResponse,
} from '../responses/app.response'
import { User } from 'src/entities/user.entity'
import { WeappCodeGuard } from 'src/core/auth/guards/weapp-code.guard'
import {
  EmailLoginInput,
  EmailRegisterInput,
  QrcodeLoginStatusInput,
  SendRegisterCodeInput,
  WeappLoginInput,
  WechatLoginInput,
} from '../dtos/app.dto'
import { UserPasswordAuthGuard } from 'src/core/auth/guards/user-password.guard'
import { nanoid } from 'nanoid'
import { EmailService } from '../services/email.service'
import { Cache } from 'cache-manager'
import { UserService } from '../services/user.service'
import { AppOrigin } from 'src/config/enum.config'
import { WXMPService } from 'src/shared/wechat/services/wxmp.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CACHE_MAIL_CODE, CACHE_QRCODE_LOGIN } from 'src/config/constants'
@Controller('app')
@ApiTags('app')
@ApiSecurity('access-token')
export class AppController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly wxmpService: WXMPService,
  ) {}

  @Public()
  @Get('app-base')
  @ApiOperation({ operationId: 'appBase', summary: '获取系统基本信息' })
  @ApiOkResponse({ type: AppBaseResponse })
  async appBase() {
    const basetime = Date.now()
    return {
      base_time: basetime,
      qiniu: {
        domain: this.config.get('qiniu.storage.main.domain'),
      },
    }
  }

  @Public()
  @Post('weapp-login')
  @ApiOperation({ operationId: 'weappLogin', summary: '用户登录' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(WeappCodeGuard)
  weappLogin(
    @RequestUser() user: User,
    // eslint-disable-next-line
    @Body() input: WeappLoginInput,
  ) {
    if (user) {
      return this.authService.userSign(user, AppOrigin.Weapp)
    }
  }

  @Public()
  @Post('email-login')
  @ApiOperation({ operationId: 'emailLogin', summary: '用户登录' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(UserPasswordAuthGuard)
  emailLogin(
    @RequestUser() user: User,
    // eslint-disable-next-line
    @Body() _: EmailLoginInput,
  ) {
    if (user) {
      return this.authService.userSign(user, AppOrigin.Web)
    }
  }

  @Public()
  @Get('qrcode-login')
  @ApiOperation({ operationId: 'qrcodeLogin', summary: '二维码登录' })
  @ApiOkResponse({ type: QrcodeLoginResponse })
  async qrcodeLogin() {
    const code = nanoid(10)
    const qrcode = await this.wxmpService.getQRCode({
      scene: `${CACHE_QRCODE_LOGIN}:${code}`,
    })

    return {
      qrcode,
      code,
    }
  }

  @Public()
  @Post('wechat-login')
  @ApiOkResponse({ type: TokenResponse })
  @ApiOperation({
    operationId: 'wechatLogin',
    summary: '微信登录',
  })
  async wechatLogin(@Query() { openid, inviter }: WechatLoginInput) {
    // 用户登录
    const { user, isNewRegister } = await this.userService.login({ openid })

    // 发放用户奖励
    await this.userService.sendUserReward(user, { inviter, isNewRegister })

    // 生成Token
    const token = await this.authService.userSign(user, AppOrigin.Web)

    return token
  }

  @Public()
  @Get('qrcode-login-status')
  @ApiOkResponse({ type: QrcodeLoginStatusResponse })
  @ApiOperation({
    operationId: 'qrcodeLoginStatus',
    summary: '二维码登录状态查询',
  })
  async qrcodeLoginStatus(@Query() { code, inviter }: QrcodeLoginStatusInput) {
    const openid = await this.cacheManager.get<string>(
      `${CACHE_QRCODE_LOGIN}:${code}`,
    )

    // 登录成功进行注册
    if (!openid) {
      return {
        status: false,
      }
    }

    //  清除缓存
    await this.cacheManager.del(`${CACHE_QRCODE_LOGIN}:${code}`)

    // 用户登录
    const { user, isNewRegister } = await this.userService.login({ openid })

    // 发放用户奖励
    await this.userService.sendUserReward(user, { inviter, isNewRegister })

    // 生成Token
    const token = await this.authService.userSign(user, AppOrigin.Web)

    return {
      status: true,
      ...token,
    }
  }

  @Public()
  @Post('register')
  @ApiOperation({ operationId: 'register', summary: '用户注册' })
  @ApiOkResponse({ type: TokenResponse })
  async emailRegister(@Body() input: EmailRegisterInput) {
    // 缓存Code
    const email = await this.cacheManager.get(
      `${CACHE_MAIL_CODE}:${input.code}`,
    )

    if (!email || email !== input.email) {
      throw Error('验证码错误')
    }

    const user = await this.userService.createByEmailPassword(
      input.email,
      input.password,
    )

    return this.authService.userSign(user, AppOrigin.Web)
  }

  @Public()
  @Post('send-register-code')
  @ApiOperation({ operationId: 'sendRegisterCode', summary: '发送注册验证码' })
  async sendRegisterCode(@Body() registerInput: SendRegisterCodeInput) {
    const isExistUser = await this.userService.findOneBy({
      email: registerInput.email,
    })

    if (isExistUser) {
      throw new Error('该邮箱已经被使用')
    }

    const code = nanoid(6).toUpperCase()

    // 缓存Code
    await this.cacheManager.set(
      `${CACHE_MAIL_CODE}:${code}`,
      registerInput.email,
      60 * 10,
    )

    await this.emailService.sendEmail(
      registerInput.email,
      '注册验证码',
      `您正在申请注册,注册验证码是: ${code}`,
    )
  }

  @Get('current')
  @ApiOperation({ operationId: 'getCurrentUser', summary: '获取当前用户信息' })
  @ApiOkResponse({ type: User })
  getCurrentUser(@RequestUser() user: User) {
    return user
  }

  @Public()
  @Get('refresh-token')
  @ApiOperation({ operationId: 'token', summary: '刷新Token' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(RefreshTokenGuard)
  token(@RequestUser() user: User) {
    if (user) {
      return this.authService.userSign(user, AppOrigin.Web)
    }
  }

  @Public()
  @Get('api-refresh-token')
  @ApiOperation({ operationId: 'apiToken', summary: 'API刷新Token' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(RefreshTokenGuard)
  apiToken(@RequestUser() user: User) {
    if (user) {
      return this.authService.userSign(
        user,
        AppOrigin.Web,
        60 * 60 * 24 * 30 * 12,
        60 * 60 * 24 * 30 * 12,
      )
    }
  }
}

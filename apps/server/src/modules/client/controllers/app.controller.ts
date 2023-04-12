import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { RefreshTokenGuard } from 'src/auth/guards/refresh-token.guard'
import { AuthService } from 'src/auth/services/auth.service'
import { Public } from 'src/decorators/public.decorator'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { ConfigService } from '@nestjs/config'
import { AppBaseResponse, TokenResponse } from '../responses/app.response'
import { User } from 'src/entities/user.entity'
import { WeappCodeGuard } from 'src/auth/guards/weapp-code.guard'
import {
  EmailLoginInput,
  EmailRegisterInput,
  SendRegisterCodeInput,
  WeappLoginInput,
} from '../dtos/app.dto'
import { UserPasswordAuthGuard } from 'src/auth/guards/user-password.guard'
import { nanoid } from 'nanoid'
import { EmailService } from '../services/email.service'
import { Cache } from 'cache-manager'
import { UserService } from '../services/user.service'
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
  @Get('weapp-login')
  @ApiOperation({ operationId: 'weappLogin', summary: '用户登录' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(WeappCodeGuard)
  weappLogin(
    @RequestUser() user: User,
    // eslint-disable-next-line
    @Query() input: WeappLoginInput,
  ) {
    if (user) {
      return this.authService.userSign(user)
    }
  }

  @Public()
  @Get('login')
  @ApiOperation({ operationId: 'login', summary: '用户登录' })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(UserPasswordAuthGuard)
  login(
    @RequestUser() user: User,
    // eslint-disable-next-line
    @Body() loginInput: EmailLoginInput,
  ) {
    if (user) {
      return this.authService.userSign(user)
    }
  }

  @Public()
  @Get('register')
  @ApiOperation({ operationId: 'register', summary: '用户注册' })
  @ApiOkResponse({ type: TokenResponse })
  async register(@Body() registerInput: EmailRegisterInput) {
    // 缓存Code
    const email = await this.cacheManager.get(registerInput.code)

    if (!email || email !== registerInput.email) {
      throw Error('验证码错误')
    }

    const user = await this.userService.create(
      registerInput.email,
      registerInput.password,
    )

    return this.authService.userSign(user)
  }

  @Public()
  @Get('send-register-code')
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
    await this.cacheManager.set(code, registerInput.email, {
      ttl: 60 * 10,
    })

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
      return this.authService.userSign(user)
    }
  }
}

import {
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Post,
  Query,
  RawBodyRequest,
  Redirect,
  Req,
} from '@nestjs/common'
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Public } from 'src/decorators/public.decorator'
import { SnsAccessTokenApi, WeChat } from '@tnwx/wxmp'
import { ApiConfigKit, ScopeEnum } from 'tnwx'
import { FastifyRequest } from 'fastify'
import { WXMPMessageService } from '../services/wxmp-message.service'
import { Logger } from 'src/core/logger/services/logger.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@ApiTags('wechat')
@Controller()
@ApiSecurity('access-token')
export class WXMPController {
  constructor(
    private readonly wxmpMessageService: WXMPMessageService,
    private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Public()
  @ApiOperation({ operationId: 'checkSignature', description: '开发者验证' })
  @Get('message')
  checkSignature(
    @Query('signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Query('echostr') echostr: string,
  ) {
    return WeChat.checkSignature(signature, timestamp, nonce, echostr)
  }

  @Public()
  @Header('Content-Type', 'text/xml')
  @Post('message')
  @HttpCode(200)
  async message(
    @Query('msg_signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Query('openid') openid: string,
    @Query('appId') appid: string,
    @Req() req: RawBodyRequest<FastifyRequest>,
  ) {
    if (appid) {
      ApiConfigKit.setCurrentAppId(appid)
    }
    const xml = req.rawBody.toString('utf-8')

    try {
      return await WeChat.handleMsg(
        this.wxmpMessageService,
        xml,
        signature,
        timestamp,
        nonce,
      )
    } catch (ex) {
      this.logger.error(ex)
      return 'success'
    }
  }

  @Public()
  @Get('redirect-authorize')
  @ApiOperation({
    operationId: 'redirectAuthorize',
    description: '重定向授权',
  })
  @Redirect()
  async authorize(@Req() req: FastifyRequest) {
    const host = req.headers.host
    const referer = req.headers.referer
    console.log(`https://${host}/wechat/authorize`)
    const url = SnsAccessTokenApi.getAuthorizeUrl(
      `https://${host}/api/wechat/authorize`,
      ScopeEnum.SNSAPI_BASE,
      encodeURIComponent(
        JSON.stringify({
          referer,
        }),
      ),
    )
    return { url }
  }

  @Public()
  @Get('authorize')
  @Redirect()
  @ApiExcludeEndpoint()
  async authorization(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const { referer } = JSON.parse(decodeURIComponent(state))

    const openid = await SnsAccessTokenApi.getSnsAccessToken(code).then(
      async (data) => {
        const { openid, errcode } = data
        // 判断 access_token 是否获取成功
        if (errcode) {
          // access_token 获取失败
          throw new Error(`access_token 获取失败:${errcode}`)
        }

        return openid
      },
    )

    return { url: `${referer.replace(/\/$/, '')}/login?openid=${openid}` }
  }
}

import {
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Query,
  RawBodyRequest,
  Req,
} from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/decorators/public.decorator'
import { WeChat } from '@tnwx/wxmp'
import { ApiConfigKit } from 'tnwx'
import { FastifyRequest } from 'fastify'
import { WXMPMessageService } from '../services/wxmp-message.service'
import { WXMPService } from '../services/wxmp.service'

@ApiTags('wechat')
@Controller()
@ApiSecurity('access-token')
export class WXMPController {
  constructor(
    private readonly wxmpMessageService: WXMPMessageService,
    private readonly aa: WXMPService,
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

    return await WeChat.handleMsg(
      this.wxmpMessageService,
      xml,
      signature,
      timestamp,
      nonce,
    )
  }
}

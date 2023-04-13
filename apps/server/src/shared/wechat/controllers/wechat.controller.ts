import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/decorators/public.decorator'
import { WeChat } from '@tnwx/wxmp'
import { ApiConfigKit } from 'tnwx'
import { Request } from 'express'

@ApiTags('wechat')
@Controller()
@ApiSecurity('access-token')
export class WechatController {
  @Public()
  @ApiOperation({ operationId: 'checkSignature', description: '开发者验证' })
  @Get('checkSignature')
  checkSignature(
    @Query('signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Query('echostr') echostr: string,
  ) {
    return WeChat.checkSignature(signature, timestamp, nonce, echostr)
  }

  @Public()
  @ApiOperation({ operationId: 'message', description: '微信消息处理' })
  @Post('message')
  message(
    @Query('appId') appId: string,
    @Query('msg_signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Body() body: string,
  ) {
    console.log(body)
    if (appId) {
      ApiConfigKit.setCurrentAppId(appId)
    }

    //监听 data 事件 用于接收数据
    const buffer: Uint8Array[] = []

    // req.on('data', function (data: any) {
    //   buffer.push(data)
    // })

    // req.on('end', function () {
    //   const msgXml = Buffer.concat(buffer).toString('utf-8')
    //   // 处理消息并响应对应的回复
    //   // ...
    // })
  }
}

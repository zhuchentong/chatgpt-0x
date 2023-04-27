import { Module, OnModuleInit, forwardRef } from '@nestjs/common'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiConfig, ApiConfigKit } from 'tnwx'
import { ConfigService } from '@nestjs/config'
import { WXMPController } from './controllers/wxmp.controller'
import { WXMPService } from './services/wxmp.service'
import { WXMPMessageService } from './services/wxmp-message.service'
import { HttpModule } from '@nestjs/axios'
import { ClientModule } from 'src/modules/client/client.module'
import { WXPayService } from './services/wxpay.service'
import { WeChatPayModule } from 'nest-wechatpay-node-v3'
import fs from 'node:fs'

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    HttpModule,
    forwardRef(() => ClientModule),
    WeChatPayModule.registerAsync({
      useFactory: async (config: ConfigService) => {
        const { privateKey, appId, mchId, keyPath, certPath, serialNo } =
          config.get('wxpay')

        return {
          appid: appId,
          mchid: mchId,
          serial_no: serialNo,
          key: privateKey,
          publicKey: fs.readFileSync(certPath), // 公钥
          privateKey: fs.readFileSync(keyPath), // 秘钥
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [WXMPController],
  providers: [RequestContext, WXMPService, WXMPMessageService, WXPayService],
  exports: [WXMPService, WXPayService],
})
export class WechatModule implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}
  onModuleInit() {
    const { appid, secret, token, aeskey } = this.config.get('wxmp')
    const wechatAPIConfig = new ApiConfig(
      appid,
      secret,
      token,
      !!aeskey,
      aeskey,
    )
    // 微信公众号、微信小程序、微信小游戏 支持多应用
    ApiConfigKit.putApiConfig(wechatAPIConfig)
    // 开启开发模式,方便调试
    ApiConfigKit.devMode = true
    // 设置当前应用
    ApiConfigKit.setCurrentAppId(wechatAPIConfig.getAppId)
  }
}

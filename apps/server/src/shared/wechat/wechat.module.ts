import { Module, OnModuleInit } from '@nestjs/common'
import { WechatController } from './controllers/wechat.controller'
import { RequestContext } from 'src/middlewaves/request-context.middlewave'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiConfig, ApiConfigKit } from 'tnwx'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [WechatController],
  providers: [RequestContext],
  exports: [],
})
export class WechatModule implements OnModuleInit {
  onModuleInit() {
    const wechatAPIConfig = new ApiConfig(
      'wx4579a458bdaa0d94',
      'fc834bfddbf849125206a20a1b933880',
      'chatgpt',
      true,
      'n2Iv5DXzPGrl9WMaAPBAceUsHhp7AaGOYi7LxCoueKJ',
    )
    // 微信公众号、微信小程序、微信小游戏 支持多应用
    ApiConfigKit.putApiConfig(wechatAPIConfig)
    // 开启开发模式,方便调试
    ApiConfigKit.devMode = true
    // 设置当前应用
    ApiConfigKit.setCurrentAppId(wechatAPIConfig.getAppId)
  }
}

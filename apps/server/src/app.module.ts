import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { DatabaseModule } from './core/database/database.module'
import { RedisModule } from './core/redis/redis.module'
import { AuthModule } from './core/auth/auth.module'
import { LoggerModule } from './core/logger/logger.module'
import { ClientModule } from './modules/client/client.module'
import { AdminModule } from './modules/admin/admin.module'
import configurations from './config/configurations'
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core'
import { QiniuModule } from './shared/qiniu/qiniu.module'
import { WechatModule } from './shared/wechat/wechat.module'
import { ErrorInterceptor } from './interceptors/error.interceptor'
import { join } from 'node:path'
import { OpenAIModule } from './shared/openai/openai.module'
import { ScheduleModule } from '@nestjs/schedule'

const environment = process.env.NODE_ENV || 'development'
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${environment}.local`],
      load: configurations,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RedisModule,
    AuthModule,
    LoggerModule,
    ClientModule,
    AdminModule,
    QiniuModule,
    WechatModule,
    OpenAIModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'client',
        module: ClientModule,
      },
      {
        path: 'qiniu',
        module: QiniuModule,
      },
      {
        path: 'wechat',
        module: WechatModule,
      },
      {
        path: 'openai',
        module: OpenAIModule,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}

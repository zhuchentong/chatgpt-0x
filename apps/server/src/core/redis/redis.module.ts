import { Module } from '@nestjs/common'
import { RedisService } from './services/redis.service'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: RedisService,
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}

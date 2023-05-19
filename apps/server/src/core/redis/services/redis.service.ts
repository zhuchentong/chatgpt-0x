import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { RedisConfig } from 'src/config/configurations'

@Injectable()
export class RedisService implements CacheOptionsFactory {
  constructor(
    @Inject(RedisConfig.KEY)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
  ) {}

  createCacheOptions(): CacheModuleOptions {
    const config = this.redisConfig

    return {
      store: redisStore,
      ...config,
    }
  }
}

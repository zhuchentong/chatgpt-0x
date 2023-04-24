import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { lastValueFrom, zip } from 'rxjs'
import { OpenAIKey } from 'src/entities/openai-key.entity'
import { Repository } from 'typeorm'
import * as dayjs from 'dayjs'
import { ToastException } from 'src/exceptions/toast.exception'
import { OpenAIKeyState } from 'src/config/enum.config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { CACHE_OPENAI_KEYS } from 'src/config/constants'

@Injectable()
export class KeyService {
  constructor(
    private readonly config: ConfigService,
    private httpService: HttpService,
    @InjectRepository(OpenAIKey)
    private openAIKeyRepository: Repository<OpenAIKey>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(key: string) {
    try {
      const { expireAt, usage, limitUsd } = await this.getKeyBalance(key)

      // 清除缓存
      await this.cacheManager.del(CACHE_OPENAI_KEYS)

      return this.openAIKeyRepository.save({
        key,
        expireAt,
        usage,
        limit: limitUsd,
      })
    } catch (ex) {
      throw new ToastException('当前OpenAIKey无效')
    }
  }

  findAll(where = {}) {
    return this.openAIKeyRepository.find({
      where: { enable: true, ...where },
    })
  }

  remove(key: string) {
    return this.openAIKeyRepository.delete(key)
  }

  async update(key: string, openAIKey: Partial<OpenAIKey>) {
    //TODO: 更新Key状态
    await this.cacheManager.del(CACHE_OPENAI_KEYS)

    return this.openAIKeyRepository.update(key, openAIKey)
  }

  /**
   * 获取OpenAIKey余额信息
   * @param key
   * @returns
   */
  async getKeyBalance(key: string) {
    // 查使用量
    const { apiurl } = this.config.get('openai')
    // 认证信息
    const headers = {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    }
    // 请求额度信息
    const requestLimit = this.httpService.get(
      `${apiurl}/dashboard/billing/subscription`,
      { headers },
    )
    // 请求使用量信息
    const requestUsage = this.httpService.get<any>(
      `${apiurl}/dashboard/billing/usage`,
      {
        params: {
          start_date: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
          end_date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        },
        headers,
      },
    )

    return lastValueFrom(zip(requestLimit, requestUsage)).then(
      ([
        {
          data: { access_until, hard_limit_usd },
        },
        {
          data: { total_usage },
        },
      ]) => ({
        limitUsd: hard_limit_usd,
        expireAt: new Date(access_until * 1000),
        usage: total_usage.toFixed(2) / 100,
      }),
    )
  }

  /**
   * 从数据库更新缓存
   * @returns
   */
  private async updateKeysCacheFormDB() {
    const keys = await this.findAll({ state: OpenAIKeyState.Valid }).then(
      (openAIKeys) => openAIKeys.map((x) => x.key),
    )

    // 更新缓存
    if (keys.length > 0) {
      return this.cacheManager.set(CACHE_OPENAI_KEYS, keys)
    }

    return keys
  }

  /**
   * 获取OpenAIKey
   * @returns
   */
  async getOpenAIKey() {
    let keys: string[] = []
    // 从缓存中获取
    keys = await this.cacheManager.get<string[]>(CACHE_OPENAI_KEYS)
    // 如果缓存中没有，从数据库中获取
    if (!keys || keys.length === 0) {
      keys = await this.updateKeysCacheFormDB()
    }
    // 如果数据库中没有，使用默认的
    switch (true) {
      case keys.length === 1:
        return keys[0]
      case keys.length > 1:
        return keys[Math.floor(Math.random() * keys.length)]
      default:
        return this.config.get('openai.apikey')
    }
  }

  /**
   * 同步密钥余额
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncBalances() {
    const keys = (await this.findAll()).filter(
      (key) => key.enable && key.state === OpenAIKeyState.Valid,
    )

    const openaiKeys = await Promise.all(
      keys.map(async (openAIKey) => {
        try {
          const { expireAt, usage, limitUsd } = await this.getKeyBalance(
            openAIKey.key,
          )
          console.log(expireAt, usage, limitUsd)
          openAIKey.expireAt = new Date(expireAt)
          openAIKey.usage = usage
          openAIKey.limit = limitUsd
        } catch (ex) {
          openAIKey.state = OpenAIKeyState.Valid
        }

        await openAIKey.save()

        return openAIKey
      }),
    )

    await this.cacheManager.set(
      CACHE_OPENAI_KEYS,
      openaiKeys
        .filter((openAIKey) => openAIKey.state === OpenAIKeyState.Valid)
        .map((openAIKeys) => openAIKeys.key),
    )
  }
}

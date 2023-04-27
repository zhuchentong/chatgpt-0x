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
import { random } from 'nanoid'
import { Logger } from 'src/core/logger/services/logger.service'

@Injectable()
export class KeyService {
  constructor(
    private readonly config: ConfigService,
    private httpService: HttpService,
    @InjectRepository(OpenAIKey)
    private openAIKeyRepository: Repository<OpenAIKey>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {}

  async create(key: string) {
    try {
      const { expireAt, usage, limitUsd } = await this.getKeyBalance(key)

      // 清除缓存
      await this.cacheManager.del('OPENAI_KEYS')

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
      order: {
        createdAt: 'DESC',
      },
    })
  }

  remove(key: string) {
    return this.openAIKeyRepository.delete(key)
  }

  async update(key: string, openAIKey: Partial<OpenAIKey>) {
    //TODO: 更新Key状态
    await this.cacheManager.del('OPENAI_KEYS')

    return this.openAIKeyRepository.update(key, openAIKey)
  }

  async getKeyBalance(key: string) {
    // 查使用量
    const { apiurl } = this.config.get('openai')

    const headers = {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    }

    const requestLimit = this.httpService.get(
      `${apiurl}/dashboard/billing/subscription`,
      { headers },
    )

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

  async getOpenAIKey() {
    let keys = []
    // 从缓存中获取
    keys = await this.cacheManager.get(`OPENAI_KEYS`)

    if (!keys || !keys.length) {
      keys = (await this.findAll({ state: OpenAIKeyState.Valid })).map(
        (openAIKey) => openAIKey.key,
      )

      await this.cacheManager.set(`OPENAI_KEYS`, keys)
    }

    if (keys.length > 0) {
      return keys[Math.floor(Math.random() * keys.length)]
    } else {
      const { apikey } = this.config.get('openai')

      return apikey
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
          openAIKey.expireAt = new Date(expireAt)
          openAIKey.usage = usage
          openAIKey.limit = limitUsd
        } catch (ex) {
          this.logger.error(
            '同步余额失败:',
            openAIKey.key,
            ex.response?.data?.error,
          )
          openAIKey.state = OpenAIKeyState.Invalid
        }

        await openAIKey.save()

        return openAIKey
      }),
    )

    await this.cacheManager.set(
      `OPENAI_KEYS`,
      openaiKeys
        .filter((openAIKey) => openAIKey.state === OpenAIKeyState.Valid)
        .map((openAIKeys) => openAIKeys.key),
    )
  }
}

import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { lastValueFrom, zip } from 'rxjs'
import { OpenAIKey } from 'src/entities/openai-key.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import dayjs from 'dayjs'
import { ToastException } from 'src/exceptions/toast.exception'
import { OpenAIKeyState } from 'src/config/enum.config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { CACHE_OPENAI_KEYS } from 'src/config/constants'
import { OpenaiConfig } from 'src/config/configurations'

@Injectable()
export class KeyService {
  private static keyIndex = 0

  constructor(
    private httpService: HttpService,
    @Inject(OpenaiConfig.KEY)
    private readonly openaiConfig: ConfigType<typeof OpenaiConfig>,
    @InjectRepository(OpenAIKey)
    private openAIKeyRepository: Repository<OpenAIKey>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(key: string) {
    try {
      const { expireAt, usage, limitUsd } = await this.getKeyBalance(key)
      const openAIKey = await this.openAIKeyRepository.save(
        {
          key,
          expireAt,
          usage,
          limit: limitUsd,
          state:
            limitUsd > usage ? OpenAIKeyState.Valid : OpenAIKeyState.Invalid,
        },
        { reload: true },
      )

      // 清除缓存
      await this.cacheManager.del(CACHE_OPENAI_KEYS)

      return openAIKey
    } catch (ex) {
      throw new ToastException('当前OpenAIKey无效')
    }
  }

  findAll(where: FindOptionsWhere<OpenAIKey> = {}) {
    return this.openAIKeyRepository.find({
      where,
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
    await this.cacheManager.del(CACHE_OPENAI_KEYS)

    return this.openAIKeyRepository.update(key, openAIKey)
  }

  async throwError(key: string) {
    const openAiKey = await this.openAIKeyRepository.findOneBy({ key })

    if (!openAiKey) {
      return
    }

    openAiKey.exceptionTimes = 1 + (openAiKey.exceptionTimes || 0)
    openAiKey.exceptionTotal = 1 + (openAiKey.exceptionTotal || 0)

    // 5次异常后，标记为无效
    // 停止修改状态标志
    // if (openAiKey.exceptionTimes >= 5) {
    //   openAiKey.state = OpenAIKeyState.Invalid
    // }

    return openAiKey.save({ reload: true })
  }

  /**
   * 获取OpenAIKey余额信息
   * @param key
   * @returns
   */
  async getKeyBalance(key: string) {
    // 查使用量
    const apiurl = this.openaiConfig.apiurl.replace('proxy-sse', 'proxy')
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
    const keys = await this.findAll({
      state: OpenAIKeyState.Valid,
      enable: true,
    }).then((openAIKeys) => openAIKeys.map((x) => x.key))

    // 更新缓存
    if (keys.length > 0) {
      this.cacheManager.set(CACHE_OPENAI_KEYS, keys)
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
      KeyService.keyIndex = 0
    }
    // 如果数据库中没有，使用默认的
    switch (true) {
      case Array.isArray(keys) && keys.length === 1:
        return keys[0]
      case Array.isArray(keys) && keys.length > 1: {
        KeyService.keyIndex = (KeyService.keyIndex + 1) % keys.length

        const key = keys[KeyService.keyIndex]
        KeyService.keyIndex = KeyService.keyIndex
        return key
      }
      default:
        return this.openaiConfig.apikey
    }
  }

  /**
   * 同步密钥余额
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncBalances() {
    const keys = await this.findAll({
      enable: true,
    })

    const openaiKeys = await Promise.all(
      keys.map(async (openAIKey) => {
        try {
          const { expireAt, usage, limitUsd } = await this.getKeyBalance(
            openAIKey.key,
          )

          openAIKey.expireAt = new Date(expireAt)
          openAIKey.usage = usage
          openAIKey.limit = limitUsd
          openAIKey.state =
            limitUsd > usage ? OpenAIKeyState.Valid : OpenAIKeyState.Invalid

          await openAIKey.save()
        } catch (ex) {
          Logger.error('同步余额失败:', openAIKey.key, ex.response?.data?.error)
          // openAIKey.state = OpenAIKeyState.Invalid
        }

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

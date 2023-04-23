import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BalanceOrigin, ProductType } from 'src/config/enum.config'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Balance } from 'src/entities/balance.entity'
import { MoreThan, Raw, Repository } from 'typeorm'
import * as dayjs from 'dayjs'
import { Order } from 'src/entities/order.entity'
import { User } from 'src/entities/user.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getUserBalanceEndTime(userId: string) {
    const { endTime } = await this.balanceRepository
      .createQueryBuilder('balance')
      .select('MAX(balance.endTime)', 'endTime')
      .where('balance.user.id = :userId', { userId })
      .andWhere('balance.enable = true')
      .andWhere('balance.type = :type', { type: ProductType.Time })
      .getRawOne()
    console.log(endTime)
    return endTime ? dayjs(endTime) : dayjs()
  }

  /**
   * 通过兑换码创建
   * @param code
   * @returns
   */
  async createByCode(code: ActiveCode, user: User) {
    const balance = this.balanceRepository.create({
      origin: BalanceOrigin.Code,
      type: code.type,
    })

    switch (code.type) {
      case ProductType.Time:
        {
          const startTime = await this.getUserBalanceEndTime(user.id)
          balance.startTime = startTime.toDate()
          balance.endTime = startTime.add(code.value, 'day').toDate()
        }
        break
      case ProductType.Count:
        {
          balance.startCount = code.value
          balance.currentCount = code.value
        }
        break
    }

    balance.code = code
    balance.user = user

    return this.balanceRepository.save(balance)
  }

  async getUserBalanceFromCache(userId) {
    const balance = await this.cacheManager.get<Balance>(`BALANCE:${userId}`)

    if (balance) {
      return balance
    }
  }

  async getUserBalanceFromDB(userId) {
    const balances = await this.balanceRepository.find({
      where: [
        {
          enable: true,
          type: ProductType.Time,
          endTime: Raw((time) => `${time} > NOW()`),
          user: { id: userId },
        },
        {
          enable: true,
          type: ProductType.Count,
          currentCount: MoreThan(0),
          user: { id: userId },
        },
      ],
    })

    const balance =
      balances.find((balance) => balance.type === ProductType.Time) ||
      balances.find((balance) => balance.type === ProductType.Count)

    if (balance) {
      this.cacheManager.set(`BALANCE:${userId}`, balance)
    }

    return balance
  }

  async getUserBalance(userId: string) {
    const balance = await this.getUserBalanceFromCache(userId)

    if (balance) {
      return balance
    } else {
      return this.getUserBalanceFromDB(userId)
    }
  }

  async getUserBalances(userId: string) {
    return await this.balanceRepository.find({
      where: [
        {
          enable: true,
          type: ProductType.Time,
          endTime: Raw((time) => `${time} > NOW()`),
          user: { id: userId },
        },
        {
          enable: true,
          type: ProductType.Count,
          currentCount: MoreThan(0),
          user: { id: userId },
        },
      ],
    })
  }

  async consumeUserBalance(userId: string) {
    const balance = await this.getUserBalanceFromCache(userId)

    if (balance.type === ProductType.Time) {
      return
    }

    // 消耗1次
    balance.currentCount -= 1
    // 更新缓存
    this.cacheManager.set(`BALANCE:${userId}`, balance)
    // 更新数据库
    this.balanceRepository.decrement({ id: balance.id }, 'currentCount', 1)

    // 余额为0时删除缓存
    if (balance.currentCount <= 0) {
      this.cacheManager.del(`BALANCE:${userId}`)
    }
  }
}

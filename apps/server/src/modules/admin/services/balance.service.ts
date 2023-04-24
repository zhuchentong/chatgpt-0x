import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BalanceOrigin, ProductType } from 'src/config/enum.config'
import { Balance } from 'src/entities/balance.entity'
import { MoreThan, Raw, Repository } from 'typeorm'
import { Cache } from 'cache-manager'
import dayjs from 'dayjs'
import { Order } from 'src/entities/order.entity'
import { plainToInstance } from 'class-transformer'
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
   * 通过订单创建
   * @param order
   * @returns
   */
  async createByOrder(order: Order) {
    const product = order.product

    try {
      const balance = this.balanceRepository.create({
        origin: BalanceOrigin.Order,
        type: product.type,
      })

      switch (product.type) {
        case ProductType.Time:
          {
            const startTime = await this.getUserBalanceEndTime(order.user.id)
            balance.startTime = startTime.toDate()
            balance.endTime = startTime.add(product.value, 'day').toDate()
          }
          break
        case ProductType.Count:
          {
            balance.startCount = product.value
            balance.currentCount = product.value
          }
          break
      }

      balance.order = order
      balance.user = order.user

      // 清除缓存
      await this.cacheManager.del(`BALANCE:${order.user.id}`)

      return this.balanceRepository.save(balance)
    } catch (e) {
      console.log(e)
    }
  }

  private async getUserBalanceFromCache(userId) {
    const balance = await this.cacheManager.get<Balance>(`BALANCE:${userId}`)

    if (balance) {
      return plainToInstance(Balance, balance)
    }
  }

  private async getUserBalanceFromDB(userId) {
    const balances = await this.balanceRepository.find({
      where: [
        {
          enable: true,
          type: ProductType.Time,
          startTime: Raw((time) => `${time} < NOW()`),
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
      relations: { user: true },
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
}

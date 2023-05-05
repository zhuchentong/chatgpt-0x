import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  BalanceOrigin,
  CycleType,
  PaginatorMode,
  ProductType,
} from 'src/config/enum.config'
import { Balance } from 'src/entities/balance.entity'
import { MoreThan, Raw, Repository } from 'typeorm'
import { Cache } from 'cache-manager'
import dayjs from 'dayjs'
import { plainToInstance } from 'class-transformer'
import { CACHE_BALANCE } from 'src/config/constants'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { User } from 'src/entities/user.entity'
import { Order } from 'src/entities/order.entity'
import { OrderMode } from 'src/config/enum.config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Logger } from 'src/core/logger/services/logger.service'

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {}

  async findAll({ buildWhereQuery, page, order }: QueryInputParam<User>) {
    const builder = this.balanceRepository.createQueryBuilder('balance')

    builder
      .andWhere(buildWhereQuery())
      .addSelect('balance.created_at', 'created_at')
      .leftJoinAndSelect('balance.user', 'user', 'user.id = balance.user_id')

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Balance,
      query: {
        order: { created_at: OrderMode.DESC, ...order },
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  private getNextCycleTime({
    time,
    cycleType,
  }: {
    time?: Date
    cycleType: CycleType
  }) {
    return dayjs(time).add(
      1,
      (
        {
          [CycleType.Minute]: 'minute',
          [CycleType.Day]: 'day',
          [CycleType.Week]: 'week',
          [CycleType.Month]: 'month',
        } as Record<CycleType, dayjs.ManipulateType>
      )[cycleType],
    )
  }

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
    try {
      const balance = await this.createBalanceEntity({
        user: order.user,
        origin: BalanceOrigin.Order,
        type: order.product.type,
        value: order.product.value,
        cycleType: order.product.cycleType,
        cycleTime: order.product.cycleTime,
      })

      balance.order = order

      // 清除缓存
      await this.cacheManager.del(`${CACHE_BALANCE}:${order.user.id}`)

      return this.balanceRepository.save(balance)
    } catch (e) {
      console.log(e)
    }
  }

  private async createBalanceEntity({
    user,
    origin,
    type,
    value,
    cycleType,
    cycleTime,
  }: {
    user: User
    origin: BalanceOrigin
    type: ProductType
    value: number
    cycleType?: CycleType
    cycleTime?: number
  }) {
    const balance = this.balanceRepository.create({
      user,
      type,
      origin,
      enable: true,
    })

    switch (type) {
      case ProductType.Time:
        {
          const startTime = await this.getUserBalanceEndTime(user.id)
          balance.startTime = startTime.toDate()
          balance.endTime = startTime.add(value, 'day').toDate()
        }
        break
      case ProductType.Count:
        {
          balance.startCount = value
          balance.currentCount = value
        }
        break
      case ProductType.Cycle:
        {
          const startTime = await this.getUserBalanceEndTime(user.id)
          balance.startTime = startTime.toDate()
          balance.endTime = startTime.add(cycleTime, 'day').toDate()

          balance.startCount = value
          balance.currentCount = value
          balance.cycleType = cycleType
          balance.nextCycleTime = this.getNextCycleTime({ cycleType }).toDate()
        }
        break
    }

    return balance
  }

  private async getUserBalanceFromCache(userId) {
    const balance = await this.cacheManager.get<Balance>(
      `${CACHE_BALANCE}:${userId}`,
    )

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
          type: ProductType.Cycle,
          startTime: Raw((time) => `${time} < NOW()`),
          endTime: Raw((time) => `${time} > NOW()`),
          currentCount: MoreThan(0),
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
      // 优先取时间
      balances.find((balance) => balance.type === ProductType.Time) ||
      // 其次取周期
      balances.find((balance) => balance.type === ProductType.Cycle) ||
      // 最后取次数
      balances.find((balance) => balance.type === ProductType.Count)

    if (balance) {
      this.cacheManager.set(`${CACHE_BALANCE}:${userId}`, balance)
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

  /**
   * 更新周期余额
   */
  @Cron('* * 0 * * *', {
    name: 'updateCycleBalance',
    timeZone: 'Asia/Shanghai',
  })
  async updateCycleBalance() {
    console.log('开始重置余额')
    const balances = await this.balanceRepository.find({
      where: {
        enable: true,
        type: ProductType.Cycle,
        nextCycleTime: Raw((time) => `${time} < NOW()`),
        endTime: Raw((time) => `${time} > NOW()`),
      },
    })

    for (const balance of balances) {
      const nextCycleTime = this.getNextCycleTime({
        time: balance.nextCycleTime,
        cycleType: balance.cycleType,
      })

      if (nextCycleTime.isBefore(balance.endTime)) {
        this.logger.debug('开始重置余额', balance.id)

        balance.currentCount = balance.startCount
        balance.nextCycleTime = balance.nextCycleTime

        await this.balanceRepository.save(balance)
      }
    }
  }
}

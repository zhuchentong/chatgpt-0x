import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  BalanceOrigin,
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
import { ConfigService } from '@nestjs/config'
import { Logger } from 'src/core/logger/services/logger.service'
@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly config: ConfigService,
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
        origin: BalanceOrigin.Register,
        type: order.product.type,
        value: order.product.value,
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
  }: {
    user: User
    origin: BalanceOrigin
    type: ProductType
    value: number
  }) {
    const balance = this.balanceRepository.create({ user, type, origin })

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
}

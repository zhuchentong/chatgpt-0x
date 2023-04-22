import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductType } from 'src/config/enum.config'
import { Balance } from 'src/entities/balance.entity'
import { MoreThan, Raw, Repository } from 'typeorm'
import { Cache } from 'cache-manager'
@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private async getUserBalanceFromCache(userId) {
    const balance = await this.cacheManager.get<Balance>(`BALANCE:${userId}`)

    if (balance) {
      return balance
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

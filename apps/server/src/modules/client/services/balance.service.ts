import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BalanceOrigin, ProductType } from 'src/config/enum.config'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Balance } from 'src/entities/balance.entity'
import { MoreThan, Raw, Repository } from 'typeorm'
import dayjs from 'dayjs'
import { User } from 'src/entities/user.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { plainToInstance } from 'class-transformer'
import { CACHE_BALANCE } from 'src/config/constants'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'src/core/logger/services/logger.service'
import { UserService } from './user.service'
import { InviteService } from './invite.service'
import { product } from 'ramda'

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly inviteService: InviteService,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {}

  /**
   *  获取用户日期余额结束时间
   * @param userId
   * @returns
   */
  async getUserBalanceEndTime(userId: string) {
    const { endTime } = await this.balanceRepository
      .createQueryBuilder('balance')
      .select('MAX(balance.endTime)', 'endTime')
      .where('balance.user.id = :userId', { userId })
      .andWhere('balance.enable = true')
      .andWhere('balance.type = :type', { type: ProductType.Time })
      .getRawOne()

    return endTime ? dayjs(endTime) : dayjs()
  }

  /**
   *  创建余额实体
   * @param param0
   * @returns
   */
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

  /**
   * 通过注册创建
   */
  async createByRegister(user: User) {
    const { type, value } = this.config.get('setting.balance.events.register')

    if (!type || !value) {
      this.logger.warn('注册奖励未配置')
      return
    }

    const balance = await this.createBalanceEntity({
      user,
      origin: BalanceOrigin.Register,
      type,
      value,
    })

    // 清除缓存
    await this.cacheManager.del(`${CACHE_BALANCE}:${user.id}`)

    return this.balanceRepository.save(balance)
  }

  /**
   * 通过邀请创建
   */
  async createByInvite(invitee: User, inviterId: string) {
    const inviterReward = this.config.get('setting.balance.events.inviter')
    const inviteeReward = this.config.get('setting.balance.events.invitee')

    const inviter = await this.userService.findOne(inviterId)

    if (!inviter) {
      this.logger.warn('邀请人不存在')
      return
    }

    if (!inviterReward || !inviteeReward) {
      this.logger.warn('邀请奖励未配置')
      return
    }

    // 创建邀请人余额奖励
    const inviteeBalance = await this.createBalanceEntity({
      user: invitee,
      origin: BalanceOrigin.Invite,
      type: inviteeReward.type,
      value: inviteeReward.value,
    })

    // 创建被邀请人奖励
    const inviterBalance = await this.createBalanceEntity({
      user: inviter,
      origin: BalanceOrigin.Invite,
      type: inviterReward.type,
      value: inviterReward.value,
    })

    // 清除缓存
    await this.cacheManager.del(`${CACHE_BALANCE}:${inviter.id}`)

    // 添加余额奖励
    await this.balanceRepository.save([inviteeBalance, inviterBalance], {
      reload: true,
    })

    // 创建邀请记录
    await this.inviteService.create({
      inviter,
      invitee,
      inviteeReward: inviteeBalance,
      inviterReward: inviterBalance,
    })
  }

  /**
   * 通过兑换码创建
   * @param code
   * @returns
   */
  async createByCode(code: ActiveCode, user: User) {
    const balance = await this.createBalanceEntity({
      user,
      origin: BalanceOrigin.Code,
      type: code.type,
      value: code.value,
    })

    balance.code = code

    // 清除缓存
    await this.cacheManager.del(`${CACHE_BALANCE}:${user.id}`)

    return this.balanceRepository.save(balance)
  }

  /**
   *  从缓存获取用户余额
   * @param userId
   * @returns
   */
  async getUserBalanceFromCache(userId) {
    const balance = await this.cacheManager.get<Balance>(
      `${CACHE_BALANCE}:${userId}`,
    )

    if (balance) {
      return plainToInstance(Balance, balance)
    }
  }

  /**
   *  从数据库获取用户余额
   * @param userId
   * @returns
   */
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
          type: ProductType.Cycle,
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

  /**
   *  获取用户余额
   * @param userId
   * @returns
   */
  async getUserBalance(userId: string) {
    const balance = await this.getUserBalanceFromCache(userId)

    if (balance) {
      return balance
    } else {
      return this.getUserBalanceFromDB(userId)
    }
  }

  /**
   *  获取用户余额列表
   * @param userId
   * @returns
   */
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
          type: ProductType.Cycle,
          currentCount: MoreThan(0),
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

  /**
   *  消耗用户余额
   * @param userId
   */
  async consumeUserBalance(userId: string) {
    const balance = await this.getUserBalanceFromCache(userId)

    switch (true) {
      case [ProductType.Cycle, ProductType.Count].includes(balance.type): {
        // 消耗1次
        balance.currentCount -= 1
        // 更新缓存
        this.cacheManager.set(`${CACHE_BALANCE}:${userId}`, balance)
        // 更新数据库
        this.balanceRepository.decrement({ id: balance.id }, 'currentCount', 1)

        // 余额为0时删除缓存
        if (balance.currentCount <= 0) {
          this.cacheManager.del(`${CACHE_BALANCE}:${userId}`)
        }

        break
      }
      case ProductType.Time === balance.type: {
        // 余额为0时删除缓存
        if (balance.endTime.getTime() < Date.now()) {
          this.cacheManager.del(`${CACHE_BALANCE}:${userId}`)
        }

        break
      }
    }
  }
}

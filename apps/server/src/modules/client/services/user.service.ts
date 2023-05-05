import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthService } from 'src/core/auth/services/auth.service'
import { User } from 'src/entities/user.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { BalanceService } from './balance.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
    @Inject(forwardRef(() => BalanceService))
    private balanceService: BalanceService,
  ) {}

  /**
   * 创建用户
   * @param username
   * @param password
   * @returns
   */
  public async createByEmailPassword(email: string, password: string) {
    const hash = await this.authService.hashPassword(password)

    const user = this.userRepository.create({
      email,
      password: hash,
    })

    return user.save({ reload: true })
  }

  /**
   * 添加管理员
   * @param username
   * @param password
   * @returns
   */
  public async createByOpenID(openid: string) {
    const user = this.userRepository.create({
      openid,
    })

    return user.save({ reload: true })
  }

  /**
   * 获取管理员
   * @param id
   * @returns
   */
  findOne(id: string) {
    return this.userRepository.findOneBy({ id })
  }

  /**
   * 获取管理员
   * @param id
   * @returns
   */
  findOneBy(user: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(user)
  }

  /**
   * 用户登录
   * @param param0
   */
  async login({ openid }: { openid: string }): Promise<{
    user: User
    isNewRegister: boolean
  }> {
    const isExistUser = await this.findOneBy({ openid })

    if (isExistUser) {
      return { user: isExistUser, isNewRegister: false }
    }

    const user = await this.createByOpenID(openid)

    return {
      user,
      isNewRegister: true,
    }
  }

  /**
   * 发放用户奖励
   */
  async sendUserReward(
    user: User,
    { isNewRegister, inviter }: { isNewRegister: boolean; inviter: string },
  ) {
    // 新用户注册处理
    if (isNewRegister) {
      // 注册赠送余额
      await this.balanceService.createByRegister(user)
    }

    // 邀请注册处理
    if (isNewRegister && inviter) {
      // 邀请注册赠送余额
      await this.balanceService.createByInvite(user, inviter)
    }
  }
}

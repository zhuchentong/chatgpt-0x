import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Balance } from 'src/entities/balance.entity'
import { User } from 'src/entities/user.entity'
import { Raw, Repository } from 'typeorm'
import { BalanceService } from './balance.service'
import { ToastException } from 'src/exceptions/toast.exception'

@Injectable()
export class ActiveCodeService {
  constructor(
    @InjectRepository(ActiveCode)
    private activeCodeRepository: Repository<ActiveCode>,
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    private balanceService: BalanceService,
  ) {}

  /**
   * 通过兑换码创建
   * @param code
   * @returns
   */
  findOne(key: string) {
    return this.activeCodeRepository.findOneBy({ key })
  }

  async useActiveCode(key: string, user: User) {
    // 检测兑换码是否存在
    const code = await this.activeCodeRepository.findOne({
      where: {
        key,
        enable: true,
        startTime: Raw((time) => `${time} < NOW()`),
        endTime: Raw((time) => `${time} > NOW()`),
      },
    })

    if (!code) {
      throw new ToastException('兑换码不存在或已经过期')
    }

    // 检测兑换码是否已经使用
    const isUsed = await this.balanceRepository.count({
      where: {
        code: { key },
        user: { id: user.id },
      },
    })

    if (isUsed) {
      throw new ToastException('兑换码已使用')
    }

    // 检测兑换码是否已经使用完
    const useCount = await this.balanceRepository.count({
      where: {
        code: { key },
      },
    })

    if (code.count <= useCount || code.used >= code.count) {
      throw new ToastException('兑换码已失效')
    }

    await this.balanceService.createByCode(code, user)
    await this.activeCodeRepository.increment({ key: code.key }, 'used', 1)
  }
}

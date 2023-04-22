import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BalanceOrigin, ProductType } from 'src/config/enum.config'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Balance } from 'src/entities/balance.entity'
import { Repository } from 'typeorm'
import dayjs from 'dayjs'
import { Order } from 'src/entities/order.entity'
import { User } from 'src/entities/user.entity'
@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
  ) {}

  /**
   * 通过兑换码创建
   * @param code
   * @returns
   */
  createByCode(code: ActiveCode, user: User) {
    const balance = this.balanceRepository.create({
      origin: BalanceOrigin.Code,
      type: code.type,
    })

    switch (code.type) {
      case ProductType.Time:
        balance.startTime = dayjs().toDate()
        balance.endTime = dayjs().add(code.value, 'day').toDate()
        break
      case ProductType.Count:
        balance.startCount = code.value
        balance.currentCount = code.value
        break
    }

    balance.code = code
    balance.user = user

    return this.balanceRepository.save(balance)
  }

  /**
   * 通过订单创建
   * @param order
   * @returns
   */
  createByOrder(order: Order) {
    const product = order.product
    const balance = this.balanceRepository.create({
      origin: BalanceOrigin.Code,
      type: product.type,
    })

    switch (product.type) {
      case ProductType.Time:
        balance.startTime = dayjs().toDate()
        balance.endTime = dayjs().add(product.value, 'day').toDate()
        break
      case ProductType.Count:
        balance.startCount = product.value
        balance.currentCount = product.value
        break
    }

    balance.order = order
    balance.user = order.user

    return this.balanceRepository.save(balance)
  }

  // findAll({ buildWhereQuery, page, order }: QueryInputParam<ActiveCode>) {
  //   const builder = this.activeCodeRepository.createQueryBuilder('active_code')

  //   builder.andWhere(buildWhereQuery())

  //   const paginator = buildPaginator({
  //     mode: PaginatorMode.Index,
  //     entity: ActiveCode,
  //     query: {
  //       order: { code: Order.ASC, ...order },
  //       skip: page.skip,
  //       limit: page.limit,
  //     },
  //   })

  //   return paginator.paginate(builder)
  // }

  // findOne(id: string) {
  //   return this.activeCodeRepository.findOneBy({ id })
  // }

  // update(id: string, input: UpdateActiveCodeInput) {
  //   return this.activeCodeRepository.update(id, input)
  // }

  // remove(id: string) {
  //   return this.activeCodeRepository.softDelete(id)
  // }
}

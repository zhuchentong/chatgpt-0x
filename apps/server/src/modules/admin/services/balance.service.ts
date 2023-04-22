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

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { PaginatorMode, Order } from 'src/config/enum.config'
import { ActiveCode } from 'src/entities/active-code.entity'
import { Repository } from 'typeorm'
import {
  CreateActiveCodeInput,
  UpdateActiveCodeInput,
} from '../dtos/active-code.dto'

@Injectable()
export class ActiveCodeService {
  constructor(
    @InjectRepository(ActiveCode)
    private activeCodeRepository: Repository<ActiveCode>,
  ) {}

  create(input: CreateActiveCodeInput) {
    const product = this.activeCodeRepository.create(input)

    return this.activeCodeRepository.save(product)
  }

  findAll({ buildWhereQuery, page, order }: QueryInputParam<ActiveCode>) {
    const builder = this.activeCodeRepository.createQueryBuilder('active_code')

    builder.andWhere(buildWhereQuery())

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: ActiveCode,
      query: {
        order: { code: Order.ASC, ...order },
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  findOne(key: string) {
    return this.activeCodeRepository.findOneBy({ key })
  }

  update(id: string, input: UpdateActiveCodeInput) {
    return this.activeCodeRepository.update(id, input)
  }

  remove(id: string) {
    return this.activeCodeRepository.softDelete(id)
  }
}

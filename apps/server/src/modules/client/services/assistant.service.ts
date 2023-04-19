import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { PaginatorMode, Order } from 'src/config/enum.config'
import { Assistant } from 'src/entities/assistant.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  findAll(
    { buildWhereQuery, page, order }: QueryInputParam<Assistant>,
    pageable = true,
  ) {
    const builder = this.assistantRepository.createQueryBuilder('assistant')

    builder.andWhere(buildWhereQuery())

    if (pageable) {
      const paginator = buildPaginator({
        mode: PaginatorMode.Index,
        entity: Assistant,
        query: {
          order: { code: Order.ASC, ...order },
          skip: page.skip,
          limit: page.limit,
        },
      })

      return paginator.paginate(builder)
    } else {
      return builder
        .orderBy({
          code: 'ASC',
        })
        .getMany()
    }
  }

  findOne(id: string) {
    return this.assistantRepository.findOneBy({ id })
  }
}

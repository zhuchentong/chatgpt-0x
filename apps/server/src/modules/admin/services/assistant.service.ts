import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Assistant } from 'src/entities/assistant.entity'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import {
  CreateAssistantInput,
  UpdateAssistantInput,
} from '../dtos/assistant.dto'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { Order, PaginatorMode } from 'src/config/enum.config'

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  create(input: CreateAssistantInput) {
    return this.assistantRepository.save(input)
  }

  findAll({ buildWhereQuery, page, order }: QueryInputParam<Assistant>) {
    const builder = this.assistantRepository.createQueryBuilder('administrator')

    builder.andWhere(buildWhereQuery())

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
  }

  findOne(id: string) {
    return this.assistantRepository.findOneBy({ id })
  }

  update(id: string, input: UpdateAssistantInput) {
    return this.assistantRepository.update(id, input)
  }

  remove(id: string) {
    return this.assistantRepository.delete(id)
  }

  import(assistants: CreateAssistantInput[]) {
    return this.assistantRepository.save(assistants)
  }
}

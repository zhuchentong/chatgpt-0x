import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { Assistant } from 'src/entities/assistant.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  findAll({ buildWhereQuery }: QueryInputParam<Assistant>) {
    const builder = this.assistantRepository.createQueryBuilder('assistant')
    builder.andWhere(buildWhereQuery())

    return builder
      .orderBy({
        code: 'ASC',
      })
      .getMany()
  }

  findOne(id: string) {
    return this.assistantRepository.findOneBy({ id })
  }
}

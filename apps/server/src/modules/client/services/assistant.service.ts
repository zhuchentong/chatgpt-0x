import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Assistant } from 'src/entities/assistant.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  findAll() {
    return this.assistantRepository.find({
      order: {
        code: 'ASC',
      },
    })
  }

  findOne(id: string) {
    return this.assistantRepository.findOneBy({ id })
  }
}

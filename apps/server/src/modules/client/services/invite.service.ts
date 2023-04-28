import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { Invite } from 'src/entities/invite.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
  ) {}

  /**
   *  创建
   * @param input
   * @returns
   */
  create(input: Partial<Invite>) {
    const product = this.inviteRepository.create(input)
    return this.inviteRepository.save(product)
  }

  findAll({ buildWhereParams }: QueryInputParam<Invite>) {
    return this.inviteRepository.find({
      where: buildWhereParams(),
      order: {
        createdAt: 'DESC',
      },
    })
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { Repository } from 'typeorm'
import { Invite } from 'src/entities/invite.entity'
import { OrderMode, PaginatorMode } from 'src/config/enum.config'
import { buildPaginator } from 'src/common/typeorm/query/paginator'

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

  async findAll({ buildWhereQuery, page, order }: QueryInputParam<Invite>) {
    const builder = this.inviteRepository.createQueryBuilder('invite')

    builder
      .andWhere(buildWhereQuery())
      .addSelect('invite.created_at', 'created_at')
      .leftJoinAndSelect(
        'invite.invitee',
        'invitee_user',
        'invitee_user.id = invite.invitee_id',
      )
      .leftJoinAndSelect(
        'invite.inviter',
        'inviter_user',
        'inviter_user.id = invite.inviter_id',
      )
      .leftJoinAndSelect(
        'invite.inviteeReward',
        'invitee_balance',
        'invitee_balance.id = invite.invitee_reward_id',
      )
      .leftJoinAndSelect(
        'invite.inviterReward',
        'inviter_balance',
        'inviter_balance.id = invite.inviter_reward_id',
      )

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Invite,
      query: {
        order: { created_at: OrderMode.DESC, ...order },
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }
}

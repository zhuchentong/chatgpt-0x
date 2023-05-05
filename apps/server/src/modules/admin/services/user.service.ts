import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { OrderMode, PaginatorMode } from 'src/config/enum.config'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll({ buildWhereQuery, page, order }: QueryInputParam<User>) {
    const builder = this.userRepository.createQueryBuilder('user')

    builder
      .andWhere(buildWhereQuery())
      .addSelect('user.created_at', 'created_at')
      .leftJoinAndSelect(
        'user.balances',
        'balance',
        'balance.user_id = user.id',
      )

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: User,
      query: {
        order: { created_at: OrderMode.DESC, ...order },
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }
}

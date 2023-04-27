import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { OrderMode, PaginatorMode } from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'
import { Product } from 'src/entities/product.entity'
import { Repository } from 'typeorm'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findOne(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: { product: true, user: true },
    })
  }

  async findAll({ buildWhereQuery, page, order }: QueryInputParam<Order>) {
    const builder = this.orderRepository.createQueryBuilder('order')

    builder
      .andWhere(buildWhereQuery())
      .addSelect('order.created_at', 'created_at')
      .leftJoinAndSelect('order.user', 'user', 'user.id = order.user_id')
      .leftJoinAndSelect(
        'order.product',
        'product',
        'product.id = order.product_id',
      )

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Order,
      query: {
        order: { created_at: OrderMode.DESC, ...order },
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  update(id: string, input: Partial<Order>) {
    return this.orderRepository.update(id, input)
  }
}

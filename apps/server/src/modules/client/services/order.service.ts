import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderState } from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'
import { Product } from 'src/entities/product.entity'
import { User } from 'src/entities/user.entity'
import { In, Repository } from 'typeorm'
import type { Cache } from 'cache-manager'
import { CACHE_WXPAY } from 'src/config/constants'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * 创建订单
   * @param product
   * @param user
   * @returns
   */
  createOrder(product: Product, user: User) {
    const order = this.orderRepository.create({
      state: OrderState.Pending,
      amount: product.price,
      product,
      user,
    })

    return order.save({ reload: true })
  }

  /**
   * 查询订单状态
   * @param orderId
   */
  async queryPaymentState(orderId: string): Promise<OrderState> {
    const state = await this.cacheManager.get<OrderState>(
      `${CACHE_WXPAY}:${orderId}`,
    )

    if (state) {
      return state
    } else {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        select: ['state'],
      })

      this.cacheManager.set(`${CACHE_WXPAY}:${orderId}`, order.state, {
        ttl: 10,
      })

      return order.state
    }
  }

  async getUserOrders(user: User) {
    return this.orderRepository.find({
      where: {
        user: {
          id: user.id,
        },
        state: In([OrderState.Paid, OrderState.Refunded]),
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        product: true,
      },
    })
  }
}

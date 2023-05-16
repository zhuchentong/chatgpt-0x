import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import { OrderMode, OrderState, PaginatorMode } from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'
import { Between, Repository } from 'typeorm'
import { BalanceService } from './balance.service'
import { CACHE_WXPAY } from 'src/config/constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import dayjs from 'dayjs'
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly balanceService: BalanceService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

  /**
   * 支付成功处理
   * @param params
   */
  async onPaymentSuccess({
    orderId,
    orderAmount,
    transactionId,
  }: {
    orderId: string
    orderAmount: number
    transactionId: string
  }) {
    const order = await this.findOne(orderId)

    if (
      order.id === orderId &&
      order.amount === orderAmount &&
      order.state === OrderState.Pending
    ) {
      // 订单支付成功
      order.state = OrderState.Paid
      order.paidTime = new Date()
      order.transactionId = transactionId

      // 更新订单状态
      await order.save({ reload: true })

      // 更新订单状态缓存
      this.cacheManager.set(`${CACHE_WXPAY}:${orderId}`, order.state, {
        ttl: 10,
      })

      // 更新用户余额
      await this.balanceService.createByOrder(order)
    }
  }

  async getOrderStaticial() {
    // 历史订单总数
    const getTotalOrders = this.orderRepository.findAndCountBy({
      state: OrderState.Paid,
    })

    // 历史订单总数
    const getWeekOrders = this.orderRepository.findAndCountBy({
      state: OrderState.Paid,
      createdAt: Between(dayjs().startOf('week').toDate(), new Date()),
    })

    // 历史订单总数
    const getDayOrders = this.orderRepository.findAndCountBy({
      state: OrderState.Paid,
      createdAt: Between(dayjs().startOf('day').toDate(), new Date()),
    })

    return Promise.all([getDayOrders, getWeekOrders, getTotalOrders]).then(
      ([
        [dayOrders, dayOrdersCount],
        [weekOrders, weekOrdersCount],
        [totalOrders, totalOrdersCount],
      ]) => {
        return {
          dayOrdersAmount: dayOrders.reduce((acc, cur) => acc + cur.amount, 0),
          dayOrdersCount,
          weekOrdersAmount: weekOrders.reduce(
            (acc, cur) => acc + cur.amount,
            0,
          ),
          weekOrdersCount,
          totalOrdersAmount: totalOrders.reduce(
            (acc, cur) => acc + cur.amount,
            0,
          ),
          totalOrdersCount,
        }
      },
    )
  }
}

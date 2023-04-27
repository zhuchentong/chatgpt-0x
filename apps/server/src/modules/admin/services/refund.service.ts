import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'
import { buildPaginator } from 'src/common/typeorm/query/paginator'
import {
  OrderMode,
  OrderState,
  PaginatorMode,
  RefundState,
} from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'
import { Refund } from 'src/entities/refund.entity'
import { Repository } from 'typeorm'
import { OrderService } from './order.service'

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>,
    private readonly orderService: OrderService,
  ) {}

  async findAll({ buildWhereQuery, page, order }: QueryInputParam<Refund>) {
    const builder = this.refundRepository.createQueryBuilder('refund')

    builder
      .andWhere(buildWhereQuery())
      .addSelect('refund.created_at', 'created_at')
      .leftJoinAndSelect('refund.user', 'user', 'user.id = refund.user_id')
      .leftJoinAndSelect('refund.order', 'order', 'order.id = refund.order_id')

    const paginator = buildPaginator({
      mode: PaginatorMode.Index,
      entity: Refund,
      query: {
        order: { created_at: OrderMode.DESC, ...order },
        skip: page.skip,
        limit: page.limit,
      },
    })

    return paginator.paginate(builder)
  }

  /**
   * 创建退款记录
   * @param order
   * @returns
   */
  create(id: string, order: Order, data: Partial<Refund>) {
    const rerund = this.refundRepository.create({
      id,
      order,
      amount: order.amount,
      user: order.user,
      ...data,
    })

    return rerund.save({ reload: true })
  }

  findOne(id: string) {
    return this.refundRepository.findOne({
      where: { id },
      relations: { order: true, user: true },
    })
  }

  update(id: string, input: Partial<Refund>) {
    return this.refundRepository.update(id, input)
  }

  /**
   * 退款成功处理
   * @param param0
   */
  async onRefundSuccess({
    out_refund_no,
    out_trade_no,
    refund_status,
    success_time,
  }: {
    out_refund_no: string
    out_trade_no: string
    refund_status: RefundState
    success_time: string
  }) {
    // 更新退款单状态
    await this.update(out_refund_no, {
      state: refund_status,
      refundTime: new Date(success_time),
    })

    // 更新订单状态
    await this.orderService.update(out_trade_no, {
      state: OrderState.Refunded,
    })
  }
}

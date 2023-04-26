import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RefundState } from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'
import { Refund } from 'src/entities/refund.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
  ) {}

  /**
   * 创建退款记录
   * @param order
   * @returns
   */
  create(order: Order) {
    const rerund = this.refundRepository.create({
      order,
      amount: order.price,
      user: order.user,
      state: RefundState.Processing,
    })

    return rerund.save({ reload: true })
  }

  findOne(id: string) {
    return this.refundRepository.findOne({
      where: { id },
      relations: { order: true, user: true },
    })
  }
}

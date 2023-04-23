import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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
}

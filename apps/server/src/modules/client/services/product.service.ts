import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'src/entities/product.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  getAll() {
    return this.productRepository.findBy({ enable: true })
  }

  findOne(id: string) {
    return this.productRepository.findOneBy({
      id,
      enable: true,
    })
  }
}

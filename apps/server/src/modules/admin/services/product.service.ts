import { Injectable } from '@nestjs/common'
import { Product } from 'src/entities/product.entity'
import { CreateProductInput, UpdateProductInput } from '../dtos/product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { QueryInputParam } from 'src/common/typeorm/interfaces'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(input: CreateProductInput) {
    const product = this.productRepository.create(input)

    return this.productRepository.save(product)
  }

  findAll({ buildWhereParams }: QueryInputParam<Product>) {
    return this.productRepository.find({
      where: buildWhereParams(),
      order: {
        createdAt: 'DESC',
      },
    })
  }

  findOne(id: string) {
    return this.productRepository.findOneBy({ id })
  }

  update(id: string, input: UpdateProductInput) {
    return this.productRepository.update(id, input)
  }

  remove(id: string) {
    return this.productRepository.softDelete(id)
  }
}

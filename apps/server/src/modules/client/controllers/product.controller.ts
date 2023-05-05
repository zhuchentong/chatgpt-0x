import { Controller, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger'
import { Product } from 'src/entities/product.entity'
import { ProductService } from '../services/product.service'

@Controller('product')
@ApiTags('product')
@ApiSecurity('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ operationId: 'getProducts', summary: '获取所有产品' })
  @ApiOkResponse({ type: Product, isArray: true })
  getProducts() {
    return this.productService.getAll()
  }
}

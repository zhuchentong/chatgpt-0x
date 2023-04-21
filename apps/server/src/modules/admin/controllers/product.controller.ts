import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { ProductService } from '../services/product.service'
import { Product } from 'src/entities/product.entity'
import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from '../dtos/product.dto'
import { UUIDInput } from 'src/common/typeorm/dto/uuid.input'
import { Assistant } from 'src/entities/assistant.entity'

@Controller('product')
@ApiTags('product')
@ApiSecurity('access-token')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ operationId: 'createProduct', summary: '创建产品' })
  @ApiOkResponse({ type: Product })
  create(@Body() input: CreateProductInput) {
    return this.productService.create(input)
  }

  @Get()
  @ApiOperation({ operationId: 'getProducts', summary: '获取所有产品' })
  @ApiOkResponse({ type: Product, isArray: true })
  findAll(@Query() input: FindProductInput) {
    return this.productService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getProduct', summary: '获取产品' })
  @ApiOkResponse({ type: Assistant })
  findOne(@Param() input: UUIDInput) {
    return this.productService.findOne(input.id)
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateProduct', summary: '更新产品' })
  @ApiOkResponse({ type: Assistant })
  update(@Param() { id }: UUIDInput, @Body() input: UpdateProductInput) {
    return this.productService.update(id, input)
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'removeProduct', summary: '删除产品' })
  remove(@Param() { id }: UUIDInput) {
    return this.productService.remove(id)
  }
}

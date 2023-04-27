import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator'
import { WhereOption } from 'src/common/typeorm/decorators'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { ProductType, WhereOperator } from 'src/config/enum.config'
import { Product } from 'src/entities/product.entity'

/*
 * 添加管理员
 */
export class CreateProductInput {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  type: ProductType

  @ApiProperty()
  @IsInt()
  value: number

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  enable: boolean
}

/*
 * 添加管理员
 */
export class UpdateProductInput extends PartialType(CreateProductInput) {}

export class FindProductInput extends QueryInput<Product> {
  @ApiProperty({ required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  enable?: boolean
}

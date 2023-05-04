import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator'
import { WhereOption } from 'src/common/typeorm/decorators'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { CycleType, ProductType, WhereOperator } from 'src/config/enum.config'
import { Product } from 'src/entities/product.entity'

/*
 * 添加管理员
 */
export class CreateProductInput {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  type: ProductType

  @ApiProperty({ enum: CycleType, required: false, description: '周期类型' })
  @IsEnum(CycleType)
  cycleType?: CycleType

  @ApiProperty({ required: false, description: '周期时长' })
  cycleTime?: number

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

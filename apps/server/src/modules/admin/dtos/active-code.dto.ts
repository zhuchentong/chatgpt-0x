import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { ActiveCode } from 'src/entities/active-code.entity'
import { pipe } from 'ramda'
import { ProductType, WhereOperator } from 'src/config/enum.config'
import { IsEnum, IsInt } from 'class-validator'
import { WhereOption } from 'src/common/typeorm/decorators'

/*
 * 添加管理员
 */
export class CreateActiveCodeInput {
  @ApiProperty({ description: '开始时间', type: 'string' })
  @Optional()
  startTime?: Date

  @ApiProperty({ description: '结束时间', type: 'string' })
  @Optional()
  endTime?: Date

  @ApiProperty({ description: '总量' })
  count: number

  @ApiProperty({ enum: ProductType, description: '兑换类型' })
  @IsEnum(ProductType)
  type: ProductType

  @ApiProperty({ description: '兑换值' })
  @IsInt()
  value: number

  @ApiProperty({ description: '状态' })
  enable: boolean
}

export class UpdateActiveCodeInput extends PartialType(CreateActiveCodeInput) {}

export class FindActiveCodeInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<ActiveCode>) {
  @ApiProperty({ required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  key?: string

  @ApiProperty({ required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  enable?: boolean

  @ApiProperty({ enum: ProductType, description: '兑换类型', required: false })
  @Optional()
  @WhereOption({ type: WhereOperator.Equal })
  type?: ProductType
}

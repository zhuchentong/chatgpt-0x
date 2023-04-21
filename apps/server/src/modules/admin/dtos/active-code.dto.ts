import { Optional } from '@nestjs/common'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { ActiveCode } from 'src/entities/active-code.entity'
import { pipe } from 'ramda'

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
  count: string

  @ApiProperty({ description: '商品ID' })
  productId: string
}

export class UpdateActiveCodeInput extends PartialType(CreateActiveCodeInput) {}

export class FindActiveCodeInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<ActiveCode>) {
  @ApiProperty()
  @Optional()
  code?: string

  @ApiProperty()
  @Optional()
  enable?: boolean
}

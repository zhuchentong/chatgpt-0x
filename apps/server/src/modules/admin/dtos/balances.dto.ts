import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { pipe } from 'rxjs'
import { WhereOption } from 'src/common/typeorm/decorators'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { WhereOperator } from 'src/config/enum.config'
import { Balance } from 'src/entities/balance.entity'

export class FindBalanceInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Balance>) {
  @ApiProperty({ description: '用户ID', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal })
  userId?: string

  @ApiProperty({ description: '余额类型', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal })
  type?: string

  @ApiProperty({ description: '余额来源', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal })
  origin?: string
}

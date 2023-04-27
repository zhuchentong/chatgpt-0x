import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { pipe } from 'rxjs'
import { WhereOption } from 'src/common/typeorm/decorators'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { WhereOperator, RefundState } from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'

export class FindRefundInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Order>) {
  @ApiProperty({ description: '用户ID', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal, name: 'user_id' })
  userId?: string

  @ApiProperty({ description: '订单ID', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Like, name: 'order_id' })
  orderId?: string

  @ApiProperty({ description: '退款状态', required: false, enum: RefundState })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal })
  state?: string
}

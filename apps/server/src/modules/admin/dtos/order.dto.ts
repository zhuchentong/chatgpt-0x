import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { pipe } from 'rxjs'
import { WhereOption } from 'src/common/typeorm/decorators'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { OrderState, WhereOperator } from 'src/config/enum.config'
import { Order } from 'src/entities/order.entity'

export class FindOrderInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Order>) {
  @ApiProperty({ description: '用户ID', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal, name: 'user_id' })
  userId?: string

  @ApiProperty({ description: '产品类型', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal, name: 'product.type' })
  productType?: string

  @ApiProperty({ description: '产品名称', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Like, name: 'product.name' })
  productName?: string

  @ApiProperty({ description: '订单状态', required: false, enum: OrderState })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Equal })
  state?: string
}

export class SubmitRefundInput {
  @ApiProperty({
    description: '订单ID',
  })
  @IsString()
  orderId?: string
}

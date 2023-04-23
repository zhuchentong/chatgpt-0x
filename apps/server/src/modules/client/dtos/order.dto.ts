import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, Length } from 'class-validator'

export class SubmitOrderInput {
  @ApiProperty({
    description: '产品ID',
  })
  @IsUUID()
  productId?: string
}

export class QueryPaymentStateInput {
  @ApiProperty({
    description: '订单ID',
  })
  @Length(24)
  orderId?: string
}

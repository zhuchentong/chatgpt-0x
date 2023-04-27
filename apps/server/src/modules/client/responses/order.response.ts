import { ApiProperty } from '@nestjs/swagger'
import { OrderState } from 'src/config/enum.config'

export class SubmitOrderResponse {
  @ApiProperty({ description: '微信支付二维码' })
  qrcode: string

  @ApiProperty({ description: '商品名称' })
  name: string

  @ApiProperty({ description: '价格' })
  amount: number

  @ApiProperty({ description: '订单ID' })
  orderId
}

export class QueryPaymentStateResponse {
  @ApiProperty({ description: '支付状态', enum: OrderState })
  state: OrderState
}

import { ApiProperty } from '@nestjs/swagger'

export class SubmitRefundResponse {}

export class OrderStaticial {
  @ApiProperty({ description: 'dayOrdersAmount' })
  dayOrdersAmount: number
  @ApiProperty({ description: 'dayOrdersCount' })
  dayOrdersCount: number
  @ApiProperty({ description: 'weekOrdersAmount' })
  weekOrdersAmount: number
  @ApiProperty({ description: 'weekOrdersCount' })
  weekOrdersCount: number
  @ApiProperty({ description: 'totalOrdersAmount' })
  totalOrdersAmount: number
  @ApiProperty({ description: 'totalOrdersCount' })
  totalOrdersCount: number
}

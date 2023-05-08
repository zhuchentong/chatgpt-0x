import { ApiProperty } from '@nestjs/swagger'

export class PayJSAPIResponse {
  @ApiProperty({ description: 'appId' })
  appId: string

  @ApiProperty({ description: 'timestamp' })
  timeStamp: number

  @ApiProperty({ description: 'nonceStr' })
  nonceStr: string

  @ApiProperty({ description: 'package' })
  package: string

  @ApiProperty({ description: 'signType' })
  signType: string

  @ApiProperty({ description: 'paySign' })
  paySign: string
}

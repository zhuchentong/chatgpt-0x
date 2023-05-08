import { ApiProperty } from '@nestjs/swagger'

export class JSSignatureResponse {
  @ApiProperty({ description: 'appId' })
  appId: string

  @ApiProperty({ description: 'timestamp' })
  timestamp: number

  @ApiProperty({ description: 'nonceStr' })
  nonceStr: string

  @ApiProperty({ description: 'signature' })
  signature: string
}

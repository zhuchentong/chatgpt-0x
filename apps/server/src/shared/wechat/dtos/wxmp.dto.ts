import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 登录
 */
export class AuthorizeInput {
  @ApiProperty({ description: '邀请人', required: false })
  @Optional()
  inviter?: string
}

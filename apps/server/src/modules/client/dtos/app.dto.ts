import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, IsOptional } from 'class-validator'

/**
 * 登录
 */
export class WeappLoginInput {
  @ApiProperty()
  @IsString()
  code: string
}

export class EmailLoginInput {
  @ApiProperty({ description: '用户邮箱' })
  @Length(5, 20)
  email: string

  @ApiProperty({ description: '密码' })
  @Length(6, 20)
  password: string
}

export class EmailRegisterInput {
  @ApiProperty({ description: '用户邮箱' })
  @Length(5, 20)
  email: string

  @ApiProperty({ description: '密码' })
  @Length(6, 20)
  password: string

  @ApiProperty({ description: '验证码' })
  @Length(6, 6)
  code: string
}

export class SendRegisterCodeInput {
  @ApiProperty({ description: '用户邮箱' })
  @IsEmail()
  email: string
}

export class QrcodeLoginStatusInput {
  @ApiProperty({ description: '用户登录码' })
  @IsString()
  code: string

  @ApiProperty({ description: '邀请人ID', required: true, nullable: true })
  @IsOptional()
  inviter?: string
}

export class WechatLoginInput {
  @ApiProperty({ description: '用户openid' })
  @IsString()
  openid: string
}

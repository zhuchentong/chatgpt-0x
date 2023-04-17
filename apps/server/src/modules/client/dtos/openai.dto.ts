import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ChatMessageInput {
  @ApiProperty({ description: '用户消息' })
  @IsString()
  message: string

  @ApiProperty({ description: '父消息ID', required: false })
  @Optional()
  parentMessageId: string

  @ApiProperty({ description: 'prompt', required: false })
  @Optional()
  prompt: string
}

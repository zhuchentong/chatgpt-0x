import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { OpenAIKeyState } from 'src/config/enum.config'

export class UpdateOpenAIKeyInput {
  @ApiProperty({ description: '状态', required: false })
  @IsEnum(OpenAIKeyState)
  @IsOptional()
  state?: OpenAIKeyState
}

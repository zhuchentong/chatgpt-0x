import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { OpenAIKeyState } from 'src/config/enum.config'

export class UpdateOpenAIKeyInput {
  @ApiProperty({ description: '状态', required: false })
  @IsEnum(OpenAIKeyState)
  @IsOptional()
  state?: OpenAIKeyState

  @ApiProperty({ description: '停启用', required: false })
  @IsOptional()
  enable?: boolean

  @ApiProperty({ description: '异常次数', required: false })
  @IsOptional()
  exceptionTimes?: number
}

import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { WhereOption } from 'src/common/typeorm/decorators'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { WhereOperator } from 'src/config/enum.config'
import { Assistant } from 'src/entities/assistant.entity'

export class FindAssistantInput extends QueryInput<Assistant> {
  @ApiProperty({
    description: 'id列表',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @WhereOption({ type: WhereOperator.In, name: 'id', entity: 'assistant' })
  keys?: string[]
}

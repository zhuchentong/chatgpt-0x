import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { pipe } from 'rxjs'
import { WhereOption } from 'src/common/typeorm/decorators'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { WhereOperator } from 'src/config/enum.config'
import { Assistant } from 'src/entities/assistant.entity'

export class FindAssistantByKeys extends QueryInput<Assistant> {
  @ApiProperty({
    description: 'id列表',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  @WhereOption({ type: WhereOperator.In, name: 'id', entity: 'assistant' })
  keys?: string[]
}

export class FindAssistantInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Assistant>) {
  @ApiProperty({ description: '助手名称(模糊查询)', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Like })
  name?: string
}

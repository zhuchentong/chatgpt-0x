import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { pipe } from 'rxjs'
import { WhereOption } from 'src/common/typeorm/decorators'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { WhereOperator } from 'src/config/enum.config'
import { Assistant } from 'src/entities/assistant.entity'

/*
 * 添加管理员
 */
export class CreateAssistantInput {
  @ApiProperty()
  name: string

  @ApiProperty()
  @IsString()
  prompt: string
}

/*
 * 添加管理员
 */
export class UpdateAssistantInput extends PartialType(CreateAssistantInput) {}

export class FindAssistantInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Assistant>) {
  @ApiProperty({ description: '助手名称(模糊查询)', required: false })
  @IsOptional()
  @WhereOption({ type: WhereOperator.Like })
  name?: string
}

/*
 * 添加管理员
 */
export class ImportAssistantsInput {
  @ApiProperty({ isArray: true })
  assistants: CreateAssistantInput[]
}

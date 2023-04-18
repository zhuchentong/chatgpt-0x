import { Controller, Get, Param, Query } from '@nestjs/common'
import { AssistantService } from '../services/assistant.service'
import { UUIDInput } from 'src/common/typeorm/dto/uuid.input'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { Assistant } from 'src/entities/assistant.entity'
import { plainToInstance } from 'class-transformer'
import { FindAssistantInput } from '../dtos/assistant.dto'

@Controller('assistant')
@ApiTags('assistant')
@ApiSecurity('access-token')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('keys')
  @ApiOperation({ operationId: 'getAssistantByKeys', summary: '获取所有助手' })
  @ApiOkResponse({ type: Assistant, isArray: true })
  findByKeys(@Query() input: FindAssistantInput) {
    console.log(input)
    if (!input.keys || input.keys.length === 0) {
      return []
    }

    return this.assistantService.findAll(input.params)
  }

  @Get()
  @ApiOperation({ operationId: 'getAllAssistant', summary: '获取所有助手' })
  @ApiOkResponse({ type: Assistant, isArray: true })
  findAll() {
    // 构建查询参数
    const input = plainToInstance(FindAssistantInput, {})
    return this.assistantService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAssistant', summary: '获取助手' })
  @ApiOkResponse({ type: Assistant })
  findOne(@Param() input: UUIDInput) {
    return this.assistantService.findOne(input.id)
  }
}

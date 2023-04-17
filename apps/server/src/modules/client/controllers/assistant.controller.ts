import { Controller, Get, Param } from '@nestjs/common'
import { AssistantService } from '../services/assistant.service'
import { UUIDInput } from 'src/common/typeorm/dto/uuid.input'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { Assistant } from 'src/entities/assistant.entity'

@Controller('assistant')
@ApiTags('assistant')
@ApiSecurity('access-token')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get()
  @ApiOperation({ operationId: 'getAllAssistant', summary: '获取所有助手' })
  @ApiOkResponse({ type: Assistant, isArray: true })
  findAll() {
    return this.assistantService.findAll()
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAssistant', summary: '获取助手' })
  @ApiOkResponse({ type: Assistant })
  findOne(@Param() input: UUIDInput) {
    return this.assistantService.findOne(input.id)
  }
}

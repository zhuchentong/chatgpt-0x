import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { AssistantService } from '../services/assistant.service'
import {
  CreateAssistantInput,
  FindAssistantInput,
  ImportAssistantsInput,
  UpdateAssistantInput,
} from '../dtos/assistant.dto'
import { UUIDInput } from 'src/common/typeorm/dto/uuid.input'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'
import { Assistant } from 'src/entities/assistant.entity'

@Controller('assistant')
@ApiTags('assistant')
@ApiSecurity('access-token')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post()
  @ApiOperation({ operationId: 'createAssistant', summary: '创建助手' })
  @ApiOkResponse({ type: Assistant })
  create(@Body() input: CreateAssistantInput) {
    return this.assistantService.create(input)
  }

  @Get()
  @ApiOperation({ operationId: 'findAssistant', summary: '查找助手' })
  @ApiOkResponse({ type: toPageResponse(Assistant) })
  findAll(@Query() input: FindAssistantInput) {
    return this.assistantService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getAssistant', summary: '获取助手' })
  @ApiOkResponse({ type: Assistant })
  findOne(@Param() input: UUIDInput) {
    return this.assistantService.findOne(input.id)
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateAssistant', summary: '更新助手' })
  @ApiOkResponse({ type: Assistant })
  update(@Param() { id }: UUIDInput, @Body() input: UpdateAssistantInput) {
    return this.assistantService.update(id, input)
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'removeAssistant', summary: '删除助手' })
  remove(@Param() { id }: UUIDInput) {
    return this.assistantService.remove(id)
  }

  @Post('import')
  @ApiOperation({ operationId: 'importAssistants', summary: '导入助手' })
  import(@Body() { assistants }: ImportAssistantsInput) {
    return this.assistantService.import(assistants)
  }
}

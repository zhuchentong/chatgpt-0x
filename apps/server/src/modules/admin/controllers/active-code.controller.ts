import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import {
  CreateActiveCodeInput,
  FindActiveCodeInput,
  UpdateActiveCodeInput,
} from '../dtos/active-code.dto'
import { ActiveCode } from 'src/entities/active-code.entity'
import { UUIDInput } from 'src/common/typeorm/dto/uuid.input'
import { Assistant } from 'src/entities/assistant.entity'
import { ActiveCodeService } from '../services/active-code.service'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'

@Controller('active-code')
@ApiTags('active-code')
@ApiSecurity('access-token')
export class ActiveCodeController {
  constructor(private readonly activeCodeService: ActiveCodeService) {}

  @Post()
  @ApiOperation({ operationId: 'createActiveCode', summary: '创建兑换码' })
  @ApiOkResponse({ type: ActiveCode })
  create(@Body() input: CreateActiveCodeInput) {
    return this.activeCodeService.create(input)
  }

  @Get()
  @ApiOperation({ operationId: 'findActiveCodes', summary: '查找激活码' })
  @ApiOkResponse({ type: toPageResponse(ActiveCode) })
  findAll(@Query() input: FindActiveCodeInput) {
    return this.activeCodeService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getActiveCode', summary: '获取激活码' })
  @ApiOkResponse({ type: Assistant })
  findOne(@Param() input: UUIDInput) {
    return this.activeCodeService.findOne(input.id)
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateActiveCode', summary: '更新激活码' })
  @ApiOkResponse({ type: Assistant })
  update(@Param() { id }: UUIDInput, @Body() input: UpdateActiveCodeInput) {
    return this.activeCodeService.update(id, input)
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'removeActiveCode', summary: '删除激活码' })
  remove(@Param() { id }: UUIDInput) {
    return this.activeCodeService.remove(id)
  }
}

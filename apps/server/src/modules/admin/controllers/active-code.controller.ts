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

@Controller('active-code')
@ApiTags('active-code')
@ApiSecurity('access-token')
export class ActiveCodeController {
  constructor(private readonly activeCodeService: ActiveCodeService) {}

  @Post()
  @ApiOperation({ operationId: 'createProduct', summary: '创建产品' })
  @ApiOkResponse({ type: ActiveCode })
  create(@Body() input: CreateActiveCodeInput) {
    return this.activeCodeService.create(input)
  }

  @Get()
  @ApiOperation({ operationId: 'getProducts', summary: '获取所有产品' })
  @ApiOkResponse({ type: ActiveCode, isArray: true })
  findAll(@Query() input: FindActiveCodeInput) {
    return this.activeCodeService.findAll(input.params)
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getProduct', summary: '获取产品' })
  @ApiOkResponse({ type: Assistant })
  findOne(@Param() input: UUIDInput) {
    return this.activeCodeService.findOne(input.id)
  }

  @Patch(':id')
  @ApiOperation({ operationId: 'updateProduct', summary: '更新产品' })
  @ApiOkResponse({ type: Assistant })
  update(@Param() { id }: UUIDInput, @Body() input: UpdateActiveCodeInput) {
    return this.activeCodeService.update(id, input)
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'removeProduct', summary: '删除产品' })
  remove(@Param() { id }: UUIDInput) {
    return this.activeCodeService.remove(id)
  }
}

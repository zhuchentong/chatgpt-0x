import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger'
import { KeyInput } from 'src/common/typeorm/dto/key.input'
import { Public } from 'src/decorators/public.decorator'
import { KeyService } from '../services/key.service'
import { OpenAIKey } from 'src/entities/openai-key.entity'
import { OpenAIKeyState } from 'src/config/enum.config'

@ApiTags('key')
@Controller('key')
@ApiSecurity('access-token')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @ApiOperation({ operationId: 'getOpenAIKeys', description: '获取OpenAIKeys' })
  @Get()
  @ApiOkResponse({ type: OpenAIKey, isArray: true })
  async getOpenAIKeys() {
    return this.keyService.findAll()
  }

  @ApiOperation({
    operationId: 'createKey',
    description: '创建OpenAIKey',
  })
  @Post()
  async createKey(@Body() { key }: KeyInput) {
    return this.keyService.create(key)
  }

  @ApiOperation({
    operationId: 'updateKey',
    description: '更新OpenAIKey',
  })
  @Patch(':key')
  async updateKey(@Param() { key }: KeyInput) {
    // return this.openAIService.createKey(key)
  }

  @ApiOperation({
    operationId: 'removeKey',
    description: '删除OpenAIKey',
  })
  @Delete(':key')
  async removeKey(@Param() { key }: KeyInput) {
    return this.keyService.remove(key)
  }

  @ApiOperation({
    operationId: 'syncBalances',
    description: '同步Keys余额',
  })
  @Get('sync-balances')
  async syncKeysBalance() {
    return this.keyService.syncBalances()
  }
}

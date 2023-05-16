import { Controller, Get, Post, Query } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { User } from 'src/entities/user.entity'
import { FindUserInput } from '../dtos/user.dto'
import { UserService } from '../services/user.service'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'
import { UserStaticial } from '../responses/user.response'

@Controller('user')
@ApiTags('user')
@ApiSecurity('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ operationId: 'findUsers', summary: '查找用户列表' })
  @ApiOkResponse({ type: toPageResponse(User) })
  findAll(@Query() input: FindUserInput) {
    return this.userService.findAll(input.params)
  }

  @Get('user-staticial')
  @ApiOperation({
    operationId: 'getUserStaticial',
    summary: '获取用户统计信息',
  })
  @ApiOkResponse({ type: UserStaticial })
  getUserStaticial() {
    return this.userService.getUserStaticial()
  }
}

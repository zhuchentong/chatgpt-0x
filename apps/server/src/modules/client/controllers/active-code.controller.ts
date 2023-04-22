import { Controller, Get, Query } from '@nestjs/common'
import { ActiveCodeService } from '../services/active-code.service'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { KeyInput } from 'src/common/typeorm/dto/key.input'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'

@Controller('active-code')
@ApiTags('active-code')
@ApiSecurity('access-token')
export class ActiveCodeController {
  constructor(private readonly activeCodeService: ActiveCodeService) {}

  @Get('use-active-code')
  @ApiOperation({ operationId: 'useActiveCode', summary: '使用激活码' })
  useActiveCode(@RequestUser() user: User, @Query() { key }: KeyInput) {
    return this.activeCodeService.useActiveCode(key, user)
  }
}

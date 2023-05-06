import { Controller, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { Invite } from 'src/entities/invite.entity'
import { InviteService } from '../services/invite.service'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'

@Controller('invite')
@ApiTags('invite')
@ApiSecurity('access-token')
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get()
  @ApiOperation({ operationId: 'getInvites', summary: '获取邀请记录列表' })
  @ApiOkResponse({ type: Invite, isArray: true })
  getAll(@RequestUser() user: User) {
    return this.inviteService.getAll(user)
  }
}

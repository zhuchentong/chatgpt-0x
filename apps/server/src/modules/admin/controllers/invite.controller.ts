import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { InviteService } from '../services/invite.service'
import { Invite } from 'src/entities/invite.entity'
import { toPageResponse } from 'src/common/typeorm/responses/page.response'
import { FindInviteInput } from '../dtos/invite.dto'

@Controller('invite')
@ApiTags('invite')
@ApiSecurity('access-token')
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get()
  @ApiOperation({ operationId: 'findInvites', summary: '查找邀请记录列表' })
  @ApiOkResponse({ type: toPageResponse(Invite) })
  findAll(@Query() input: FindInviteInput) {
    return this.inviteService.findAll(input.params)
  }
}

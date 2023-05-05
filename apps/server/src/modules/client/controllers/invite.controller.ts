import { Controller } from '@nestjs/common'
import { ApiTags, ApiSecurity } from '@nestjs/swagger'

@Controller('invite')
@ApiTags('invite')
@ApiSecurity('access-token')
export class InviteController {}

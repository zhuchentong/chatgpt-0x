import { Controller } from '@nestjs/common'
import { ApiTags, ApiSecurity } from '@nestjs/swagger'

@Controller('balance')
@ApiTags('balance')
@ApiSecurity('access-token')
export class BalanceController {}

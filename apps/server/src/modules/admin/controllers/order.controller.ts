import { Controller } from '@nestjs/common'
import { ApiTags, ApiSecurity } from '@nestjs/swagger'

@Controller('order')
@ApiTags('order')
@ApiSecurity('access-token')
export class OrderController {}

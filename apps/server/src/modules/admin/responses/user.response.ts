import { ApiProperty } from '@nestjs/swagger'

export class UserStaticial {
  @ApiProperty({ description: 'dayUsersCount' })
  dayUsersCount: number
  @ApiProperty({ description: 'weekUsersCount' })
  weekUsersCount: number
  @ApiProperty({ description: 'totalUsersCount' })
  totalUsersCount: number
}

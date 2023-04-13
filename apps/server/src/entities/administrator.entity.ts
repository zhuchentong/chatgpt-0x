import { Entity, Column } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('administrator')
export class Administrator extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户名' })
  @Column({ unique: true })
  username: string

  @ApiProperty({ description: '姓名' })
  @Column({ nullable: true })
  realname: string

  @Column()
  password: string
}

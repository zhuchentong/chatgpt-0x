import { Entity, Column } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('user')
export class Assistant extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户头像' })
  @Column({ nullable: true })
  avatar: string

  @ApiProperty({ description: '助手名称' })
  @Column({ nullable: true })
  name: string

  @ApiProperty({ description: 'Prompt' })
  @Column({ nullable: true })
  prompt: string
}

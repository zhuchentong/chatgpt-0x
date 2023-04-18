import { Entity, Column, Generated } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('assistant')
export class Assistant extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户头像' })
  @Column({ nullable: true })
  avatar: string

  @ApiProperty({ description: '助手名称' })
  @Column({ nullable: true, unique: true })
  name: string

  @ApiProperty({ description: 'Prompt' })
  @Column({ nullable: true })
  prompt: string

  @ApiProperty({ description: 'placeholder' })
  @Column({ nullable: true })
  placeholder: string

  @ApiProperty({ description: '前置提问' })
  @Column({ nullable: true })
  foreword: string

  @Column()
  @ApiProperty({ description: 'Code' })
  @Generated('increment')
  code: number
}

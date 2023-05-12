import { Entity, Column, PrimaryColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { OpenAIKeyState } from 'src/config/enum.config'
import { Type } from 'class-transformer'

@Entity('openai_key')
export class OpenAIKey extends pipe(
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: 'Key' })
  @PrimaryColumn()
  key: string

  @ApiProperty({ description: '总额度' })
  @Column()
  limit: number

  @ApiProperty({ description: '使用量', type: 'number' })
  @Column({ type: 'float8', nullable: true })
  usage: number

  @ApiProperty({ description: '调用次数' })
  @Column({ default: 0 })
  count: number

  @Type(() => Date)
  @ApiProperty({ description: '到期时间' })
  @Column({ name: 'expire_at' })
  expireAt: Date

  @ApiProperty({ description: '异常总数' })
  @Column({ name: 'exception_total', default: 0, nullable: true })
  exceptionTotal: number

  @ApiProperty({ description: '异常次数' })
  @Column({ name: 'exception_times', default: 0, nullable: true })
  exceptionTimes: number

  @ApiProperty({ description: '状态' })
  @Column({ enum: OpenAIKeyState, default: OpenAIKeyState.Valid })
  state: OpenAIKeyState
}

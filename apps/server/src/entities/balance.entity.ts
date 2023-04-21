import { Entity, Column, ManyToOne } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { BalanceOrigin, ProductType } from 'src/config/enum.config'
import { ActiveCode } from './active-code.entity'

@Entity('balance')
export class Balance extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '余额来源' })
  @Column({ enum: BalanceOrigin })
  origin: BalanceOrigin

  @ApiProperty({ description: '余额类型' })
  @Column({ enum: ProductType })
  type: ProductType

  @ApiProperty({ description: '激活码' })
  @ManyToOne(() => ActiveCode, (activeCode) => activeCode.balances, {
    nullable: true,
  })
  code: ActiveCode

  @ApiProperty({ description: '初始次数' })
  @Column({
    default: 0,
    name: 'start_count',
  })
  startCount: number

  @ApiProperty({ description: '当前次数' })
  @Column({
    name: 'current_count',
    default: 0,
  })
  currentCount: number

  @ApiProperty({ description: '开始时间' })
  @Column({
    nullable: true,
    name: 'start_time',
    type: 'timestamp without time zone',
  })
  startTime: number

  @ApiProperty({ description: '结束时间' })
  @Column({
    nullable: true,
    name: 'end_time',
    type: 'timestamp without time zone',
  })
  endTime: number
}

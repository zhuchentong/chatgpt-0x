import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { BalanceOrigin, CycleType, ProductType } from 'src/config/enum.config'
import { ActiveCode } from './active-code.entity'
import { Order } from './order.entity'
import { User } from './user.entity'
import { Type } from 'class-transformer'

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
  @ManyToOne(() => ActiveCode, {
    nullable: true,
  })
  @JoinColumn({ name: 'code' })
  code: ActiveCode

  @ApiProperty({ description: '订单' })
  @OneToOne(() => Order, {
    nullable: true,
  })
  @JoinColumn({ name: 'order_id' })
  order: Order

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

  @Type(() => Date)
  @ApiProperty({ description: '开始时间' })
  @Column({
    nullable: true,
    name: 'start_time',
    type: 'timestamp without time zone',
  })
  startTime: Date

  @Type(() => Date)
  @ApiProperty({ description: '结束时间' })
  @Column({
    nullable: true,
    name: 'end_time',
    type: 'timestamp without time zone',
  })
  endTime: Date

  @ApiProperty({ description: '周期类型', enum: CycleType })
  @Column({ enum: CycleType, name: 'cycle_type', nullable: true })
  cycleType?: CycleType

  @Type(() => Date)
  @ApiProperty({ description: '下次重置周期' })
  @Column({
    nullable: true,
    name: 'next_cycle_time',
  })
  nextCycleTime?: Date

  @ApiProperty({ description: '用户', type: () => User })
  @ManyToOne(() => User, (user) => user.balances)
  @JoinColumn({ name: 'user_id' })
  user: User
}

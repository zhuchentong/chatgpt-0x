import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithTime,
  EntityClass,
  EntityWithDelete,
  EntityWithNanoID,
} from 'src/common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithCreator } from 'src/common/typeorm/entity/entity-with-creator'
import { RefundChannel, RefundState } from 'src/config/enum.config'
import { User } from './user.entity'
import { Order } from './order.entity'

@Entity('refund')
export class Refund extends pipe(
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
)(EntityClass) {
  @ApiProperty({ description: '退款ID', type: 'string' })
  @PrimaryColumn({ type: 'char', length: 24 })
  id: string

  @ApiProperty({ description: '退款状态', enum: RefundState })
  @Column({ enum: RefundState, nullable: true })
  state: RefundState

  @ApiProperty({ description: '退款渠道', enum: RefundChannel })
  @Column({ enum: RefundChannel, nullable: true })
  channel: RefundChannel

  @ApiProperty({ description: '收款帐号' })
  @Column({ nullable: true, name: 'received_account' })
  receivedAccount: string

  @ApiProperty({ description: '退款金额' })
  @Column()
  amount: number

  @ApiProperty({ description: '订单', type: () => Order })
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ApiProperty({ description: '用户', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({
    name: 'wx_refund_id',
    nullable: true,
  })
  @ApiProperty({ description: '微信退款交易号' })
  public wxRefundId: string

  @Column({
    name: 'refund_time',
    type: 'timestamp without time zone',
    nullable: true,
  })
  @ApiProperty({ description: '退款成功时间', type: 'string' })
  public refundTime: Date
}

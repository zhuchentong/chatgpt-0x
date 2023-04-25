import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithTime,
  EntityClass,
  EntityWithDelete,
  EntityWithUUID,
  EntityWithNanoID,
} from 'src/common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithCreator } from 'src/common/typeorm/entity/entity-with-creator'
import { EntityWithOperator } from 'src/common/typeorm/entity/entity-with-operator'
import { OrderState } from 'src/config/enum.config'
import { Product } from './product.entity'
import { User } from './user.entity'

@Entity('order')
export class Order extends pipe(
  EntityWithNanoID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
)(EntityClass) {
  @ApiProperty({ description: '订单状态', enum: OrderState })
  @Column({ enum: OrderState })
  state: OrderState

  @ApiProperty({ description: '订单金额' })
  @Column()
  price: number

  @ApiProperty({ description: '产品' })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @ApiProperty({ description: '用户', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({
    name: 'transaction_id',
    nullable: true,
  })
  @ApiProperty({ description: '微信支付交易号' })
  public transactionId: string

  @Column({
    name: 'paid_time',
    type: 'timestamp without time zone',
    nullable: true,
  })
  @ApiProperty({ description: '支付时间', type: 'string' })
  public paidTime: Date
}

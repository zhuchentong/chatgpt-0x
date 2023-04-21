import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithTime,
  EntityClass,
  EntityWithDelete,
  EntityWithUUID,
} from 'src/common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithCreator } from 'src/common/typeorm/entity/entity-with-creator'
import { EntityWithOperator } from 'src/common/typeorm/entity/entity-with-operator'
import { OrderState } from 'src/config/enum.config'
import { Product } from './product.entity'
import { User } from './user.entity'

@Entity('order')
export class Order extends pipe(
  EntityWithUUID,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '订单状态', enum: OrderState })
  @Column({ enum: OrderState })
  state: OrderState

  @ApiProperty({ description: '订单金额' })
  @Column()
  price: number

  @ApiProperty({ description: '产品' })
  @ManyToOne(() => Product)
  product: Product

  @ApiProperty({ description: '用户' })
  @ManyToOne(() => User)
  user: User
}

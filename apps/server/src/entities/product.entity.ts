import { Entity, Column } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
  EntityWithDelete,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { EntityWithOperator } from 'src/common/typeorm/entity/entity-with-operator'
import { EntityWithCreator } from 'src/common/typeorm/entity/entity-with-creator'
import { ProductType } from 'src/config/enum.config'

@Entity('product')
export class Product extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '标题' })
  @Column()
  title: string

  @ApiProperty({ description: '类型' })
  @Column({ enum: ProductType })
  type: ProductType

  @ApiProperty({ description: '数值' })
  @Column()
  value: number

  @ApiProperty({ description: '价格' })
  @Column()
  price: number
}

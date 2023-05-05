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
import { CycleType, ProductType } from 'src/config/enum.config'
import { Type } from 'class-transformer'

@Entity('product')
export class Product extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
  EntityWithDelete,
  EntityWithCreator,
  EntityWithOperator,
)(EntityClass) {
  @ApiProperty({ description: '名称' })
  @Column()
  name: string

  @ApiProperty({ description: '描述' })
  @Column({ nullable: true })
  description: string

  @ApiProperty({ description: '类型' })
  @Column({ enum: ProductType })
  type: ProductType

  @ApiProperty({ description: '数值' })
  @Column()
  value: number

  @ApiProperty({ description: '周期类型', enum: CycleType })
  @Column({ enum: CycleType, name: 'cycle_type', nullable: true })
  cycleType?: CycleType

  @Type(() => Date)
  @ApiProperty({ description: '周期时长' })
  @Column({
    nullable: true,
    name: 'cycle_time',
  })
  cycleTime?: number

  @ApiProperty({ description: '价格' })
  @Column()
  price: number
}

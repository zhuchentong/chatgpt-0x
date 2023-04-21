import { Entity, Column, OneToMany, ManyToOne, BeforeInsert } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { Balance } from './balance.entity'
import { Product } from './product.entity'
import { customAlphabet } from 'nanoid'

@Entity('active_code')
export class ActiveCode extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '激活码' })
  @Column({ unique: true })
  code: string

  @ApiProperty({ description: '激活码' })
  @Column({
    name: 'start_time',
    type: 'timestamp without time zone',
    nullable: true,
  })
  startTime: Date

  @ApiProperty({ description: '激活码' })
  @Column({
    name: 'end_time',
    type: 'timestamp without time zone',
    nullable: true,
  })
  endTime: Date

  @ApiProperty({ description: '总量' })
  @Column({
    name: 'count',
  })
  count: string

  @ApiProperty({ description: '产品' })
  @ManyToOne(() => Product)
  product: Product

  @ApiProperty({ description: '总量' })
  @OneToMany(() => Balance, (balance) => balance.code)
  balances: Balance[]

  @BeforeInsert()
  generateCode() {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6)
    this.code = nanoid().toLocaleUpperCase()
  }
}

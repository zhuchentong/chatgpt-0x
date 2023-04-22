import { Entity, Column, BeforeInsert, OneToMany, PrimaryColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { customAlphabet } from 'nanoid'
import { ProductType } from 'src/config/enum.config'
import { Balance } from './balance.entity'

@Entity('active_code')
export class ActiveCode extends pipe(
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '激活码' })
  @PrimaryColumn()
  key: string

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
  count: number

  @ApiProperty({ description: '兑换类型' })
  @Column({ enum: ProductType })
  type: ProductType

  @ApiProperty({ description: '兑换数值' })
  @Column()
  value: number

  @ApiProperty({ description: '备注' })
  @Column({ nullable: true })
  remark: string

  @ApiProperty({ description: '使用记录' })
  @OneToMany(() => Balance, (balance) => balance.code)
  balances: Balance[]

  @BeforeInsert()
  generateCode() {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6)
    this.key = nanoid().toLocaleUpperCase()
  }
}

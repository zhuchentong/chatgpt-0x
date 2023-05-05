import { Entity, Column, BeforeInsert, OneToMany, PrimaryColumn } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { customAlphabet } from 'nanoid'
import { ProductType } from 'src/config/enum.config'
import { Type } from 'class-transformer'

@Entity('active_code')
export class ActiveCode extends pipe(
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '激活码' })
  @PrimaryColumn()
  key: string

  @Type(() => Date)
  @ApiProperty({ description: '激活码' })
  @Column({
    name: 'start_time',
    type: 'timestamp without time zone',
    nullable: true,
  })
  startTime: Date

  @Type(() => Date)
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

  @ApiProperty({ description: '兑换数' })
  @Column({ default: 0 })
  used: number

  @BeforeInsert()
  generateCode() {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6)
    this.key = nanoid().toLocaleUpperCase()
  }
}

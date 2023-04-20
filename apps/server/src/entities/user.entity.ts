import { Entity, Column, OneToMany } from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithEnable,
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { Order } from './order.entity'

@Entity('user')
export class User extends pipe(
  EntityWithUUID,
  EntityWithEnable,
  EntityWithTime,
)(EntityClass) {
  @ApiProperty({ description: '用户邮箱' })
  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  password?: string

  @ApiProperty({ description: '用户昵称' })
  @Column({ nullable: true })
  nickname: string

  @ApiProperty({ description: 'OPENID' })
  @Column({ nullable: true })
  openid: string

  @ApiProperty({ description: 'UNIONID' })
  @Column({ nullable: true })
  unionid: string

  @ApiProperty({ description: '手机号码' })
  @Column({ nullable: true })
  mobile: string

  @ApiProperty({ description: '用户头像' })
  @Column({ nullable: true })
  avatar: string
}

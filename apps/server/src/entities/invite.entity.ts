import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm'
import { pipe } from 'ramda'
import {
  EntityWithTime,
  EntityClass,
  EntityWithUUID,
} from '../common/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.entity'
import { Balance } from './balance.entity'
import { Type } from 'class-transformer'

@Entity('invite')
export class Invite extends pipe(EntityWithUUID, EntityWithTime)(EntityClass) {
  @ApiProperty({ description: '接受邀请人', type: () => User })
  @OneToOne(() => User)
  @JoinColumn({ name: 'invitee_id' })
  invitee: User

  @ApiProperty({ description: '发出邀请人', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviter_id' })
  inviter: User

  @Type(() => Balance)
  @ApiProperty({ description: '接受邀请奖励' })
  @OneToOne(() => Balance)
  @JoinColumn({ name: 'invitee_reward_id' })
  inviteeReward: Balance

  @Type(() => Balance)
  @ApiProperty({ description: '发出邀请奖励' })
  @OneToOne(() => Balance)
  @JoinColumn({ name: 'inviter_reward_id' })
  inviterReward: Balance
}

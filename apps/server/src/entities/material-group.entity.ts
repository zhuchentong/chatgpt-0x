import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { pipe } from 'ramda'
import { EntityClass, EntityWithUUID } from '../shared/typeorm/entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity('material-group')
export class MaterialGroup extends pipe(EntityWithUUID)(EntityClass) {
  @ApiProperty({ description: '素材分组名称' })
  @Column()
  name: string
}

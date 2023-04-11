import { ApiProperty } from '@nestjs/swagger'
import { DeleteDateColumn } from 'typeorm'
import { Constructor } from '.'

/**
 * 基础实体类型
 * 默认添加deletedAt字段 *
 * @param Base
 * @returns
 */
export function EntityWithDelete<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @ApiProperty({ description: '删除时间', type: 'string' })
    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'timestamp without time zone',
    })
    public deletedAt: Date
  }
  return AbstractBase
}

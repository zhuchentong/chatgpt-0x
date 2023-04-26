import { OrderMode } from 'src/config/enum.config'
import { Brackets, FindOptionsWhere } from 'typeorm'
import { QueryInput } from './query/inputs/query.input'
import { CursorParams } from './query/params/cursor-params'
import { PageParams } from './query/params/page-params'

export interface QueryInputParam<T = any> {
  order?: Record<string, OrderMode>
  page?: PageParams
  cursor?: CursorParams
  buildWhereQuery: () => Brackets
  buildWhereParams: () => FindOptionsWhere<T>
}

export type Constructor<T = QueryInput> = new (...args: any[]) => T

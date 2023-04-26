import { pipe } from 'rxjs'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { Balance } from 'src/entities/balance.entity'

export class FindBalanceInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Balance>) {}

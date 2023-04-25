import { pipe } from 'rxjs'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { User } from 'src/entities/user.entity'

export class FindUserInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<User>) {}

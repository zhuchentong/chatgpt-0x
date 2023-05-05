import { pipe } from 'rxjs'
import { OrderInput } from 'src/common/typeorm/query/inputs/order.input'
import { PageInput } from 'src/common/typeorm/query/inputs/page.input'
import { QueryInput } from 'src/common/typeorm/query/inputs/query.input'
import { Invite } from 'src/entities/invite.entity'

export class FindInviteInput extends pipe(
  PageInput,
  OrderInput,
)(QueryInput<Invite>) {}

import type {
  AdapterResponse,
  RequestPlugin,
  RequestSendOptions,
} from '@gopowerteam/request'
import type { PaginationOptions } from '@gopowerteam/vue-dynamic-table'

export class PageService implements RequestPlugin, PaginationOptions {
  data = reactive({
    index: 1,
    size: 20,
    total: 0,
  })

  get pageIndex() {
    return this.data.index
  }

  set pageIndex(value: number) {
    this.data.index = value
  }

  get pageSize() {
    return this.data.size
  }

  set pageSize(value: number) {
    this.data.size = value
  }

  get total() {
    return this.data.total
  }

  set total(value: number) {
    this.data.total = value
  }

  pageSizeOpts: number[] = [10, 20, 30, 40, 50]
  pageLayouts: (
    | 'PrevJump'
    | 'PrevPage'
    | 'JumpNumber'
    | 'NextPage'
    | 'NextJump'
    | 'Sizes'
    | 'FullJump'
    | 'Total'
  )[] = [
    'PrevJump',
    'PrevPage',
    'JumpNumber',
    'NextPage',
    'NextJump',
    'Sizes',
    'FullJump',
    'Total',
  ]

  constructor(index = 1, size = 20) {
    this.pageIndex = index
    this.pageSize = size
  }

  reset(): void {
    this.pageIndex = 1
  }

  before(options: RequestSendOptions) {
    options.paramsQuery = {
      ...options.paramsQuery,
      page: this.pageIndex - 1,
      size: this.pageSize,
    }
  }

  after(response: AdapterResponse, _options: RequestSendOptions) {
    this.total = response.data?.total
  }
}

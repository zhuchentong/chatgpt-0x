<template>
  <PageContainer title="退款记录">
    <DataTable
      ref="table"
      action-align="right"
      :columns="columns"
      :load-data="loadData"
      :pagination="pageService"
      row-key="username"
      :search-forms="searchForms"></DataTable>
  </PageContainer>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import {
  type FormItemsOptions,
  type LoadDataParams,
  type TableColumnsOptions,
  useTable,
} from '@gopowerteam/vue-dynamic-table'
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { PageService } from '@/http/extends/page.service'
import { RefundChannelDict, RefundStateDict } from '@/config/dict.config'
import type { Refund } from '@/http/models/Refund'

dayjs.extend(minMax)
const pageService = new PageService()
const table = $(useTable('table'))

const refundService = useRequest((service) => service.RefundService)

function loadData({ search, update }: LoadDataParams) {
  refundService.findRefunds(search, [pageService]).then(({ data }) => {
    update(data)
  })
}

const searchForms: FormItemsOptions = [
  {
    key: 'userId',
    title: '用户ID',
    render: (r) => r.input(),
  },
  {
    key: 'orderId',
    title: '订单ID',
    render: (r) => r.input(),
  },
  {
    key: 'refundState',
    title: '退款状态',
    render: (r) => r.select({ options: RefundStateDict, clearable: true }),
  },
]

const columns: TableColumnsOptions<Refund> = [
  {
    key: 'user.id',
    title: '用户ID',
    width: '200px',
    align: 'left',
  },
  {
    key: 'order.id',
    title: '订单ID',
    width: '200px',
    align: 'left',
  },
  {
    key: 'amount',
    title: '退款金额',
    render: (r) =>
      r.text({ text: (record) => `${(record.amount / 100).toFixed(2)}元` }),
  },
  {
    key: 'state',
    title: '退款状态',
    render: (r) => r.dict({ dict: RefundStateDict }),
  },
  {
    key: 'channel',
    title: '退款渠道',
    render: (r) => r.dict({ dict: RefundChannelDict }),
  },
  {
    key: 'refundTime',
    title: '退款时间',
    render: (r) => r.date(),
  },
  {
    key: 'wxRefundId',
    title: '退款交易号',
  },
  {
    key: 'createdAt',
    title: '创建时间',
    render: (r) => r.date(),
  },
]
</script>

<route lang="yaml">
name: refunds
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: refunds
    title: 退款记录
</route>

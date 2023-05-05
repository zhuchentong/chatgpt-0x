<template>
  <PageContainer title="余额管理">
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
import { Message } from '@arco-design/web-vue'
import { PageService } from '@/http/extends/page.service'
import {
  OrderStateDict,
  ProductTypeDict,
  ProductUnitDict,
} from '@/config/dict.config'
import type { Order } from '@/http/models/Order'
import { OrderState } from '@/config/enum.config'

dayjs.extend(minMax)
const pageService = new PageService()
const table = $(useTable('table'))

const [orderService, refundService] = useRequest(
  (service) => service.OrderService,
  (service) => service.RefundService,
)

function loadData({ search, update }: LoadDataParams) {
  orderService.findOrders(search, [pageService]).then(({ data }) => {
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
    key: 'productName',
    title: '产品名称',
    render: (r) => r.input(),
  },
  {
    key: 'productType',
    title: '产品类型',
    render: (r) => r.select({ options: ProductTypeDict, clearable: true }),
  },
  {
    key: 'state',
    title: '订单状态',
    render: (r) => r.select({ options: OrderStateDict, clearable: true }),
  },
]

const columns: TableColumnsOptions<Order> = [
  {
    key: 'user.id',
    title: '用户ID',
    width: '200px',
    align: 'left',
  },
  {
    key: 'amount',
    title: '订单金额',
    render: (r) =>
      r.text({ text: (record) => `${(record.amount / 100).toFixed(2)}元` }),
  },
  {
    key: 'product.name',
    title: '产品名称',
  },
  {
    key: 'product.type',
    title: '产品类型',
    render: (r) => r.dict({ dict: ProductTypeDict }),
  },
  {
    key: 'product.value',
    title: '产品额度',
    render: (r) =>
      r.text({
        text: (record) =>
          `${record.product.value}${ProductUnitDict.get(record.product.type)}`,
      }),
  },
  {
    key: 'state',
    title: '支付状态',
    render: (r) => r.dict({ dict: OrderStateDict }),
  },
  {
    key: 'paidTime',
    title: '支付时间',
    render: (r) => r.date(),
  },
  {
    key: 'transactionId',
    title: '交易号',
  },
  {
    key: 'createdAt',
    title: '创建时间',
    render: (r) => r.date(),
  },
  {
    key: 'action',
    title: '操作',
    render: (r) =>
      r.button({
        text: '退款',
        confirm: true,
        show: (record) => record.state === OrderState.Paid,
        confirmText: '是否确认进行退款操作？',
        callback: (record) => {
          refundService.submitRefund({ orderId: record.id }).then(() => {
            table.reload()
            Message.success('提交退款成功,请稍候在退款记录页面查看')
          })
        },
      }),
  },
]
</script>

<route lang="yaml">
name: orders
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: orders
    title: 订单管理
</route>

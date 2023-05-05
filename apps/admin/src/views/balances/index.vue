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
import { PageService } from '@/http/extends/page.service'
import { BalanceOriginDict, ProductTypeDict } from '@/config/dict.config'
import type { Balance } from '@/http/models/Balance'
import { ProductType } from '@/config/enum.config'

dayjs.extend(minMax)
const pageService = new PageService()
const table = $(useTable('table'))

const balanceService = useRequest((service) => service.BalanceService)

function loadData({ search, update }: LoadDataParams) {
  balanceService.findBalances(search, [pageService]).then(({ data }) => {
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
    key: 'origin',
    title: '余额来源',
    render: (r) => r.select({ options: BalanceOriginDict, clearable: true }),
  },
  {
    key: 'type',
    title: '余额类型',
    render: (r) => r.select({ options: ProductTypeDict, clearable: true }),
  },
]

const columns: TableColumnsOptions<Balance> = [
  {
    key: 'user.id',
    title: '用户ID',
    width: '200px',
    align: 'left',
  },
  {
    key: 'origin',
    title: '来源',
    render: (r) => r.dict({ dict: BalanceOriginDict }),
  },
  {
    key: 'type',
    title: '类型',
    render: (r) => r.dict({ dict: ProductTypeDict }),
  },
  {
    key: 'startCount',
    title: '初始额度',
  },
  {
    key: 'currentCount',
    title: '当前额度',
  },
  {
    key: 'startDate',
    title: '开始时间',
  },
  {
    key: 'endDate',
    title: '结束时间',
  },
  {
    key: 'enable',
    title: '状态',
    render: (r) =>
      r.text({
        text: (record) => {
          const getState = () => {
            switch (record.type) {
              case ProductType.Count:
                return record.startCount >= record.currentCount
              case ProductType.Time:
                return dayjs().isAfter(record.endTime)
              case ProductType.Cycle:
                return dayjs().isAfter(record.endTime)
            }
          }

          return getState() ? '可用' : '不可用'
        },
      }),
  },
  {
    key: 'createdAt',
    title: '创建时间',
    render: (r) => r.date(),
  },
]
</script>

<route lang="yaml">
name: balances
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: balances
    title: 余额管理
</route>

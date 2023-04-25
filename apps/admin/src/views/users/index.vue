<template>
  <PageContainer title="用户管理">
    <template #action>
      <ASpace>
        <AButton type="primary">创建</AButton>
      </ASpace>
    </template>
    <DataTable
      ref="table"
      action-align="right"
      :columns="columns"
      :load-data="loadData"
      :pagination="pageService"
      row-key="username"></DataTable>
  </PageContainer>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import {
  type LoadDataParams,
  type TableColumnsOptions,
  useTable,
} from '@gopowerteam/vue-dynamic-table'
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { PageService } from '@/http/extends/page.service'
import { EnableStateDict } from '@/config/dict.config'
import type { User } from '@/http/models/User'
import { ProductType } from '@/config/enum.config'

dayjs.extend(minMax)
const pageService = new PageService()
const table = $(useTable('table'))

const [productService, userService] = useRequest(
  (service) => service.ProductService,
  (service) => service.UserService,
)

function loadData({ update }: LoadDataParams) {
  userService.findUsers([pageService]).then(({ data }) => {
    update(data)
  })
}

const columns: TableColumnsOptions<User> = [
  {
    key: 'id',
    title: 'ID',
  },
  {
    key: 'email',
    title: '邮箱',
  },
  {
    key: 'mobile',
    title: '手机号',
  },
  {
    key: 'openid',
    title: 'openid',
  },
  {
    key: 'balanceCount',
    title: '次数余额',
    render: (r) =>
      r.text({
        text: (record) =>
          `${record.balances
            .filter((x) => x.type === ProductType.Count)
            .reduce((r, v) => (r += v.currentCount), 0)
            .toString()}`,
      }),
  },
  {
    key: 'balanceTime',
    title: '时间余额',
    render: (r) =>
      r.text({
        text: (record) => {
          const endTime = dayjs.max(
            record.balances
              .filter((x) => x.type === ProductType.Time)
              .map((x) => dayjs(x.endTime)),
          )

          if (endTime) {
            return endTime.diff(dayjs()).toString()
          } else {
            return '0'
          }
        },
      }),
  },
  {
    key: 'enable',
    title: '状态',
    render: (r) =>
      r.dict({
        dict: EnableStateDict,
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
name: users
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: users
    title: 用户管理
</route>

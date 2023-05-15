<template>
  <div class="user-orders">
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="balances"
      :max-height="500">
      <template #empty>
        <n-empty
          description="还没有可用余额哦"
          size="large"></n-empty>
      </template>
    </n-data-table>
  </div>
</template>

<style lang="less">
.price {
  font-size: 16px;
  &::before {
    content: '¥';
    padding-right: 5px;
  }
}
</style>

<script setup lang="tsx">
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import type { TableColumn } from 'naive-ui/es/data-table/src/interface'
import { useStore } from '@/store'
import type { Balance } from '@/http/models/Balance'
import { BalanceOriginDict } from '@/config/dict.config'

defineEmits(['close'])
dayjs.extend(minMax)
const store = useStore()

const balanceService = useRequest((service) => service.BalanceService)

let balances = $ref<Balance[]>([])

const columns: TableColumn<Balance>[] = [
  {
    title: '余额来源',
    align: 'center',
    key: 'origin',
    render: (record) => BalanceOriginDict.get(record.origin),
  },
  {
    title: '初始次数',
    align: 'center',
    key: 'startCount',
  },
  {
    title: '剩余次数',
    align: 'center',
    key: 'currentCount',
  },
  {
    title: '有效期',
    align: 'center',
    key: 'endTime',
    render: (record) =>
      record.startTime
        ? dayjs(record.startTime).format('YYYY-MM-DD')
        : '无限制',
  },
]

async function getUserOrders() {
  await balanceService.getUserBalances().then((data) => {
    balances = data
  })
}

onBeforeMount(() => {
  getUserOrders()
})
</script>

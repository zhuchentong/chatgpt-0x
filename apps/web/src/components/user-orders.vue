<template>
  <div class="user-orders">
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="orders"
      :max-height="500"
      :min-height="300">
      <template #empty>
        <n-empty
          description="还没有订单哦"
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
import type { Order } from '@/http/models/Order'

defineEmits(['close'])
dayjs.extend(minMax)
const store = useStore()

const orderService = useRequest((service) => service.OrderService)

let orders = $ref<Order[]>([])

const columns: TableColumn<Order>[] = [
  {
    title: '套餐名称',
    align: 'center',
    width: 120,
    key: 'product.name',
  },
  {
    title: '金额',
    key: 'product.price',
    align: 'center',
    width: 100,
    render: (record) => `${record.product.price.toFixed(2)} 元`,
  },
  {
    title: '订单时间',
    align: 'center',
    key: 'createdAt',
    width: 200,
    render: (record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
]

async function getUserOrders() {
  await orderService.getUserOrders().then((data) => {
    orders = data
  })
}

onBeforeMount(() => {
  getUserOrders()
})
</script>

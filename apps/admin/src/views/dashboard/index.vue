<template>
  <PageContainer>
    <ACard
      v-if="userStatics"
      title="用户数据">
      <div class="flex justify-around">
        <AStatistic
          title="今日注册数"
          :value="userStatics.dayUsersCount"></AStatistic>
        <ADivider direction="vertical"></ADivider>
        <AStatistic
          title="本周注册数"
          :value="userStatics.weekUsersCount"></AStatistic>
        <ADivider direction="vertical"></ADivider>
        <AStatistic
          title="总注册数"
          :value="userStatics.totalUsersCount"></AStatistic>
      </div>
    </ACard>
    <ACard
      v-if="orderStatics"
      title="订单数据">
      <div class="flex justify-around">
        <AStatistic
          title="今日订单数"
          :value="orderStatics.dayOrdersCount"></AStatistic>
        <AStatistic
          :precision="2"
          show-group-separator
          title="今日订单金额"
          :value="orderStatics.dayOrdersAmount / 100">
          <template #suffix>元</template>
        </AStatistic>
        <ADivider direction="vertical"></ADivider>
        <AStatistic
          title="本周订单数"
          :value="orderStatics.weekOrdersCount"></AStatistic>
        <AStatistic
          :precision="2"
          show-group-separator
          title="本周订单金额"
          :value="orderStatics.weekOrdersAmount / 100">
          <template #suffix>元</template>
        </AStatistic>
        <ADivider direction="vertical"></ADivider>
        <AStatistic
          title="总订单数"
          :value="orderStatics.totalOrdersCount"></AStatistic>
        <AStatistic
          :precision="2"
          show-group-separator
          title="总订单金额"
          :value="orderStatics.totalOrdersAmount / 100">
          <template #suffix>元</template>
        </AStatistic>
      </div>
    </ACard>
  </PageContainer>
</template>

<script setup lang="ts">
import { useRequest } from 'virtual:request'
import type { OrderStaticial } from '@/http/models/OrderStaticial'
import type { UserStaticial } from '@/http/models/UserStaticial'

let orderStatics = $ref<OrderStaticial>()
let userStatics = $ref<UserStaticial>()

const orderService = useRequest((service) => service.OrderService)
const userService = useRequest((service) => service.UserService)

function requestOrderStatistics() {
  return orderService.getOrderStaticial().then((data) => {
    orderStatics = data
  })
}

function requestUserStatistics() {
  return userService.getUserStaticial().then((data) => {
    userStatics = data
  })
}

onMounted(() => {
  requestOrderStatistics()
  requestUserStatistics()
})
</script>

<route lang="yaml">
name: dashboard
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: dashboard
    title: 仪表盘
    index: 0
</route>

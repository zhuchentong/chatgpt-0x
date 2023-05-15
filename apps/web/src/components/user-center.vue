<template>
  <div class="user-center-container">
    <n-card
      closable
      :on-close="() => $emit('close')"
      title="个人中心">
      <template #header-extra>
        <div v-if="store.user?.current?.id">
          <span>ID:</span>
          <span>{{ store.user?.current?.id }}</span>
        </div>
      </template>
      <n-tabs
        v-model:value="currentTab"
        animated
        type="line">
        <n-tab-pane
          name="orders"
          tab="我的订单">
          <UserOrders></UserOrders>
        </n-tab-pane>
        <n-tab-pane
          name="balances"
          tab="我的余额">
          <UserBalances></UserBalances>
        </n-tab-pane>
        <n-tab-pane
          name="contacts"
          tab="联系我们">
          <div class="text-center">
            <img
              class="w-300px"
              :src="ContactImage" />
            <div class="mt-[-20px]">
              扫码加入
              <span class="font-bold">奥创20X</span>
              微信交流群
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style lang="less">
.user-center-container {
  width: v-bind(width);
}
</style>

<script setup lang="tsx">
import UserOrders from './user-orders.vue'
import UserBalances from './user-balances.vue'
import { useStore } from '@/store'
import ContactImage from '@/assets/image/contact.jpg'

const props = defineProps<{
  tab?: string
}>()

defineEmits(['close'])

const currentTab = $ref<string | undefined>(props.tab)

const store = useStore()
const width = computed(() => (store.app.desktop ? '50%' : '90%'))
</script>

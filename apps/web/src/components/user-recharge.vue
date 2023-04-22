<template>
  <div class="user-recharge-container">
    <n-card title="用户充值">
      <template #header-extra>
        <div class="flex w-full space-x-5 items-center">
          <div class="flex flex-auto text-center space-x-2 items-center">
            <icon-park-outline:dashboard></icon-park-outline:dashboard>
            <span>剩余次数:</span>
            <span>{{ balance.count }}</span>
          </div>
          <div class="flex-auto text-center space-x-2 flex items-center">
            <icon-park-outline:calendar></icon-park-outline:calendar>
            <span>剩余天数:</span>
            <span>{{ balance.time }}</span>
          </div>
        </div>
      </template>
      <n-form
        ref="form"
        label-placement="left"
        label-width="80px"
        :model="formModel"
        :rules="formRules"
        :show-require-mark="false">
        <n-form-item
          label="兑换码:"
          path="activeCode">
          <n-input-group>
            <n-input
              v-model:value="formModel.activeCode"
              :maxlength="10"
              :on-input="
                () =>
                  (formModel.activeCode = formModel.activeCode.toUpperCase())
              "
              placeholder="关注公众号或微信群不定时发放兑换码"></n-input>
            <n-button
              type="primary"
              @click="onUseAciveCode">
              兑换
            </n-button>
          </n-input-group>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<style lang="less">
.user-recharge-container {
  width: v-bind(width);
}
</style>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { useStore } from '@/store'
import { ProductType } from '@/config/enum.config'

const emits = defineEmits(['close'])
dayjs.extend(minMax)
const store = useStore()
const form = $(templateRef<FormInst>('form'))
const width = computed(() => (store.app.desktop ? '50%' : '90%'))

const activeCodeService = useRequest((service) => service.ActiveCodeService)
const balanceService = useRequest((service) => service.BalanceService)
const messageEventBus = useEventBus<{
  type: 'success' | 'error' | 'warning' | 'info'
  content: string
}>('message')

const formModel = reactive({
  activeCode: '',
})

const formRules = {
  activeCode: [
    {
      required: true,
      message: '请输入兑换码',
    },
  ],
}

const balance = reactive({
  time: 0,
  count: 0,
})

async function onUseAciveCode() {
  await form.validate()

  activeCodeService.useActiveCode({ key: formModel.activeCode }).then(() => {
    messageEventBus.emit({
      type: 'success',
      content: '兑换成功',
    })
    // 更新余额次数
    getUserBalance()
  })
}

async function getUserBalance() {
  const balances = await balanceService.getUserBalances()
  const countBalances = balances.filter(
    (balance) => balance.type === ProductType.Count,
  )
  const timeBalances = balances.filter(
    (balance) => balance.type === ProductType.Time,
  )

  if (countBalances && countBalances.length) {
    balance.count = countBalances.reduce(
      (prev, curr) => prev + curr.currentCount,
      0,
    )
  }

  if (timeBalances && timeBalances.length) {
    const latestDay = dayjs.max(
      balances
        .filter((balance) => balance.type === ProductType.Time)
        .map((balance) => dayjs(balance.endTime)),
    )

    balance.time = Math.ceil(latestDay.diff(dayjs(), 'hour') / 24)
  }
}

onMounted(() => {
  getUserBalance()
})
</script>

<template>
  <div class="user-payment-container">
    <n-card
      closable
      :on-close="() => $emit('close')"
      title="用户充值">
      <template #header-extra>
        <div
          v-if="store.app.desktop"
          class="flex w-full space-x-5 items-center mr-5">
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
      <div
        v-if="store.app.mobile"
        class="flex w-full space-x-5 items-center justify-around mb-5">
        <div class="flex text-center space-x-2 items-center">
          <icon-park-outline:dashboard></icon-park-outline:dashboard>
          <span>剩余次数:</span>
          <span>{{ balance.count }}</span>
        </div>
        <div class="text-center space-x-2 flex items-center">
          <icon-park-outline:calendar></icon-park-outline:calendar>
          <span>剩余天数:</span>
          <span>{{ balance.time }}</span>
        </div>
      </div>
      <div class="active-code-container">
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
      </div>
      <div
        v-if="products.length"
        class="payment-container">
        <n-grid
          :cols="store.app.desktop ? 2 : 1"
          :x-gap="12"
          :y-gap="12">
          <n-grid-item
            v-for="product in products"
            :key="product.id">
            <n-card>
              <div class="text-center space-y-2 p-5 rounded">
                <div class="font-bold">{{ product.name }}</div>
                <div
                  class="space-x-2 pb-5"
                  v-html="product.description"></div>
                <div class="space-x-2 pb-5">
                  <span class="price">
                    {{ (product.price / 100).toFixed(2) }}元
                  </span>
                </div>
                <n-button
                  type="primary"
                  @click="() => onSubmitOrder(product.id)">
                  立即订购
                </n-button>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
    </n-card>

    <n-modal
      v-model:show="showPayment"
      class="desktop:w-500px mobile:w-80% text-center"
      :mask-closable="false"
      preset="card">
      <div v-if="order">
        <div class="font-blod text-2xl">{{ order?.name }}</div>
        <div class="price pt-2">{{ order?.amount / 100 }}</div>
        <div class="qrcode-image text-center">
          <img
            class="w-50%"
            :src="order?.qrcode" />
        </div>
        <img
          src="/wechat-pay.png"
          style="height: 30px" />
      </div>
    </n-modal>
  </div>
</template>

<style lang="less">
.user-payment-container {
  width: v-bind(width);
}

.price {
  font-size: 16px;
  &::before {
    content: '¥';
    padding-right: 5px;
  }
}
</style>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { useStore } from '@/store'
import { OrderState, ProductType } from '@/config/enum.config'
import type { Product } from '@/http/models/Product'
import type { SubmitOrderResponse } from '@/http/models/SubmitOrderResponse'
import { WechatService } from '@/shared/utils/wechat.service'

defineEmits(['close'])

dayjs.extend(minMax)

const store = useStore()
const form = $(templateRef<FormInst>('form'))
const width = computed(() => (store.app.desktop ? '50%' : '90%'))

const orderService = useRequest((service) => service.OrderService)
const activeCodeService = useRequest((service) => service.ActiveCodeService)
const balanceService = useRequest((service) => service.BalanceService)
const productService = useRequest((service) => service.ProductService)
const messageEventBus = useEventBus<{
  type: 'success' | 'error' | 'warning' | 'info'
  content: string
}>('message')

let order = $ref<SubmitOrderResponse>()
let showPayment = $ref(false)
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

let products = $ref<Product[]>([])

const { pause: pauseQueryPayment, resume: startQueryPayment } = useIntervalFn(
  requestPaymentState,
  2000,
)

async function onUseAciveCode() {
  await form.validate()

  activeCodeService
    .useActiveCode({ key: formModel.activeCode.trim() })
    .then(() => {
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
    (balance) =>
      balance.type === ProductType.Count || balance.type === ProductType.Cycle,
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

function getProducts() {
  productService.getProducts().then((data) => {
    products = data
  })
}

function onSubmitOrder(productId: string) {
  if (store.app.isWechat) {
    orderService.submitWechatOrder({ productId }).then((response) => {
      const wechatService = new WechatService()
      wechatService.chooseWXPay({
        timestamp: parseInt(response.timeStamp.toString()), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: response.nonceStr, // 支付签名随机串，不长于 32 位
        package: response.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: response.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
        paySign: response.paySign, // 支付签名
        success(_res) {
          // 支付成功后的回调函数
          getUserBalance()
        },
      })
    })
  } else {
    orderService.submitOrder({ productId }).then((data) => {
      order = data
      showPayment = true
      startQueryPayment()
    })
  }
}

function requestPaymentState() {
  if (order) {
    orderService.queryPaymentState(order.orderId).then(({ state }) => {
      if (state === OrderState.Paid) {
        // 暂停轮训
        pauseQueryPayment()
        showPayment = false
        messageEventBus.emit({
          type: 'success',
          content: '支付成功',
        })
        // 更新余额次数
        getUserBalance()
      }
    })
  } else {
    pauseQueryPayment()
  }
}

onBeforeMount(() => {
  getUserBalance()
  getProducts()
})
</script>

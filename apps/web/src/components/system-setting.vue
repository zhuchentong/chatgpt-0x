<template>
  <n-card
    :bordered="false"
    segmented
    title="系统设置">
    <n-form ref="form">
      <!-- <n-form-item label="model">
      <n-select
        :value="store.OPENAI_MODEL"
        placeholder="选择Model"
        :options="models"
        @update:value="onChangeModel"
      />
    </n-form-item>
    <n-form-item label="Token Limit (0:不限制,最小1000)">
      <n-input-number
        :update-value-on-input="false"
        :show-button="false"
        :min="0"
        :value="store.tokenLimit"
        :on-update:value="onChangeLimit"
      >
        <template #suffix>
          <icon-park-outline:finance></icon-park-outline:finance>
        </template>
      </n-input-number>
    </n-form-item> -->
      <n-form-item label="主题">
        <n-select
          v-model:value="colorMode"
          :on-update:value="changeColorMode"
          :options="[
            { value: 'dark', label: '深色' },
            { value: 'light', label: '浅色' },
            { value: 'auto', label: '自动' },
          ]"></n-select>
      </n-form-item>
      <n-form-item label="关怀模式">
        <n-switch v-model:value="store.app.careMode.enable">
          <template #checked>开启</template>
          <template #unchecked>关闭</template>
        </n-switch>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<style lang="less"></style>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useStore } from '@/store'

const store = useStore()

const form = $(templateRef<FormInst>('form'))
const colorMode = useColorMode()

// const models = [
//   'gpt-3.5-turbo',
//   'gpt-3.5-turbo-0301',
//   'gpt-4',
//   'gpt-4-0314',
//   'gpt-4-32k',
// ].map((v) => ({
//   label: v,
//   value: v,
// }))

// function onChangeModel(value: string) {
//   store.chat.updateAPIMODEL(value)
// }

// function onChangeLimit(value: unknown) {
//   if (value == 0 || (value as number) >= 1000) {
//     store.chat.updateTokenLimit(value as number)
//   }
// }
function changeColorMode(value: 'dark' | 'light' | 'auto') {
  colorMode.value = value
}
</script>

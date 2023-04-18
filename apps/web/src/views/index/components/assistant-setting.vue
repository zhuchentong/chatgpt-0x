<template>
  <n-form
    ref="form"
    :model="formModel"
    :rules="formRules">
    <n-form-item
      label="助手名称"
      path="apikey">
      <n-input
        v-model:value="formModel.name"
        @keydown.enter.prevent />
    </n-form-item>
    <n-form-item
      label="Prompt"
      path="apiurl">
      <n-input
        v-model:value="formModel.prompt"
        readonly
        rows="10"
        type="textarea"
        @keydown.enter.prevent />
    </n-form-item>
    <n-form-item>
      <div class="w-full space-y-2">
        <n-button
          block
          type="primary"
          @click="onSubmit">
          确定
        </n-button>

        <n-popconfirm
          v-if="assistant.id !== 'default-assistant'"
          icon="warning"
          negative-text="取消"
          placement="bottom"
          positive-text="确定"
          @positive-click="onDelete">
          <template #trigger>
            <n-button
              block
              type="error">
              删除
            </n-button>
          </template>
          <div>确定删除小助理 {{ assistant.name }}</div>
        </n-popconfirm>
      </div>
    </n-form-item>
  </n-form>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { type FormInst, useMessage } from 'naive-ui'
import { useStore } from '@/store'

const message = useMessage()
const store = useStore()
const form = $(templateRef<FormInst>('form'))

const assistant = computed(() => store.chat.currentAssistant)

const formModel = reactive({
  name: assistant.value.name,
  prompt: assistant.value.prompt,
})

const formRules = {
  name: {
    required: true,
  },
}

function onSubmit() {
  form.validate((errors) => {
    if (errors) {
      return
    }

    assistant.value.name = formModel.name
    store.app.toggleAssistantSettingShow()
  })
}

function onDelete() {
  store.chat.deleteAssistant(assistant.value.id)
  store.app.toggleAssistantSettingShow()
}
</script>

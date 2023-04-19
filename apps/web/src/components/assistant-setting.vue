<template>
  <n-card
    :bordered="false"
    segmented
    title="助手设置">
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

          <n-button
            block
            type="error"
            @click="onDelete">
            删除
          </n-button>
        </div>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { type FormInst, useDialog } from 'naive-ui'
import { useStore } from '@/store'

const emits = defineEmits(['close'])

const dialog = useDialog()
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
  dialog.warning({
    title: '删除',
    content: '是否要删除当前助手?',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      store.chat.deleteAssistant(assistant.value.id)
      emits('close')
    },
  })
}
</script>

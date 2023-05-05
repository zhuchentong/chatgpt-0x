<template>
  <PageContainer title="助手管理">
    <template #action>
      <ASpace>
        <AButton
          type="primary"
          @click="onCreate">
          创建
        </AButton>
        <UploadContainer @upload="onImportAssistants">
          <AButton type="outline">导入</AButton>
        </UploadContainer>
      </ASpace>
    </template>
    <DataTable
      ref="table"
      action-align="right"
      :columns="columns"
      :edit-forms="editsForms"
      :load-data="loadData"
      :pagination="pageService"
      row-key="username"
      :search-forms="searchForms"></DataTable>
  </PageContainer>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import {
  type FormItemsOptions,
  type LoadDataParams,
  type TableColumnsOptions,
  useTable,
} from '@gopowerteam/vue-dynamic-table'
import { useRequest } from 'virtual:request'
import { PageService } from '@/http/extends/page.service'
import type { Assistant } from '@/http/models/Assistant'

const pageService = new PageService()
const table = $(useTable('table'))

const assistantService = useRequest((service) => service.AssistantService)

function onCreate() {
  table.edit({
    title: '创建',
    columns: 1,
    record: {
      name: '',
      prompt: '',
      placeholder: '',
      foreword: '',
    },
    appendRowKey: true,
    submit: (data) => {
      assistantService.createAssistant(data as any).then(() => {
        table.reload()
      })
    },
  })
}

function loadData({ search, update }: LoadDataParams) {
  assistantService.findAssistant(search, [pageService]).then(({ data }) => {
    update(data)
  })
}

const searchForms: FormItemsOptions = [
  {
    key: 'name',
    title: '名称',
    render: (r) => r.input(),
  },
]

const editsForms: FormItemsOptions = [
  {
    key: 'name',
    title: '名称',
    rules: [{ required: true, message: '请输入名称' }],
    render: (r) => r.input(),
  },
  {
    key: 'prompt',
    title: 'Prompt',
    rules: [{ required: true, message: '请输入Prompt' }],
    render: (r) => r.textarea({ autosize: { minRows: 5, maxRows: 10 } }),
  },
  {
    key: 'placeholder',
    title: '提示',
    render: (r) => r.input(),
  },
  {
    key: 'foreword',
    title: '前言',
    render: (r) => r.input(),
  },
]

const columns: TableColumnsOptions<Assistant> = [
  {
    key: 'code',
    title: '编号',
  },
  {
    key: 'name',
    title: '名称',
  },
  {
    key: 'placeholder',
    title: '提示',
  },
  {
    key: 'foreword',
    title: '前言',
  },
  {
    key: 'action',
    title: '操作',
    render: (r) =>
      r.button({
        buttons: [
          {
            text: '删除',
            confirm: true,
            confirmText: 'gogogo',
            callback: (record) => {
              assistantService.removeAssistant(record.id).then(() => {
                table.reload()
              })
            },
          },
          {
            text: '编辑',
            callback: (record) => {
              table.edit({
                title: '编辑',
                record,
                columns: 1,
                submit: async (data) => {
                  assistantService.updateAssistant(record.id, data).then(() => {
                    table.reload()
                  })
                },
              })
            },
          },
        ],
      }),
  },
]

function onImportAssistants(files: FileList) {
  const file = files.item(0)
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = async () => {
    const assistants = JSON.parse(reader.result as string)
    await assistantService.importAssistants({
      assistants,
    })
    table.reload()
  }
  reader.readAsText(file)
}
</script>

<route lang="yaml">
name: assistants
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: assistants
    title: 助手管理
</route>

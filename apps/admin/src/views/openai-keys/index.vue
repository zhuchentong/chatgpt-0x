<template>
  <PageContainer title="Key管理">
    <template #action>
      <ASpace>
        <AButton
          type="primary"
          @click="onCreate">
          创建
        </AButton>
        <AButton
          type="primary"
          @click="onSyncBalances">
          同步余额
        </AButton>
      </ASpace>
    </template>
    <DataTable
      ref="table"
      action-align="right"
      :columns="columns"
      :edit-forms="editsForms"
      :load-data="loadData"
      :pagination="pageService"
      row-key="key"></DataTable>
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
import type { OpenAIKey } from '@/http/models/OpenAIKey'
import { OpenAIKeyStateDict } from '@/config/dict.config'
import { OpenAIKeyState } from '@/config/enum.config'

const pageService = new PageService()
const table = $(useTable('table'))

const keyService = useRequest((service) => service.KeyService)

function onSyncBalances() {
  keyService.syncBalances().then(() => {
    table.reload()
  })
}

function onCreate() {
  table.edit({
    title: '创建',
    columns: 1,
    record: {
      key: '',
    },
    appendRowKey: true,
    submit: (data) => {
      keyService.createKey(data as any).then(() => {
        table.reload()
      })
    },
  })
}

function loadData({ update }: LoadDataParams) {
  keyService.getOpenAIKeys([pageService]).then((data) => {
    update(data)
  })
}

const editsForms: FormItemsOptions = [
  {
    key: 'key',
    title: 'OpenAI KEY',
    rules: [{ required: true, message: '请输入Key' }],
    render: (r) => r.input(),
  },
]

const columns: TableColumnsOptions<OpenAIKey> = [
  {
    key: 'key',
    title: 'OpenAI Key',
  },
  {
    key: 'expireAt',
    title: '过期时间',
    render: (r) => r.date(),
  },
  {
    key: 'limit',
    title: '总额度',
    formatter: (record) => record.limit.toFixed(2),
  },
  {
    key: 'usage',
    title: '用量',
    formatter: (record) => record.usage.toFixed(2),
  },
  {
    key: 'balance',
    title: '余额',
    render: (r) =>
      r.text({
        text: (record) => `${(record.limit - record.usage).toFixed(2)}`,
      }),
  },
  {
    key: 'state',
    title: '状态',
    render: (r) => r.dict({ dict: OpenAIKeyStateDict }),
  },
  {
    key: 'action',
    width: '200px',
    title: '操作',
    render: (r) =>
      r.button({
        buttons: [
          {
            text: '删除',
            confirm: true,
            confirmText: '是否确认执行该操作?',
            callback: (record) => {
              keyService.removeKey(record.key).then(() => {
                table.reload()
              })
            },
          },
          {
            text: '重置状态',
            confirm: true,
            confirmText: '是否确认执行该操作?',
            callback: (record) => {
              keyService
                .updateKey(record.key, { state: OpenAIKeyState.Valid })
                .then(() => {
                  table.reload()
                })
            },
          },
        ],
      }),
  },
]
</script>

<route lang="yaml">
name: openai-keys
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: openai-keys
    title: Key管理
    index: 0
</route>

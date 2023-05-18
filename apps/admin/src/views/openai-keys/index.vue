<template>
  <PageContainer title="密钥管理">
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
        <AButton
          type="primary"
          @click="onGetCurrentKey">
          查看当前Key
        </AButton>
      </ASpace>
    </template>
    <DataTable
      ref="table"
      action-align="right"
      :columns="columns"
      :edit-forms="editForms"
      :load-data="loadData"
      :pagination="pageService"
      row-key="key"
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
import { Message } from '@arco-design/web-vue'
import { PageService } from '@/http/extends/page.service'
import type { OpenAIKey } from '@/http/models/OpenAIKey'
import { EnableStateDict, OpenAIKeyStateDict } from '@/config/dict.config'
import { OpenAIKeyState } from '@/config/enum.config'

const pageService = new PageService()
const table = $(useTable('table'))

const keyService = useRequest((service) => service.KeyService)

function onGetCurrentKey() {
  keyService.getCurrentKey().then((keys) => {
    Message.info(JSON.stringify(keys))
  })
}

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
      return keyService.createKey(data as any).then(() => {
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

const searchForms: FormItemsOptions = [
  {
    key: 'state',
    title: 'state',
    render: (r) => r.select({ options: OpenAIKeyStateDict }),
  },
  {
    key: 'enable',
    title: 'enable',
    render: (r) => r.select({ options: EnableStateDict }),
  },
]

const editForms: FormItemsOptions = [
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
    key: 'exceptionTotal',
    title: '异常总数',
  },
  {
    key: 'exceptionTimes',
    title: '最近异常',
  },
  {
    key: 'state',
    title: '使用状态',
    render: (r) => r.dict({ dict: OpenAIKeyStateDict }),
  },
  {
    key: 'enable',
    title: '启用状态',
    render: (r) => r.dict({ dict: EnableStateDict }),
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
                .updateKey(record.key, {
                  state: OpenAIKeyState.Valid,
                  exceptionTimes: 0,
                })
                .then(() => {
                  table.reload()
                })
            },
          },
          {
            text: (record) => EnableStateDict.get(!record.enable) as string,
            confirm: true,
            confirmText: '是否确定执行此操作？',
            callback: (record) => {
              keyService
                .updateKey(record.key, { enable: !record.enable })
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
    title: 密钥管理
</route>

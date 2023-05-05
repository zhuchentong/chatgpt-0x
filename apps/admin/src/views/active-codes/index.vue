<template>
  <PageContainer title="兑换码管理">
    <template #action>
      <ASpace>
        <AButton
          type="primary"
          @click="onCreate">
          创建
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
      row-key="username"></DataTable>
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
import { EnableStateDict, ProductTypeDict } from '@/config/dict.config'
import type { ActiveCode } from '@/http/models/ActiveCode'

const pageService = new PageService()
const table = $(useTable('table'))

const activeCodeService = useRequest((service) => service.ActiveCodeService)

function onCreate() {
  table.edit({
    title: '创建',
    columns: 1,
    record: {
      startDate: '',
      endDate: '',
      type: '',
      value: '',
      count: 0,
      remark: '',
    },
    appendRowKey: true,
    submit: (data: any) => {
      activeCodeService.createActiveCode(data).then(() => {
        table.reload()
      })
    },
  })
}

function loadData({ search, update }: LoadDataParams) {
  activeCodeService.findActiveCodes(search, [pageService]).then(({ data }) => {
    update(data)
  })
}

const editsForms: FormItemsOptions = [
  {
    key: 'startTime',
    title: '开始时间',
    render: (r) => r.date(),
  },
  {
    key: 'endTime',
    title: '结束时间',
    render: (r) => r.date(),
  },
  {
    key: 'type',
    title: '兑换类型',
    rules: [{ required: true, message: '请选择产品类型' }],
    render: (r) =>
      r.select({
        options: ProductTypeDict,
      }),
  },
  {
    key: 'value',
    title: '次数/天数',
    render: (r) => r.input({ placeholder: '请输入次数/天数' }),
  },
  {
    key: 'count',
    title: '总量',
    render: (r) => r.input(),
  },
  {
    key: '备注',
    title: '备注',
    render: (r) => r.input(),
  },
]

const columns: TableColumnsOptions<ActiveCode> = [
  {
    key: 'key',
    title: '兑换码',
  },
  {
    key: 'startTime',
    title: '开始时间',
    render: (r) => r.date(),
  },
  {
    key: 'endTime',
    title: '结束时间',
    render: (r) => r.date(),
  },
  {
    key: 'type',
    title: '兑换码类型',
    render: (r) => r.dict({ dict: ProductTypeDict }),
  },
  {
    key: 'value',
    title: '次数/天数',
  },
  {
    key: 'count',
    title: '数量',
  },

  {
    key: 'used',
    title: '已兑换',
  },
  {
    key: 'enable',
    title: '状态',
    render: (r) =>
      r.dict({
        dict: EnableStateDict,
      }),
  },
  {
    key: 'action',
    title: '操作',
    render: (r) =>
      r.button({
        buttons: [
          {
            text: (record) => EnableStateDict.get(!record.enable) as string,
            confirm: true,
            confirmText: '是否确定执行此操作？',
            callback: (record) => {
              activeCodeService
                .updateActiveCode(record.key, { enable: !record.enable })
                .then(() => {
                  table.reload()
                })
            },
          },
          {
            text: '删除',
            confirm: true,
            confirmText: '是否确定删除此兑换码？',
            callback: (record) => {
              activeCodeService.removeActiveCode(record.key).then(() => {
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
                  activeCodeService
                    .updateActiveCode(record.key, data)
                    .then(() => {
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
</script>

<route lang="yaml">
name: active-codes
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: active-codes
    title: 兑换码管理
</route>

<template>
  <PageContainer title="用户管理">
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
import type { Product } from '@/http/models/Product'

const pageService = new PageService()
const table = $(useTable('table'))

const [productService, userService] = useRequest(
  (service) => service.ProductService,
  (service) => service.UserService,
)

function onCreate() {
  table.edit({
    title: '创建',
    columns: 1,
    record: {
      title: '',
      type: '',
      value: '',
      price: '',
    },
    appendRowKey: true,
    submit: (data: any) => {
      productService
        .createProduct({
          ...data,
          value: +data.value,
          price: data.price * 100,
        })
        .then(() => {
          table.reload()
        })
    },
  })
}

function loadData({ update }: LoadDataParams) {
  userService.findUsers([pageService]).then((data) => {
    console.log(data)
    // update(data)
  })
}

const editsForms: FormItemsOptions = [
  {
    key: 'title',
    title: '名称',
    rules: [{ required: true, message: '请输入名称' }],
    render: (r) => r.input(),
  },
  {
    key: 'type',
    title: '产品类型',
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
    key: 'price',
    title: '价格',
    render: (r) => r.input(),
  },
]

const columns: TableColumnsOptions<Product> = [
  {
    key: 'title',
    title: '产品名称',
  },
  {
    key: 'type',
    title: '产品类型',
    render: (r) => r.dict({ dict: ProductTypeDict }),
  },
  {
    key: 'value',
    title: '次数/天数',
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
    key: 'price',
    title: '价格',
    formatter: (record) => record.price / 100,
    render: (r) => r.text({ text: (record) => `¥ ${record.price}` }),
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
              productService
                .updateProduct(record.id, { enable: !record.enable })
                .then(() => {
                  table.reload()
                })
            },
          },
          // {
          //   text: '删除',
          //   confirm: true,
          //   confirmText: '是否确定删除此产品？',
          //   callback: (record) => {
          //     productService.removeProduct(record.id).then(() => {
          //       table.reload()
          //     })
          //   },
          // },
          {
            text: '编辑',
            callback: (record) => {
              table.edit({
                title: '编辑',
                record: {
                  ...record,
                  price: record.price,
                },
                columns: 1,
                submit: async (data) => {
                  productService
                    .updateProduct(record.id, {
                      ...data,
                      value: +data.value,
                      price: data.price * 100,
                    })
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
name: users
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: users
    title: 用户管理
</route>

<template>
  <PageContainer title="邀请记录">
    <DataTable
      ref="table"
      action-align="right"
      :columns="columns"
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
import dayjs from 'dayjs'
import { PageService } from '@/http/extends/page.service'
import { ProductTypeDict } from '@/config/dict.config'
import type { Invite } from '@/http/models/Invite'
import { ProductType } from '@/config/enum.config'

const pageService = new PageService()
const table = $(useTable('table'))

const inviteService = useRequest((service) => service.InviteService)

function loadData({ update }: LoadDataParams) {
  inviteService.findInvites([pageService]).then(({ data }) => {
    update(data)
  })
}

const searchForms: FormItemsOptions = []

const columns: TableColumnsOptions<Invite> = [
  {
    key: 'inviter.id',
    title: '邀请人ID',
    width: '200px',
  },
  {
    key: 'invitee.id',
    title: '受邀人ID',
    width: '200px',
  },
  {
    key: 'inviterReward.type',
    title: '邀请人奖励类型',
    render: (r) => r.dict({ dict: ProductTypeDict }),
  },
  {
    key: 'inviterReward.startCount',
    title: '邀请人奖励次数',
  },
  {
    key: 'inviterRewardTime',
    title: '邀请人奖励时长',
    render: (r) =>
      r.text({
        text: (record) => {
          if (ProductType.Time === record.inviterReward.type) {
            return `${dayjs(record.inviterReward.endTime).diff(
              record.inviterReward.startTime,
              'day',
            )}天`
          }

          return ''
        },
      }),
  },
  {
    key: 'inviteeReward.type',
    title: '受邀人奖励类型',
    render: (r) => r.dict({ dict: ProductTypeDict }),
  },
  {
    key: 'inviteeReward.startCount',
    title: '受邀人奖励次数',
  },
  {
    key: 'inviteeRewardTime',
    title: '受邀人奖励时长',
    render: (r) =>
      r.text({
        text: (record) => {
          if (ProductType.Time === record.inviteeReward.type) {
            return `${dayjs(record.inviteeReward.endTime).diff(
              record.inviteeReward.startTime,
              'day',
            )}天`
          }

          return ''
        },
      }),
  },
  {
    key: 'createdAt',
    title: '创建时间',
    render: (r) => r.date(),
  },
]
</script>

<route lang="yaml">
name: invites
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: invites
    title: 邀请记录
</route>

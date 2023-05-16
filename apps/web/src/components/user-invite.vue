<template>
  <div class="user-invite-container">
    <n-card
      closable
      :on-close="() => $emit('close')"
      title="邀请好友">
      <div class="invite-link-container">
        <n-form
          ref="form"
          label-placement="left"
          label-width="80px"
          :show-require-mark="false">
          <n-form-item
            label="邀请链接:"
            path="activeCode">
            <n-input-group>
              <n-input
                readonly
                :value="inviteLink"></n-input>
              <n-button
                class="copy-btn"
                type="primary"
                @click="onCopyLink">
                复制
              </n-button>
            </n-input-group>
          </n-form-item>
        </n-form>
      </div>
      <div class="invite-records-container">
        <n-data-table
          :bordered="false"
          :columns="columns"
          :data="invites"
          :max-height="500">
          <template #empty>
            <n-empty
              description="还没有邀请记录哦"
              size="large"></n-empty>
          </template>
        </n-data-table>
      </div>
    </n-card>
  </div>
</template>

<style lang="less">
.user-invite-container {
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

<script setup lang="tsx">
import type { FormInst } from 'naive-ui'
import { useRequest } from 'virtual:request'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import { useMessage } from 'naive-ui'
import type { TableColumn } from 'naive-ui/es/data-table/src/interface'
import { useStore } from '@/store'
import type { Invite } from '@/http/models/Invite'

defineEmits(['close'])
dayjs.extend(minMax)
const store = useStore()
const form = $(templateRef<FormInst>('form'))
const width = computed(() => (store.app.desktop ? '50%' : '90%'))

const inviteService = useRequest((service) => service.InviteService)

let invites = $ref<Invite[]>([])

const message = useMessage()

const inviteLink = `${location.origin}?inviter=${store.user.current?.id}`
const clipboard = useClipboard({ legacy: true, source: inviteLink })

const columns: TableColumn<Invite>[] = [
  {
    title: '邀请时间',
    key: 'createdAt',
    width: 100,
    render: (record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '邀请用户',
    key: 'invitee',
    width: 100,
    render: (record) =>
      `${record.invitee.id.slice(0, 5)}***${record.invitee.id.slice(-5)}`,
  },
  {
    title: '邀请奖励',
    width: 100,
    key: 'inviterReward.startCount',
    render: (record) => `${record.inviterReward.startCount}次`,
  },
]

async function getInvites() {
  await inviteService.getInvites().then((data) => {
    invites = data
  })
}

function onCopyLink() {
  clipboard.copy().then(() => {
    message.success('邀请链接已复制到粘贴板,邀请好友注册有奖励哦~')
  })
}

onBeforeMount(() => {
  getInvites()
})
</script>

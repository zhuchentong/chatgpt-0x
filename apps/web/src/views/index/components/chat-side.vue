<template>
  <div class="chat-side flex flex-col py-20px">
    <div class="title text-2xl text-center">
      <img
        :src="colorMode === 'light' ? '/logo-light.png' : '/logo-dark.png'"
        style="width: 80%" />
    </div>
    <n-divider class="mt-10px!" />
    <div class="assistants flex-auto">
      <NGrid
        :cols="3"
        item-responsive
        :y-gap="30">
        <NGridItem
          v-for="assistant in store.chat.assistants"
          :key="assistant.id"
          class="assistant text-center"
          @click="() => onChangeAssistant(assistant.id)">
          <n-avatar
            bordered
            class="avatar"
            :class="{ active: store.chat.activeAssistant === assistant.id }"
            round
            :src="`/avatars/${assistant.avatar}.svg`" />
          <div class="text-center text-xs">{{ assistant.name }}</div>
        </NGridItem>
        <NGridItem>
          <div class="text-center">
            <n-button
              circle
              class="button"
              secondary
              strong
              type="primary"
              @click="() => $router.push('/assistant')">
              <template #icon>
                <icon-park-outline:plus></icon-park-outline:plus>
              </template>
            </n-button>
          </div>
        </NGridItem>
      </NGrid>
    </div>
    <n-divider />

    <div class="actions flex flex-col items-start space-y-2 px-5">
      <NButton
        block
        :focusable="false"
        @click="() => (showSystemSetting = true)">
        <template #icon>
          <icon-park-outline:setting></icon-park-outline:setting>
        </template>
        系统设置
      </NButton>
      <NButton
        block
        :focusable="false"
        @click="() => (showUserPayment = true)">
        <template #icon>
          <icon-park-outline:finance></icon-park-outline:finance>
        </template>
        会员充值
      </NButton>
      <NButton
        block
        :focusable="false"
        @click="() => (showUserInvite = true)">
        <template #icon>
          <icon-park-outline:share-two></icon-park-outline:share-two>
        </template>
        邀请好友
      </NButton>
      <NButton
        block
        :focusable="false"
        @click="() => (showUserCenter = true)">
        <template #icon>
          <icon-park-outline:people></icon-park-outline:people>
        </template>
        个人中心
      </NButton>
    </div>
  </div>
  <n-drawer
    v-model:show="showSystemSetting"
    placement="right"
    :width="300">
    <n-drawer-content body-content-style="padding:0;">
      <SystemSetting></SystemSetting>
    </n-drawer-content>
  </n-drawer>
  <n-modal v-model:show="showUserPayment">
    <UserPayment @close="() => (showUserPayment = false)"></UserPayment>
  </n-modal>
  <n-modal v-model:show="showUserInvite">
    <UserInvite @close="() => (showUserInvite = false)"></UserInvite>
  </n-modal>
  <n-modal v-model:show="showUserCenter">
    <UserCenter @close="() => (showUserCenter = false)"></UserCenter>
  </n-modal>
</template>

<style lang="less" scoped>
.chat-side {
  position: absolute;
  inset: 0;
}

.assistants {
  .assistant {
    cursor: pointer;
    .avatar {
      display: inline-block;
      height: 50px;
      width: 50px;
      &.active {
        border-color: #17a058;
      }
    }
  }

  .button {
    height: 50px;
    width: 50px;
  }
}
</style>

<script setup lang="ts">
import { useStore } from '@/store'
import SystemSetting from '@/components/system-setting.vue'
import UserPayment from '@/components/user-payment.vue'
import UserInvite from '@/components/user-invite.vue'
import UserCenter from '@/components/user-center.vue'

const store = useStore()
const showSystemSetting = ref(false)
const showUserPayment = ref(false)
const showUserInvite = ref(false)
const showUserCenter = ref(false)
const colorMode = useColorMode()

function onChangeAssistant(id: string) {
  store.chat.changeAssistant(id)
}
</script>

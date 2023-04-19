<template>
  <div class="chat-side flex flex-col">
    <div class="title text-2xl text-center">ChatGPT 0X</div>
    <n-divider />
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
    <div class="actions flex flex-col items-start space-y-2">
      <NButton
        block
        @click="() => (showSystemSetting = true)">
        <template #icon>
          <icon-park-outline:setting></icon-park-outline:setting>
        </template>
        系统设置
      </NButton>
      <!-- <NButton block>
        <template #icon>
          <icon-park-outline:finance></icon-park-outline:finance>
        </template>
        会员充值
      </NButton> -->
    </div>
    <n-divider />
    <div class="contact flex flex-row space-x-3 justify-center">
      <div>
        <NAvatar
          round
          size="large"
          src="/avatar.png"></NAvatar>
      </div>
      <div class="space-y-1">
        <div class="text-bold text-sm">Jwdstef</div>
        <div class="text-gray text-xs">
          奥创·
          <a
            class="text-green-600 no-underline"
            href="https://jq.qq.com/?_wv=1027&k=51ukmBo"
            target="_blank"
            title="点击加入玩家交流群">
            QQ:25463204
          </a>
        </div>
      </div>
    </div>
  </div>
  <n-drawer
    v-model:show="showSystemSetting"
    placement="right"
    :width="400">
    <n-drawer-content body-content-style="padding:0;">
      <SystemSetting></SystemSetting>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less" scoped>
.chat-side {
  width: 250px;
  padding: 30px 20px;
  // background-color: red;
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

const store = useStore()
const showSystemSetting = ref(false)

function onChangeAssistant(id: string) {
  store.chat.changeAssistant(id)
}
</script>

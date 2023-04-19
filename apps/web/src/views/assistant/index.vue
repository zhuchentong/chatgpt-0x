<template>
  <div
    class="page-container flex flex-col absolute inset-0 space-y-5 shadow-2xl">
    <div>
      <div class="flex m-10 mb-5 items-center space-x-5">
        <n-button
          style="--n-icon-size: 35px"
          text
          @click="() => router.back()">
          <template #icon>
            <icon-park-outline:arrow-circle-left></icon-park-outline:arrow-circle-left>
          </template>
        </n-button>
        <div class="flex-auto">
          <n-input-group>
            <n-input
              v-model:value="input"
              clearable
              :on-clear="onSearch"
              placeholder="搜索你想要的助理"
              @keydown.enter="onSearch">
              <template #suffix></template>
            </n-input>
            <n-button
              ghost
              @click="onSearch">
              <template #icon>
                <icon-park-outline:search></icon-park-outline:search>
              </template>
            </n-button>
          </n-input-group>
        </div>
      </div>
    </div>
    <div class="flex-auto relative">
      <div
        v-if="!loadingService.value"
        class="assistant-list px-30px pb-20px absolute inset-0 overflow-auto">
        <n-grid
          class="flex-auto"
          :cols="store.app.mobile ? 1 : 3"
          :x-gap="12"
          :y-gap="8">
          <n-grid-item
            v-for="assistant in assistants"
            :key="assistant.id">
            <div
              class="assistant-item space-y-4"
              :style="assistant.style">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <n-avatar
                    bordered
                    round
                    :src="`/avatars/${assistant.avatar}.svg`"></n-avatar>
                  <div>{{ assistant.name }}</div>
                </div>
                <div>
                  <n-popconfirm
                    negative-text="取消"
                    positive-text="确定"
                    @positive-click="() => onCreateAssistant(assistant)">
                    <template #trigger>
                      <n-button
                        circle
                        class="w-30px h-30px"
                        text-color="#fff">
                        <icon-park-outline:plus></icon-park-outline:plus>
                      </n-button>
                    </template>
                    <div>添加 {{ assistant.name }} 作为我的小助理</div>
                  </n-popconfirm>
                </div>
              </div>
              <div class="prompt">
                {{
                  assistant.prompt ||
                  '我是一个智能助手,我会按照您的要求去回答提问.'
                }}
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
      <div
        v-else
        class="flex-auto absolute inset-0 flex-center">
        <NSpin size="large"></NSpin>
      </div>
    </div>
    <div
      v-if="assistants.length > 0"
      class="flex-center pb-20px">
      <NPagination
        v-model:page="pageService.pageIndex"
        :on-update:page="onPageChange"
        :page-count="Math.ceil(pageService.total / pageService.pageSize)"
        :page-size="pageService.total"></NPagination>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  margin: 20px;
  border-radius: 20px;
  background-color: v-bind('theme.bodyColor');
}

.actions {
  width: 40px;
}

.assistant-list {
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

.assistant-item {
  cursor: pointer;
  height: 150px;
  border-radius: 10px;
  padding: 20px;
  color: #fff;
}

.prompt {
  font-size: 12px;
  text-indent: 2em;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script setup lang="ts">
import { NPagination, useThemeVars } from 'naive-ui'
import { useRequest } from 'virtual:request'
import type { CSSProperties } from 'vue'
import { useStore } from '@/store'
import type { Assistant } from '@/http/models/Assistant'
import { PageService } from '@/http/extends/page.service'
import { LoadingService } from '@/http/extends/loading.service'

const router = useRouter()
const store = useStore()

const theme = useThemeVars()
const input = $ref('')
const pageService = new PageService(1, 18)
const loadingService = new LoadingService()
const assistantService = useRequest((service) => service.AssistantService)
let assistants = $ref<(Assistant & { style: CSSProperties })[]>([])

function onCreateAssistant(assistant: Assistant) {
  if (!store.chat.assistantItems.find((item) => item.id === assistant.id)) {
    store.chat.appendAssistenItems([assistant])
  }

  store.chat.createAssistant(assistant.id)
  router.push('/')
}

function onRequestAssistants() {
  assistantService
    .getAllAssistant(
      {
        name: input,
      },
      [pageService, loadingService],
    )
    .then(({ data }) => {
      assistants = data.map((assistant) => ({
        ...assistant,
        style: {
          backgroundColor: `rgb(${10 * Math.random()},${132 * Math.random()},${
            255 * Math.random()
          })`,
        },
        avatar: `avatar-${(assistant.code % 51).toString().padStart(3, '0')}`,
      }))
    })
}

function onPageChange(index: number) {
  pageService.pageIndex = index
  onRequestAssistants()
}

function onSearch() {
  nextTick(() => {
    pageService.reset()
    onRequestAssistants()
  })
}

onMounted(() => {
  onRequestAssistants()
})
</script>

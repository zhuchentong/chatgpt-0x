<template>
  <div
    class="page-container"
    :style="containerStyle">
    <div
      v-if="$slots.action"
      class="page-header flex justify-end">
      <div class="page-actions mb-2">
        <slot name="action"></slot>
      </div>
    </div>
    <div
      class="page-body"
      :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  overflow: auto;
  min-height: calc(100vh - 159px);
}
</style>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { useMessage } from 'naive-ui'
import { useStore } from '@/store'

const props = withDefaults(
  defineProps<{
    title?: string
    layout?: 'flex-row' | 'flex-column' | 'flex-center' | 'block'
    absolute?: boolean
    padding?: boolean
    space?: boolean | number
    backgroundColor?: string
  }>(),
  {
    title: '',
    layout: 'block',
    absolute: false,
    padding: true,
    space: true,
  },
)
const store = useStore()
const route = useRoute()
const message = useMessage()
/**
 * 生成外层样式
 */
const containerStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {}

  if (props.padding === false) {
    styles.padding = '10px'
  }

  if (props.backgroundColor) {
    styles.backgroundColor = props.backgroundColor
  }

  return styles
})

/**
 * 生成外层样式
 */
const bodyStyle = computed<CSSProperties>(() => {
  const styles: CSSProperties = {}

  if (props.absolute) {
    styles.position = 'absolute'
    styles.inset = '0'
  }

  if (props.layout) {
    switch (true) {
      case props.layout === 'flex-row':
        styles.display = 'flex'
        styles.flexDirection = 'row'
        break
      case props.layout === 'flex-column':
        styles.display = 'flex'
        styles.flexDirection = 'column'
        break
      case props.layout === 'flex-center':
        styles.display = 'flex'
        styles.alignItems = 'center'
        styles.justifyContent = 'center'
        break
    }
  }

  return styles
})

/**
 * 更新页面标题
 */
function updatePageTitle() {
  const title = props.title || route.meta.title
  if (title) {
    store.app.updateTitle(title as string)
  }
}

onActivated(() => {
  updatePageTitle()
})

onBeforeMount(() => {
  if (props.title) {
    updatePageTitle()
  }

  addMessageEventBusListener()
})

function messageEventHander({
  type,
  content,
  duration = 3000,
}: {
  type: 'success' | 'error' | 'warning' | 'info'
  content: string
  duration?: number
}) {
  message[type](content, { duration })
}

function addMessageEventBusListener() {
  const messageEventBus = useEventBus<{
    type: 'success' | 'error' | 'warning' | 'info'
    content: string
  }>('message')

  messageEventBus.on(messageEventHander)
}

function removeMessageEventBusListener() {
  const messageEventBus = useEventBus<{
    type: 'success' | 'error' | 'warning' | 'info'
    content: string
  }>('message')

  messageEventBus.off(messageEventHander)
}

onBeforeUnmount(() => {
  removeMessageEventBusListener()
})
</script>

<script lang="ts">
export default {
  name: 'PageContainer',
  inheritAttrs: false,
}
</script>

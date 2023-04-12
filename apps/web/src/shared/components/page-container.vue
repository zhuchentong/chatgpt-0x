<template>
  <div
    class="page-container"
    :style="containerStyle">
    <div
      class="page-header flex justify-end"
      v-if="$slots.action">
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

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { appConfig } from '@/config/app.config'
import type { ClassName } from '@arco-design/web-vue/es/_utils/types'
import { useStore } from '@/store'

const store = useStore()
const route = useRoute()
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
 * 生成bodyClass
 */
const bodyClass = computed<ClassName>(() => {
  const space_direction =
    props.layout === 'block' || props.layout === 'flex-column' ? 'y' : 'x'

  const space_number = typeof props.space === 'number' ? props.space : 2

  return Object.assign(
    { [`space-${space_direction}-${space_number}`]: !!props.space },
    props.layout === 'flex-row'
      ? ({ flex: true, 'flex-row': true } as ClassName)
      : {},
    props.layout === 'flex-column'
      ? ({ flex: true, 'flex-col': true } as ClassName)
      : {},
    props.layout === 'flex-center'
      ? ({ flex: true, 'flex-center': true, 'flex-auto': true } as ClassName)
      : {},
  )
})
/**
 * 更新页面标题
 */
function updatePageTitle() {
  const title = props.title || route.meta.title
  console.log(title)
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
})
</script>

<script lang="ts">
export default {
  name: 'PageContainer',
  inheritAttrs: false,
}
</script>

<style lang="less" scoped>
.page-container {
  overflow: auto;
  min-height: calc(100vh - 159px);
}
</style>

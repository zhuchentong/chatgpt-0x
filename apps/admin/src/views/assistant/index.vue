<template>
  <PageContainer :title="title">
    <template #action>
      <ASpace>
        <AButton
          type="primary"
          @click="() => $router.push('/assistant')">
          创建
        </AButton>
        <AButton
          type="outline"
          @click="onImport">
          导入
        </AButton>
      </ASpace>
    </template>
  </PageContainer>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
const route = useRoute()
const id = route.query.id

const title = computed(() => (route.query.id ? '编辑助手' : '创建助手'))
function onImport() {}
</script>

<route lang="yaml">
name: assistant
meta:
  layout: workspace
  requireAuth: true
</route>

<template>
  <PageContainer title="助手管理"></PageContainer>
</template>

<style lang="less" scoped></style>

<script setup lang="ts"></script>

<route lang="yaml">
name: assistant-list
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: config.assistant-list
    title: 助手管理
    index: 0
</route>

<template lang="pug">
PageContainer(absolute layout='flex-center' title='仪表盘')
  .text-3xl Welcome To Use The QuickStart Project Template
</template>

<script setup lang="ts"></script>

<route lang="yaml">
name: dashboard
meta:
  layout: workspace
  requireAuth: true
  menu:
    key: dashboard
    title: 仪表盘
    index: 0
</route>

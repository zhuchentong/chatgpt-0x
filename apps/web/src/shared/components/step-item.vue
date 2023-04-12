<template>
  <div class="step-item-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stepKey: string
  title: string
}>()
</script>

<style lang="less" scoped></style>

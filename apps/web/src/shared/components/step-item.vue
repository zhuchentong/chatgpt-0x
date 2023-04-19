<template>
  <div class="step-item-container">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
defineProps<{
  stepKey: string
  title: string
}>()
</script>

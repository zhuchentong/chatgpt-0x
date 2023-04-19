<template lang="pug">
.step-item-container
  slot
</template>

<style scoped lang="less"></style>

<script setup lang="ts">
defineProps<{
  stepKey: string
  title: string
}>()
</script>

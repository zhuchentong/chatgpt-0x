<template lang="pug">
.video-preview
  image-preview(
    v-if='cover !== undefined'
    height='120px'
    :src='cover'
    width='150px')
  .w-150px.h-120px.flex.flex-center
    icon-park-outline:video-file.text-lg
</template>

<script lang="ts" setup>
export interface VideoInfo {
  src: string
  cover?: string
}

defineProps<VideoInfo>()
</script>

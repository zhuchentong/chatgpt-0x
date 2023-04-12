<template>  
  <div class="video-preview">
    <image-preview v-if="cover !== undefined" :src="cover" width="150px" height="120px"></image-preview>
    <div class="w-150px h-120px flex flex-center">
      <icon-park-outline:video-file class="text-lg"></icon-park-outline:video-file>
    </div>
  </div>
</template>

<script lang="ts" setup>
type VideoInfo = {
  src: string
  cover?: string
}

defineProps<VideoInfo>()
</script>

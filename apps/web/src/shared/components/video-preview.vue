<template>
  <div class="video-preview">
    <image-preview
      v-if="cover !== undefined"
      height="120px"
      :src="cover"
      width="150px"></image-preview>
    <div class="w-150px h-120px flex flex-center">
      <icon-park-outline:video-file
        class="text-lg"></icon-park-outline:video-file>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  src: string
  cover?: string
}>()
</script>

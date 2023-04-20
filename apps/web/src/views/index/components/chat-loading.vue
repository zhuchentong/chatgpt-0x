<template>
  <div class="loading-container">
    <div
      class="loading"
      :class="{
        'text-[#000]': colorMode === 'light',
        'text-[#fff]': colorMode === 'dark',
      }">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;

  div {
    width: 10px;
    height: 10px;
    margin: 4px;
    border-radius: 100%;
    animation: ball-beat 0.7s -0.15s infinite linear;

    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
  }
}
.loading > div:nth-child(2n-1) {
  animation-delay: -0.5s;
}

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    transform: scale(0.75);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<script setup lang="ts">
const colorMode = useColorMode()
</script>

<script setup lang="ts">
import {useLoadingStore} from "../stores/progress-bar.store.ts";
const {isLoading, progress} = useLoadingStore();
</script>

<template>
  <div :class="{'loading-container': true, loading: isLoading, visible: isLoading}">
    <div class="loader" :style="{ width: progress + '%' }">
      <div class="light"></div>
    </div>
    <div class="glow"></div>
  </div>
</template>

<style scoped>
.loading-container {
  font-size: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  width: 100%;
  opacity: 0;
  display: none;
  z-index: 100;
  transition: opacity 500ms;
}

.loading-container.visible {
  display: block;
}
.loading-container.loading {
  opacity: 1;
}

.loader {
  background: #23d6d6;
  display: inline-block;
  height: 100%;
  width: 50%;
  overflow: hidden;
  border-radius: 0 0 5px 0;
  transition: 3s width ease-out;
}

.loader > .light {
  float: right;
  height: 100%;
  width: 20%;
  background-image: linear-gradient(to right, #23d6d6, #29ffff, #23d6d6);
  animation: loading-animation 3s ease-in infinite;
}

.glow {
  display: inline-block;
  height: 100%;
  width: 30px;
  margin-left: -30px;
  border-radius: 0 0 5px 0;
  box-shadow: 0 0 10px #23d6d6;
}

@keyframes loading-animation {
  0% {
    margin-right: 100%;
  }
  50% {
    margin-right: 100%;
  }
  100% {
    margin-right: -10%;
  }
}
</style>
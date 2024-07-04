<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import $eventHub from '../utils/eventHub.ts'
import {random} from 'lodash'

const defaultDuration = 8000
// How frequently to update
const defaultInterval = 1000
// 0 - 1. Add some variation to how much the bar will grow at each interval
const variation = 0.5
// 0 - 100. Where the progress bar should start from.
const startingPoint = 0
// Limiting how far the progress bar will get to before loading is complete
const endingPoint = 90

const isLoading = ref(true);
const isVisible = ref(false);
const progress = ref(startingPoint);
let timeoutId;

const start = () => {
  isLoading.value = true;
  isVisible.value = true;
  progress.value = startingPoint;
  loop();
};

const loop = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  if (progress.value >= endingPoint) {
    return;
  }
  const size = (endingPoint - startingPoint) / (defaultDuration / defaultInterval);
  const p = Math.round(progress.value + random(size * (1 - variation), size * (1 + variation)));
  progress.value = Math.min(p, endingPoint);
  timeoutId = setTimeout(loop, random(defaultInterval * (1 - variation), defaultInterval * (1 + variation)));
};

const stop = () => {
  isLoading.value = false;
  progress.value = 100;
  clearTimeout(timeoutId);
  setTimeout(() => {
    if (!isLoading.value) {
      isVisible.value = false;
    }
  }, 200);
};

// Assuming $eventHub is globally available or imported properly
onMounted(() => {
  $eventHub.$on('asyncComponentLoading', start);
  $eventHub.$on('asyncComponentLoaded', stop);
});

onUnmounted(() => {
  $eventHub.$off('asyncComponentLoading', start);
  $eventHub.$off('asyncComponentLoaded', stop);
});
</script>

<template>
  <div :class="{'loading-container': true, loading: isLoading, visible: isVisible}">
    <div class="loader" :style="{ width: progress + '%' }">
      <div class="light"></div>
    </div>
    <div class="glow"></div>
  </div>
</template>

<style scoped>
.loading-container {
  font-size: 0; /* remove space */
  position: fixed;
  top: 0;
  left: 0;
  height: 5px;
  width: 100%;
  opacity: 0;
  display: none;
  z-index: 5000;
  transition: opacity 200;
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
  transition: 200 width ease-out;
}

.loader > .light {
  float: right;
  height: 100%;
  width: 20%;
  background-image: linear-gradient(to right, #23d6d6, #29ffff, #23d6d6);
  animation: loading-animation 2s ease-in infinite;
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
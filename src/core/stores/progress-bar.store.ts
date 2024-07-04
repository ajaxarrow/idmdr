import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

const isLoading = ref(false)
const progress = ref(100)

// const start = () => {
//   isLoading.value = true;
//   progress.value = 0;
//
//   const interval = setInterval(() => {
//     if (progress.value < 100) {
//       progress.value += 10;
//     } else {
//       clearInterval(interval);
//       isLoading.value = false;
//       progress.value = 0;
//     }
//   }, 10);
// }

// const defaultDuration = 8000
// const defaultInterval = 1000
// const variation = 0.5
// const startingPoint = 0
// const endingPoint = 90
//
// const isLoading = ref(false)
// const isVisible = ref(false)
// const progress = ref(startingPoint)
// let timeoutId: number | undefined
//
// const start = () => {
//   isLoading.value = true
//   isVisible.value = true
//   progress.value = startingPoint
//   loop()
// }
//
// const loop = () => {
//   if (timeoutId) {
//     clearTimeout(timeoutId)
//   }
//   if (progress.value >= endingPoint) {
//     return
//   }
//   const size = (endingPoint - startingPoint) / (defaultDuration / defaultInterval)
//   const p = Math.round(progress.value + Math.random() * size * (1 - variation) + size * (1 + variation))
//   progress.value = Math.min(p, endingPoint)
//   timeoutId = window.setTimeout(loop, Math.random() * defaultInterval * (1 - variation) + defaultInterval * (1 + variation))
// }
//
// const stop = () => {
//   isLoading.value = false
//   progress.value = 100
//   clearTimeout(timeoutId)
//   setTimeout(() => {
//     if (!isLoading.value) {
//       isVisible.value = false
//     }
//   }, 200)
// }

export const useLoadingStore = createGlobalState(() => ({ isLoading, progress, }))

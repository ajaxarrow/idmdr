<script setup lang="ts">
import dotLoad from "../../assets/lottiefiles/dot-load.json";
import {Vue3Lottie} from "vue3-lottie";
const props = defineProps({
  overlay: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <VDialog v-model="props.overlay">
    <Vue3Lottie
        :animation-data="dotLoad"
        height="80%"
        width="80%"
    ></Vue3Lottie>
  </VDialog>
</template>

<style scoped>
:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
  height: 70vh !important;
}
</style>
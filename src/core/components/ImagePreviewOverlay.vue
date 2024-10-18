<script setup lang="ts">
import {PhX} from "@phosphor-icons/vue";

const emits = defineEmits(['closeOverlay']);
const props = defineProps({
  overlay: {
    type: Boolean,
    default: true,
  },
  imageSrc: {
    type: String,
  },
});
</script>

<template>
  <VDialog v-model="props.overlay">
    <div class="dialog-content">
      <PhX color="#ffffff" weight="bold" size="32" class="close-icon" @click="emits('closeOverlay')" />
      <VImg :src="<string>props.imageSrc" height="90%" class="mt-10" />
    </div>
  </VDialog>
</template>

<style scoped>
:deep(.v-overlay__content) {
  height: 100vh !important;
}

:deep(.v-overlay__scrim ){
  background: #000 !important;
  opacity: .50 !important;
}

.dialog-content {
  position: relative;
  height: 100%;
}


.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 1;
}

</style>

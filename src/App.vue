<script setup lang="ts">
import ProgressBar from "./core/components/ProgressBar.vue";
import { PhCheckCircle, PhInfo, PhWarning, PhWarningCircle, PhX } from "@phosphor-icons/vue";
import { useScreenStore } from "./core/stores/screen-size.store.ts";
import { useSnackbarStore } from "./core/stores/snackbar.store.ts";
import { shallowRef, watch } from "vue";
import { Status } from "./interfaces/enums/status.enum.ts";

const { showSnackbar, snackbarStatus, snackbarMessage } = useSnackbarStore();
const { isMobile } = useScreenStore();

const snackbarStyle = shallowRef({ icon: PhInfo, color: "#3291C7" });

watch(snackbarStatus, (newStatus) => {
  switch (newStatus) {
    case Status.information:
      snackbarStyle.value = { icon: PhInfo, color: "#3291C7" };
      break;
    case Status.success:
      snackbarStyle.value = { icon: PhCheckCircle, color: "#32C8B4" };
      break;
    case Status.warning:
      snackbarStyle.value = { icon: PhWarning, color: "#c87132" };
      break;
    case Status.error:
      snackbarStyle.value = { icon: PhWarningCircle, color: "#C83246" };
      break;
    default:
      snackbarStyle.value = { icon: PhInfo, color: "#3291C7" };
  }
});
</script>

<template>
  <ProgressBar />
  <RouterView />
  <VSnackbar
      style="z-index: 10000 !important;"
      v-model="showSnackbar"
      :timeout="3000"
      :location="isMobile ? 'top left' : 'bottom left'"
      variant="flat"
  >
    <p class="d-flex align-center ga-2">
      <component :is="snackbarStyle.icon" :color="snackbarStyle.color" weight="fill" size="20" />
      {{ snackbarMessage }}
    </p>
    <template v-slot:actions>
      <VBtn color="white" @click="showSnackbar = false">
        <PhX weight="bold" />
      </VBtn>
    </template>
  </VSnackbar>
</template>

<style scoped>
</style>

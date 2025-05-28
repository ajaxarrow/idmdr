<script setup lang="ts">
import { PhPolygon } from "@phosphor-icons/vue";
import { ref } from "vue";
import arrow from "../../../assets/images/arrow.svg";

const sectorTaggingDialog = ref<boolean>(false);
</script>

<template>
  <p
      @click="sectorTaggingDialog = true"
      class="add-sector-menu-item cursor-pointer d-flex align-center my-2"
  >
    <PhPolygon
        class="mr-1"
        color="#3291C7"
        weight="fill"
        size="14"
    />
    Draw Boundary from Map
  </p>

  <VDialog v-model="sectorTaggingDialog" :class="['top-right']">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <!-- Arrow container -->
      <div class="arrow-container">
        <VImg :src="arrow" height="40px" width="40px"/>
      </div>

      <p class="pa-4">
        Hey! To draw a polygon directly on the map, click the square icon located on the top right side of the map. If you prefer not to draw here, you can go to the create an associated area form instead.
      </p>

      <VDivider />

      <div class="d-flex justify-end ga-2 pa-2">
        <VBtnPrimaryFilled
            class="my-2"
            style="font-size: 14px !important; font-weight: 500 !important;"
            variant="outlined"
            rounded="lg"
            :to="{ name: 'new-sector' }"
        >
          Go to Sector Form
        </VBtnPrimaryFilled>
        <VBtnPrimaryFilled
            class="my-2"
            style="font-size: 14px !important; font-weight: 500 !important;"
            rounded="lg"
            @click="sectorTaggingDialog = false"
        >
          Got it!
        </VBtnPrimaryFilled>
      </div>
    </VSheet>
  </VDialog>
</template>

<style scoped>
.add-sector-menu-item {
  border-radius: 8px;
  padding: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #000;
}

.add-sector-menu-item:hover {
  background-color: #e0e3e3;
}

.sector-tagging-dialog-container {
  width: 400px;
  border-radius: 15px !important;
  position: relative !important;
  overflow: visible !important;
}

.arrow-container {
  position: absolute;
  top: -25px;
  right: -10px;
  z-index: 10;
  animation: swing 2s ease-in-out infinite; /* Apply swing animation */
}

@keyframes swing {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

:deep(.v-label) {
  opacity: 100% !important;
}

:deep(.v-icon) {
  --v-icon-size-multiplier: 1.23;
}

:deep(.v-field__outline) {
  opacity: 20%;
  color: #8c8c8c;
  --v-field-border-width: 1.75px !important;
}

:deep(input::placeholder) {
  color: #5f6061;
  opacity: 90%;
}

/* Center the dialog content */
:deep(.v-overlay__content) {
  width: 400px !important;
  position: fixed !important;
  top: 160px !important;
  right: 20px !important;
}
</style>

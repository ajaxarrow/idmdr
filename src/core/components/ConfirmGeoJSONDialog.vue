<script setup lang="ts">
import {PhQuestion} from "@phosphor-icons/vue";
import {useSectorMapStore} from "../stores/sector-map.store.ts";

const {confirmDialog} = useSectorMapStore()
const emit = defineEmits(['confirmCallback', 'cancelCallback'])


const handleConfirm = () => {
  emit("confirmCallback")
  confirmDialog.value = false
}

const handleCancel = () => {
  emit("cancelCallback")
  confirmDialog.value = false
}
</script>

<template>
  <VDialog v-model="confirmDialog" class="center">
    <VSheet class="delete-dialog-container" @click.stop>
      <PhQuestion color="#01579B" weight="duotone" size="50"/>
      <p class="font-weight-black text-h6">Are you sure?</p>
      <p class="text-center px-1 mb-3">A GeoJSON data is selected. Do you want to proceed in tagging this location to a specific entity?</p>
      <VBtnPrimaryAlt
          color="#01579B"
          @click="handleConfirm"
          width="98%"
          class="submit-button"
      >
        Yes, Proceed to Sector Tagging!
      </VBtnPrimaryAlt>
      <VBtnPrimaryAlt
          color="#01579B"
          @click="handleCancel"
          width="98%"
          variant="outlined"
          class="button-outline"
      >
        No, Cancel It
      </VBtnPrimaryAlt>
    </VSheet>
  </VDialog>
</template>

<style scoped>
.delete-dialog-container{
  gap: 10px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  border-radius: 15px !important;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 2px;
  border-radius: 8px;
}

.submit-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 8px;
}
</style>
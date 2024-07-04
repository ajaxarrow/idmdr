<script setup lang="ts">
import {PhMagnifyingGlass} from "@phosphor-icons/vue";
import {ref, watch} from "vue";
import {useSectorsStore} from "../../../sector/stores/sectors.store.ts";

const searchedSector = ref("");
const {filterSectors} = useSectorsStore();

watch(() => searchedSector.value, () => {
  filterSectors(searchedSector.value)
})

</script>

<template>
  <VTextField
      v-model="searchedSector"
      placeholder="Search Sectors"
      hide-details
      rounded="lg"
      density="comfortable"
      variant="outlined"
      color="primary"
      base-color="gs60"
  >
    <template v-slot:prepend-inner>
      <PhMagnifyingGlass :size="18"/>
    </template>
  </VTextField>
</template>

<style scoped>
:deep .v-label{
  opacity: 100% !important;
}

:deep .v-icon{
  --v-icon-size-multiplier: 1.23
}

:deep .v-field__outline {
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep input::placeholder {
  color: #5F6061;
  opacity: 90%;
}


</style>
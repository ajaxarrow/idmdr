<script setup lang="ts">
import {PhMagnifyingGlass} from "@phosphor-icons/vue";
import {ref, watch} from "vue";
import {useOrganizationStore} from "../../../stores/organizationStore.ts";

const searchedOrganization = ref("");
const {filterOrganizations} = useOrganizationStore();

watch(() => searchedOrganization.value, () => {
  filterOrganizations(searchedOrganization.value)
})

</script>

<template>
  <VTextField
      v-model="searchedOrganization"
      placeholder="Search Organizations"
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
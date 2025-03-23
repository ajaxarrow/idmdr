<script setup lang="ts">
import { PropType } from "vue";
import { ATBI, Facility } from "../../../interfaces/atbi.interface.ts";

const props = defineProps({
  atbi: {
    type: Object as PropType<ATBI>
  }
})
</script>

<template>
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">Facilities</p>
      <div v-if="props.atbi?.facilities && props.atbi.facilities.length > 0">
        <div v-for="(facility, index) in props.atbi.facilities" :key="index" class="mb-4">
          <h3 class="font-bold text-lg">{{ facility.name }}</h3>
          <p v-if="facility.capacity" class="text-sm text-gray-600 mb-1">Capacity: {{ facility.capacity }}</p>
          <div v-if="facility.description" class="ql-snow">
            <div class="ql-editor" v-html="facility.description"></div>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">No facility information available</p>
    </div>
  </div>
</template>

<style scoped>
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
</style>
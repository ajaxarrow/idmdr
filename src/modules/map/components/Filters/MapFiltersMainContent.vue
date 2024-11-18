<script setup lang="ts">
import {ref, watch} from "vue";
import {useFilterStore} from "../../stores/filters.store.ts";

const {dotDensityLayer} = useFilterStore();

  const productionData = ref([
    {
      title: 'Commodities',
      color: "#00FFA6",
      value: false
    },
    {
      title: 'Northern Mindanao Consortiums',
      color: "#00FFA6",
      value: false
    },
    {
      title: 'Primary Agriculture Lands',
      color: "#c77d32",
      value: false
    },
    {
      title: 'Plantation Cover',
      color: "#2d1fa4",
      value: false
    },
    {
      title: 'Corn Planted Area',
      color: "#84c732",
      value: false
    },
    {
      title: 'Vegatable Gardens',
      color: "#c73293",
      value: false
    },
    {
      title: 'Sugarcane Plantation',
      color: "#15561c",
      value: false
    },
  ])

watch(
    () => productionData.value.find(data => data.title === 'Commodities'),
    (newVal) => {
      if (newVal) {
        dotDensityLayer.value = newVal.value
      }
    },
    { deep: true }
);



</script>

<template>
  <VSwitch
      v-for="data in productionData"
      :label="data.title"
      hide-details
      :color="data.color"
      v-model="data.value"
      density="compact"
  />
</template>

<style scoped>

</style>
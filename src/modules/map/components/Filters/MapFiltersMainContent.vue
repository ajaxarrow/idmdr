<script setup lang="ts">
import { ref, watch } from "vue";
import { useFilterStore } from "../../stores/filters.store.ts";

const { dotDensityLayer, provinceConsortiumsLayer, provinceRepositoriesLayer } = useFilterStore();

const productionData = ref([
  // {
  //   title: 'Commodities',
  //   color: "#00FFA6",
  //   value: false
  // },
  {
    title: 'Northern Mindanao Consortiums',
    color: "#00FFA6",
    value: false
  },
  {
    title: 'Northern Mindanao Projects',
    color: "#00FFA6",
    value: false
  },
]);

// Watcher to ensure only one switch is open at a time
const toggleSwitch = (selectedSwitch: string) => {
  productionData.value.forEach((data) => {
    if (data.title !== selectedSwitch) {
      data.value = false; // Close all other switches
    }
  });
};

watch(
    () => productionData.value.find(data => data.title === 'Commodities'),
    (newVal) => {
      if (newVal) {
        dotDensityLayer.value = newVal.value;
      }
    },
    { deep: true }
);



watch(
    () => productionData.value.find(data => data.title === 'Northern Mindanao Consortiums'),
    (newVal) => {
      if (newVal) {
        provinceConsortiumsLayer.value = newVal.value;
        // provinceRepositoriesLayer.value = !newVal.value;
      }
    },
    { deep: true }
);

watch(
    () => productionData.value.find(data => data.title === 'Northern Mindanao Projects'),
    (newVal) => {
      if (newVal) {
        toggleSwitch('Northern Mindanao Projects');
        // provinceConsortiumsLayer.value = !newVal.value;
        provinceRepositoriesLayer.value = newVal.value;
      }
    },
    { deep: true }
);

</script>

<template>
  <VSwitch
      v-for="data in productionData"
      :key="data.title"
      :label="data.title"
      hide-details
      :color="data.color"
      v-model="data.value"
      density="compact"
  />
</template>

<style scoped>
</style>

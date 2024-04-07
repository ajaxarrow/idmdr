<script setup lang="ts">
  import {ref} from "vue";

  const filterData = ref([
    {
      title: 'Crop Production',
      filters: [
        {
          title: 'Land Use & Crop Mapping',
          color: "#c77d32",
          value: false
        },
        {
          title: 'Production Alert',
          color: "#3291C7",
          value: true
        },
        {
          title: 'Agricultural Expansion Risk',
          color: "#C7329D",
          value: true
        },
      ]
    },
    {
      title: 'Crop Monitoring',
      filters: [
        {
          title: 'Crop Growth Monitoring',
          color: "#C78232",
          value: true
        },
        {
          title: 'Pest and Disease Monitoring',
          color: "#2d1fa4",
          value: false
        },
      ]
    },
    {
      title: 'Biodiversity Impact',
      filters: [
        {
          title: 'Biodiversity Conversion Zone',
          color: "#c77d32",
          value: false
        },
        {
          title: 'Wetland Preservation Areas',
          color: "#74C732",
          value: true
        },
        {
          title: 'Crop Diversity Hotspot',
          color: "#7D32C7",
          value: true
        },
      ]
    }
  ])
</script>

<template>
  <div v-for="data in filterData" class="mb-5">
    <p class="font-weight-bold">{{data.title.toUpperCase()}}</p>

    <VSwitch
        v-for="filter in data.filters"
        :label="filter.title"
        hide-details
        :color="filter.color"
        v-model="filter.value"
        density="compact"
    />

  </div>

</template>

<style scoped>

</style>
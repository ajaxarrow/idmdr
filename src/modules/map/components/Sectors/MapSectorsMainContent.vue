<script setup lang="ts">
import {PhInfo, PhPlant} from "@phosphor-icons/vue";
import {useSectorsStore} from "../../../sector/stores/sectors.store.ts";
import {useMapStore} from "../../stores/map.store.ts";
import {onMounted, onUnmounted} from "vue";
import {useSectorServices} from "../../../sector/services/sector.services.ts";

const {allSectors} = useSectorsStore();
const {clickProvince, clickedBoundary, resetToDefault} = useMapStore();
const {fetchSectors} = useSectorServices()

onMounted(async() => {
  await fetchSectors()
})

onUnmounted(() => {
  resetToDefault('Sector')
})

</script>

<template>
  <div v-if="allSectors.length === 0">
    <p class="justify-center d-flex align-center">
      No Sectors Found <PhInfo size="19" class="ml-1"/>
    </p>
  </div>
  <VList
      v-else
      density="compact"
      nav
  >
    <VListItem
      v-for="sector in allSectors"
      @click="clickProvince(sector, 'Sector')"
      class="map-item"
      :class="{
        'active-map-item': sector.name === clickedBoundary
      }"
    >
      <VListItemTitle class="cursor-pointer">
        <div class="d-flex align-center">
          <PhPlant size="18" color="#3E454D" weight="fill"/>
          <span class="mx-2 me-1 province-title">{{sector.name}}</span>
        </div>
      </VListItemTitle>
    </VListItem>
  </VList>
</template>

<style scoped>
.province-title{
  font-size: 14px;
}
</style>
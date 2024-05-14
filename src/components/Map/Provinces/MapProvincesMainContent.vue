<script setup lang="ts">
import {useProvincesStore} from "../../../stores/provincesStore.ts";
import {PhInfo, PhPlant} from "@phosphor-icons/vue";
import {useMapStore} from "../../../stores/mapStore.ts";
import {onUnmounted} from "vue";

const {provinces} = useProvincesStore();
const {clickProvince, clickedBoundary, resetToDefault} = useMapStore();

onUnmounted(() => {
  resetToDefault('Sector')
})
</script>

<template>
  <div v-if="provinces.length === 0">
    <p class="justify-center d-flex align-center">
      No Provinces Found <PhInfo size="19" class="ml-1"/>
    </p>
  </div>
  <VList
      v-else
      density="compact"
      nav
  >
    <VListItem
      v-for="province in provinces"
      @click="clickProvince(province, 'Province')"
      class="map-item"
      :class="{
        'active-map-item': province.title === clickedBoundary
      }"
    >
      <VListItemTitle class="cursor-pointer">
        <div class="d-flex align-center">
          <PhPlant size="18" color="#3E454D" weight="fill"/>
          <span class="mx-2 me-1 province-title">{{province.title}}</span>
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
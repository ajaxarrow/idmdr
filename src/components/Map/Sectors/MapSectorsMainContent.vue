<script setup lang="ts">
import {PhInfo, PhPlant} from "@phosphor-icons/vue";
import {useSectorsStore} from "../../../stores/sectorsStore.ts";

const {sectors, selectSector} = useSectorsStore();
</script>

<template>
  <div v-if="sectors.length === 0">
    <p class="justify-center d-flex align-center">
      No Sectors Found <PhInfo size="19" class="ml-1"/>
    </p>
  </div>
  <VList
      v-else
      density="compact"
      nav
  >
    <VListItem v-for="sector in sectors">
      <VListItemTitle @click="selectSector(sector)" class="cursor-pointer">
        <div class="d-flex align-center">
          <PhPlant size="18" color="#3E454D" weight="fill"/>
          <span class="mx-2 me-1 province-title">{{sector.title}}</span>
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
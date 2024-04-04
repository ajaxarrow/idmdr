<script setup lang="ts">
import {PhPlant} from "@phosphor-icons/vue";
import {useSectorsStore} from "../../../stores/sectorsStore.ts";

const {sectors} = useSectorsStore();
</script>

<template>
  <VList
      density="compact"
      nav
  >
    <VListItem  v-for="sector in sectors">
      <VListItemTitle>
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
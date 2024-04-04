<script setup lang="ts">
import {useProvincesStore} from "../../../stores/provincesStore.ts";
import {PhPlant} from "@phosphor-icons/vue";

const {provinces} = useProvincesStore();
</script>

<template>
  <VList
      density="compact"
      nav
  >
    <VListItem  v-for="province in provinces">
      <VListItemTitle>
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
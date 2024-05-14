<script setup lang="ts">
import {PhInfo, PhUsersThree} from "@phosphor-icons/vue";
import {useMapStore} from "../../../stores/mapStore.ts";
import {useOrganizationStore} from "../../../stores/organizationStore.ts";

const {organizations} = useOrganizationStore();
const {clickOrganization, clickedBoundary} = useMapStore();
</script>

<template>
  <div v-if="organizations.length === 0">
    <p class="justify-center d-flex align-center">
      No Organizations Found <PhInfo size="19" class="ml-1"/>
    </p>
  </div>
  <VList
      v-else
      density="compact"
      nav
  >
    <VListItem
      v-for="organization in organizations"
      @click="clickOrganization(organization)"
      class="map-item"
      :class="{
        'active-map-item': organization.name === clickedBoundary
      }"
    >
      <VListItemTitle class="cursor-pointer">
        <div class="">
          <PhUsersThree size="18" color="#3E454D" weight="fill"/>
          <span class="mx-2 me-1 province-title">{{organization.name}}</span>
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
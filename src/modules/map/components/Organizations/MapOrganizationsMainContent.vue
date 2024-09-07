<script setup lang="ts">
import {PhInfo, PhUsersThree} from "@phosphor-icons/vue";
import {useMapStore} from "../../stores/map.store.ts";
import {useOrganizationStore} from "../../../organization/stores/organization.store.ts";
import {onMounted, onUnmounted, ref} from "vue";
import {Organization} from "../../../../interfaces/organization.interface.ts";
import {useOrganizationServices} from "../../../organization/services/organization.services.ts";

const {mapOrganizations} = useOrganizationStore();
const {fetchOrganizations} = useOrganizationServices();
const {clickOrganization, clickedBoundary, resetToDefault} = useMapStore();

const organizationData = ref<Organization[]>(mapOrganizations.value);

onMounted(async() => {
  organizationData.value = await fetchOrganizations();
})

onUnmounted(() => {
  resetToDefault('Organization');
})

</script>

<template>
  <div v-if="organizationData.length === 0">
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
      v-for="organization in organizationData"
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
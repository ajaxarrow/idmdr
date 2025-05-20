<script setup lang="ts">
import {PhInfo, PhUsersThree} from "@phosphor-icons/vue";
import {useMapStore} from "../../stores/map.store.ts";
import {useOrganizationStore} from "../../../organization/stores/organization.store.ts";
import {onMounted, onUnmounted} from "vue";
import {useOrganizationServices} from "../../../organization/services/organization.services.ts";
import {useUserStore} from "../../../../core/stores/user.store.ts";

const {userData} = useUserStore();
const {searchedMapOrganizations} = useOrganizationStore();
const {fetchOrganizations, fetchOrganizationByAdmin} = useOrganizationServices();
const {clickOrganization, clickedBoundary, resetToDefault} = useMapStore();


onMounted(async() => {
  if(userData.is_superuser) {
    await fetchOrganizationByAdmin()
  } else {
    await fetchOrganizations()
  }
})

onUnmounted(() => {
  resetToDefault('Organization');
})

</script>

<template>
  <div v-if="searchedMapOrganizations.length === 0">
    <p class="justify-center d-flex align-center">
      No CMIs Found <PhInfo size="19" class="ml-1"/>
    </p>
  </div>
  <VList
      v-else
      density="compact"
      nav
  >
    <VListItem
      v-for="organization in searchedMapOrganizations"
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
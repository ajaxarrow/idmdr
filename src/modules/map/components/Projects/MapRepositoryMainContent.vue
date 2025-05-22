<script setup lang="ts">
import {PhCloud, PhInfo} from "@phosphor-icons/vue";
import {useMapStore} from "../../stores/map.store.ts";
import {onMounted, onUnmounted} from "vue";
import {useUserStore} from "../../../../core/stores/user.store.ts";
import {useRepositoryServices} from "../../../repository/services/repository.services.ts";
import {useRepositoryStore} from "../../../repository/stores/repository.store.ts";

const {userData} = useUserStore();
const {searchedMapRepositories} = useRepositoryStore();
const {fetchRepositories, fetchAllRepositories} = useRepositoryServices()
const {clickRepository, clickedBoundary, resetToDefault} = useMapStore();


onMounted(async() => {
  if(userData.is_superuser) {
    await fetchAllRepositories(1, 1000);
  } else {
    await fetchRepositories()
  }
})

onUnmounted(() => {
  resetToDefault('Repository');
})

</script>

<template>
  <div v-if="searchedMapRepositories.length === 0">
    <p class="justify-center d-flex align-center">
      No Project Found <PhInfo size="19" class="ml-1"/>
    </p>
  </div>
  <VList
      v-else
      density="compact"
      nav
  >
    <VListItem
        v-for="organization in searchedMapRepositories"
        @click="clickRepository(organization)"
        class="map-item"
        :class="{
        'active-map-item': organization.title === clickedBoundary
      }"
    >
      <VListItemTitle class="cursor-pointer">
        <div class="">
          <PhCloud size="18" color="#3E454D" weight="fill"/>
          <span class="mx-2 me-1 province-title">{{organization.title}}</span>
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
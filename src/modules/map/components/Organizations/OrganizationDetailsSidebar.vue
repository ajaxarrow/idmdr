<script setup lang="ts">
import {Repository} from "../../../../interfaces/repository.interface.ts";
import {PhInfo, PhX} from "@phosphor-icons/vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useOrganizationStore} from "../../../organization/stores/organization.store.ts";
import {useMapStore} from "../../stores/map.store.ts";
import {useRepositoryServices} from "../../../repository/services/repository.services.ts";
const {selectedOrganization, removeSelectedOrganization} = useOrganizationStore();
const {resetToDefault} = useMapStore();
const {fetchRepositoriesByOrganization} = useRepositoryServices()
const pageLoading = ref(false);

const repositoryData = ref<Repository[]>([]);

watch(() => selectedOrganization.value, async () => {
  pageLoading.value = true;
  repositoryData.value = await fetchRepositoriesByOrganization(selectedOrganization.value?.uid!, false, 100, );
  pageLoading.value = false;
})

onMounted(async () => {
  removeSelectedOrganization()
})

onUnmounted(() => {
  removeSelectedOrganization()
})



</script>

<template>
  <VSheet class="sector-details-sidebar ma-4" v-if="selectedOrganization">
    <VRow justify="space-between" align="center" class="ma-0 pa-4">
      <p class="sidebar-title">Organization</p>
      <PhX color="#C83246" size="24" weight="bold" class="cursor-pointer" @click="resetToDefault('Organization')"/>
    </VRow>
    <div class="">
      <VImg
          rounded="lg"
          class="mx-auto"
          :cover="true"
          height="174"
          width="328"
          :src="selectedOrganization.image ? selectedOrganization.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
      />
      <div class="pa-4 scrollable-container">
        <p class="sector-title">{{selectedOrganization.name}}</p>
        <p class="sector-description ">{{selectedOrganization.address}}</p>
        <div class="my-3">
          <p class="section-title mb-2">Repositories</p>
          <div v-if="pageLoading" class="loading-state-container">
            <VProgressCircular
                indeterminate
                color="#23668b"
            ></VProgressCircular>
          </div>
          <div v-else>
            <RouterLink
                class="text-decoration-none "
                v-if="repositoryData.length > 0"
                v-for="repository in repositoryData"
                :to="{name: 'repository-data', params: { slug: repository.slug  }}">
              <div
                  class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
              >
                <VImg
                    style="border-radius: 8px; flex: none;"
                    cover
                    height="40px"
                    width="40px"
                    :src="repository.image ? <string>repository.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
                />
                <div class="ml-2">
                  <p class="default" style="font-size: 15px; font-weight: 600;">{{ repository.title }}</p>
                  <p class="default" style="font-size: 13px; ">{{ repository.owner_data?.email }}</p>
                </div>
              </div>
            </RouterLink>
            <p v-else class="my-1  d-flex align-center">
              <PhInfo size="19" class="mr-1 mb-1"/>  No repositories found
            </p>
          </div>
        </div>
      </div>


    </div>
  </VSheet>
</template>

<style scoped>
.repo-item{
  border-radius: 8px;
}
.repo-item:hover{
  background-color: #F0F5F9;
  transition: background-color 0.3s ease;
}
.sector-details-sidebar{
  border-radius: 24px;
  z-index: 5;
  position: fixed;
  top: 0;
  right: 0;
  height: 95vh !important;
  width: 355px !important;
  box-shadow: 0px 0px 7px 0px #5d6e87;
  transition: opacity 1s ease;
}

.scrollable-container{
  overflow-y: auto;
  height: 450px;
}

.sidebar-title{
  font-size: 20px;
  font-weight: 600;
}

.section-title{
  font-size: 17px;
  font-weight: 600;
}

.sector-title{
  font-size: 20px;
  font-weight: 700;
}

.sector-description{
  color: #5F6061;
}

.tag-chips{
  background-color: #fafafa;
  border: 1px solid #e4e4e4;
}

.default{
  font-size: 14px;
  color: #000000;
}
</style>
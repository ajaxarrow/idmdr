<script setup lang="ts">
  import {repositories} from "../../../data/repository.ts";
  import {useSectorsStore} from "../stores/sectors.store.ts";
  import {Repository} from "../../../interfaces/repository.interface.ts";
  import {PhInfo, PhX} from "@phosphor-icons/vue";
  import {onMounted, onUnmounted} from "vue";
  import {useMapStore} from "../../map/stores/map.store.ts";
  const {selectedSector, removeSelectedSector, title} = useSectorsStore();
  const {resetToDefault} = useMapStore();

  const getRepositoriesBySector = (sector: string): Repository[] | null => {
    const foundRepositories = repositories.filter(repository => repository.sectors?.includes(sector));
    return foundRepositories.length > 0 ? foundRepositories : null;
  }

  onMounted(() => {
    removeSelectedSector();
  })

  onUnmounted(() => {
    removeSelectedSector();
  })



</script>

<template>
  <VSheet class="sector-details-sidebar ma-4" v-if="selectedSector">
    <VRow justify="space-between" align="center" class="ma-0 pa-4">
      <p class="sidebar-title">{{title}}</p>
      <PhX color="#C83246" size="24" weight="bold" class="cursor-pointer" @click="resetToDefault"/>
    </VRow>
    <div class="">
      <VImg
          rounded="lg"
          class="mx-auto"
          :cover="true"
          height="174"
          width="328"
          :src="selectedSector.image ? selectedSector.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
      />
      <div class="pa-4 scrollable-container">
        <p class="sector-title">{{selectedSector.title}}</p>
        <p class="sector-description">{{selectedSector.description}}</p>
        <div class="my-3">
          <p class="section-title mb-2">Repositories</p>
          <RouterLink
              class="text-decoration-none"
              v-if="getRepositoriesBySector(selectedSector.slug)"
              v-for="repository in getRepositoriesBySector(selectedSector.slug)"
              :to="{name: 'repository-data', params: { slug: repository.slug  }}">
            <div
                class="d-flex align-center my-1 cursor-pointer"
            >
              <VImg
                  style="border-radius: 8px"
                  cover
                  height="40px"
                  width="40px"
                  :src="repository.image ? <string>repository.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
              />
              <div class="ml-2">
                <p class="default">{{ repository.title }}</p>
              </div>
            </div>
          </RouterLink>
          <p v-else class="my-1  d-flex align-center">
            <PhInfo size="19" class="mr-1 mb-1"/>  No repositories found
          </p>
        </div>
        <div class="my-3">
          <p class="section-title mb-2">Tags</p>
          <VChip
              v-for="tag in selectedSector.tags"
              class="tag-chips my-1 mr-1"
              variant="outlined"
              :key="tag"
              :value="tag">
            {{tag}}
          </VChip>
        </div>
      </div>


    </div>
  </VSheet>
</template>

<style scoped>
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
<script setup lang="ts">
import {Repository} from "../../../../interfaces/repository.interface.ts";
import {PhX} from "@phosphor-icons/vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useMapStore} from "../../stores/map.store.ts";
import {useRepositoryServices} from "../../../repository/services/repository.services.ts";
import {useRepositoryStore} from "../../../repository/stores/repository.store.ts";
const {selectedRepository, removeSelectedRepository} = useRepositoryStore();
const {resetToDefault} = useMapStore();
const {fetchRepositoriesByUser} = useRepositoryServices()


const pageLoading = ref(false);
const allUserRepo = ref<Repository[]>([])
const isMember = ref(false)
const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)
const scrollableContainer = ref<HTMLElement | null>(null);
// const scrollToTop = () => {
//   if (scrollableContainer.value) {
//     if ("scrollTo" in scrollableContainer.value) {
//       scrollableContainer.value.scrollTo({top: 0, behavior: 'smooth'});
//     }
//   }
// };

const isSlugInRepoList = (organization: Repository | null | undefined, orgList: Repository[]) => {
  return orgList.some(org => org.uid === organization?.uid);
};

// const fetchMoreRepositories = async () => {
//   const data = await fetchRepositoriesByOrganization(
//       selectedOrganization.value?.slug as string,
//       false,
//       5,
//       lastItemValue.value
//   );
//   repositoryData.value = [...repositoryData.value, ...data];
//   lastItemValue.value = lastItemValue.value + 1;
//   if(data.length === 0){
//     reachEnd.value = true
//   }
// }

watch(() => selectedRepository.value, async () => {
  observerReady.value = false
  pageLoading.value = true;
  if(isSlugInRepoList(selectedRepository.value, allUserRepo.value)){
    isMember.value = true
  } else {
    isMember.value = false
  }
  lastItemValue.value = 1;
  reachEnd.value = false
  // await fetchMoreRepositories()
  observerReady.value = true
  pageLoading.value = false;
})



onMounted(async () => {
  removeSelectedRepository()
  allUserRepo.value = await fetchRepositoriesByUser();
})

onUnmounted(() => {
  removeSelectedRepository()
  observerReady.value = false
})

</script>

<template>
  <VSheet class="sector-details-sidebar ma-4" v-if="selectedRepository">
    <VRow justify="space-between" align="center" class="ma-0 pa-4" style="flex: none;">
      <p class="sidebar-title">Project</p>
      <PhX color="#C83246" size="24" weight="bold" class="cursor-pointer" @click="resetToDefault('Repository')"/>
    </VRow>
    <div class="sidebar-content-wrapper">
      <VImg
          rounded="lg"
          class="mx-auto"
          :cover="true"
          height="174"
          width="328"
          :src="selectedRepository.image as string"
          style="flex: none;"
      />
      <div ref="scrollableContainer" class="pa-4 scrollable-container">
        <VTooltip location="bottom">
          <template v-slot:activator="{ props }">
            <RouterLink v-bind="props" :to="{name: 'repository-data', params: { slug: selectedRepository.slug  }}" class="text-decoration-none ">
              <p class="sector-title">{{selectedRepository.title}}</p>
            </RouterLink>
          </template>
          <span>Visit Project</span>
        </VTooltip>
        <p class="sector-description ">{{selectedRepository.location}}</p>
        <div class="my-3">
          <p class="section-title mb-2">Tags</p>
          <RouterLink
              v-for="tag in selectedRepository.tags"
              :key="tag"
              :to="{
                  name: 'repositories',
                  query: { tag: tag }
                }">
            <VChip
                class="tag-chips my-1 mr-1 chip"
                variant="outlined"
                :value="tag">
              {{tag}}
            </VChip>
          </RouterLink>
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  color: #000 !important;
  font-size: 20px;
  font-weight: 700;
}

.sector-title:hover, .section-title:hover{
  text-decoration: underline;
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

.sidebar-content-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100% - 174px); /* Subtract VImg height */
}

.scrollable-container {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>
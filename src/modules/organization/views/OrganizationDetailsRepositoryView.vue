<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {PhFaders, PhHardDrives, PhMagnifyingGlass, PhPlus, PhX} from "@phosphor-icons/vue";
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import {useTags} from "../../repository/composables/useTags.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import FilterRepositoryDialog from "../../repository/components/FilterRepositoryDialog.vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import Observer from "../../../core/components/Observer.vue";
import {useScroll} from "../../../core/composables/useScroll.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const {scrollTop} = useScroll()
const {route} = useRouting()
const {fetchOrganizationData} = useOrganizationServices();

const {tags, selectedTags} = useTags();
const {filterRepositoriesBySearchQuery, filterRepositoriesbyTags,  fetchRepositoriesByOrganization} = useRepositoryServices();

const path = ref('organizations')
const searchQuery = ref('');
const repositoryData = ref<Repository[]>([]);
const repositoryItems = ref<Repository[]>([]);
const searchedRepositories = ref<Repository[]>([]);
const organization = ref<Organization | null>();
const currentTags = ref<string[]>([]);
const pageLoading = ref(false)
const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)

const filterRepositoryCallback = (currentSelectedTags: string[]) => {
  const newTags = currentSelectedTags.filter(tag =>
      !selectedTags.value.includes(tag) && !currentTags.value.includes(tag)
  );
  selectedTags.value = [...selectedTags.value, ...newTags];
  currentTags.value = [...currentTags.value, ...newTags];
};


watch(() => searchQuery.value, async () => {
  searchedRepositories.value = await filterRepositoriesBySearchQuery(searchQuery.value, repositoryData.value);
});

watch(() => selectedTags.value, () => {
  searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
})

watch(() => selectedTags.value, (newVal) => {
  if (newVal.includes('All Repositories')){
    selectedTags.value = [];
  }
})

const fetchMoreRepositories = async () => {
  const data = await fetchRepositoriesByOrganization(
      route.params.slug as string,
      path.value !== 'organizations',
      10,
      lastItemValue.value
  );
  repositoryData.value = [...repositoryData.value, ...data];
  searchedRepositories.value = repositoryData.value
  lastItemValue.value = lastItemValue.value + 1
  if(data.length === 0){
    reachEnd.value = true
  }
}

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


onMounted(async () => {
  pageLoading.value = true
  currentTags.value = tags.value.splice(0, 6)
  path.value = getFirstPath(<string>route.path)
  organization.value = await fetchOrganizationData(route.params.slug as string);
  await fetchMoreRepositories();
  repositoryItems.value = repositoryData.value;
  searchedRepositories.value = repositoryData.value;
  observerReady.value = true
  if(route.query.tag){
    selectedTags.value.push(<string>route.query.tag);
    searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
  }
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
  selectedTags.value = [];
  observerReady.value = false;
})

</script>

<template>
  <OrganizationDetailsLayout
    :organization="organization"
    activeTab="projects">
    <div v-if="organization" class="pa-6">
      <VTextField
          v-model="searchQuery"
          hide-details
          variant="outlined"
          rounded="xl"
          density="comfortable"
          color="primary"
          base-color="gs60"
      >
        <template v-slot:prepend-inner>
          <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
        </template>
        <template v-slot:label>
          <p class="text-gs20">Search projects by title, keyword, tags.</p>
        </template>
      </VTextField>
      <VRow class="ma-0 mt-2" align="center">
        <VChipGroup
            selected-class="text-primary"
            v-model="selectedTags"
            multiple
            column
        >
          <VChip
              :class="{
                'text-primary outlined-chip' : selectedTags.length === 0
              }"
              class="tag d-flex align-center mr-2 tag-chips chip"
              variant="outlined"
              key="All Repositories"
              value="All Repositories">
            All Projects
            <PhX v-if="selectedTags.length === 0" size="12" class="ml-1"/>
          </VChip>
          <VChip
              v-for="(tag, index) in currentTags"
              class="tag chip"
              :class="{
                'd-flex align-center mr-2 tag-chips' : !selectedTags.includes(tag)
              }"
              variant="outlined"
              :key="index"
              :value="tag">
            {{tag}}
            <PhX v-if="selectedTags.includes(tag)" size="12" class="ml-1"/>
          </VChip>
        </VChipGroup>
        <FilterRepositoryDialog
            :tags="tags"
            :selectedTags="selectedTags"
            @callback="filterRepositoryCallback"
        >
          <VChip
              class="tag d-flex align-center mr-2 show-chip chip"
              variant="outlined"
              key="Toggle Chips">
            More Filtering Options
            <PhFaders size="12" class="ml-1"/>
          </VChip>
        </FilterRepositoryDialog>
      </VRow>
      <VRow justify="space-between" align="center" class="ma-0 my-6">
        <p class="text-title d-flex align-center">
          <PhHardDrives size="24" class="mr-1"/>
          Browse Projects by {{organization.name}} ({{organization.acronym}})
        </p>
        <p class="d-flex align-center">
          <VBtnPrimaryFilled :to="{ name: 'new-repository-my'}" height="40px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
            <PhPlus size="16" class="mr-2"/>
            New Project
          </VBtnPrimaryFilled>
        </p>
      </VRow>
      <div v-if="pageLoading" class="loading-state-container">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <div v-else>
        <div v-if="searchedRepositories.length > 0">
          <RepositoryItem
              v-if="searchedRepositories.length > 0"
              v-for="repository in searchedRepositories"
              :repository="repository"
          />
          <div class="pa-3" v-if="reachEnd">
            <p class="text-center">
              All {{organization.acronym}}'s projects are loaded!
              <span
                  @click="scrollTop"
                  class="text-bs50 cursor-pointer scroll-top-link"
              >
                  Jump back to the top?
                </span>
            </p>
          </div>
          <div class="pa-3" v-else>
            <Observer @intersect="fetchMoreRepositories" v-if="observerReady"/>
          </div>
        </div>
        <EmptyStateInfo
            v-else
            header="No Projects Found"
            description="We couldn't find any projects at the moment."
            :isCallbackNeeded="searchQuery !== ''"
            @callback="searchQuery = ''"
        />
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>


</style>
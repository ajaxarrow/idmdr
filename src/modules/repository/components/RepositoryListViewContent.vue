<script setup lang="ts">
import {
  PhCaretDown,
  PhFaders,
  PhHardDrives,
  PhMagnifyingGlass,
  PhPlus,
  PhX
} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import {useTags} from "../composables/useTags.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import Observer from "../../../core/components/Observer.vue";
import FilterRepositoryDialog from "../components/FilterRepositoryDialog.vue";
import {useScroll} from "../../../core/composables/useScroll.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const props = defineProps({
  forOrganization: {
    type: Boolean,
    default: false
  },
  forUser: {
    type: Boolean,
    default: false
  },
})

const {user, userData} = useUserStore();
const {tags, selectedTags, fetchTags} = useTags();
const {fetchRepositoriesWithPagination, filterRepositoriesbyTags, filterRepositoriesBySearchQuery, fetchRepositoriesByUserWithPagination} = useRepositoryServices();
const {scrollTop} = useScroll()
const searchQuery = ref('');
const repositoryItems = ref<Repository[]>([]);
const repositoryData = ref<Repository[]>([]);
const searchedRepositories = ref<Repository[]>([]);
const currentTags = ref<string[]>([]);
const {isSmall, isTablet} = useScreenStore();
const {route} = useRouting();
const path = ref('repositories')
const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)
const pageLoading = ref(false)

const computedTitle = computed(() => {
  return path.value == 'ip-technologies' ?  'IP technologies' : route.path === '/e-library' ? 'E-Library' : 'Projects'
});


const filterRepositoryCallback = (currentSelectedTags: string[]) => {
  selectedTags.value = [...new Set([...selectedTags.value, ...currentSelectedTags])];
  currentTags.value = [...new Set([...currentTags.value, ...currentSelectedTags])];
};


watch(() => searchQuery.value, async () => {
  searchedRepositories.value = await filterRepositoriesBySearchQuery(searchQuery.value, repositoryData.value);
});

watch(() => selectedTags.value, () => {
  searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
})

watch(() => selectedTags.value, async (newVal) => {
  if (newVal.includes('All Repositories')){
    selectedTags.value = [];
    lastItemValue.value = 1
    await fetchMoreRepositories()
  }
})

const fetchMoreRepositories = async () => {
  let data = props.forUser ? await fetchRepositoriesByUserWithPagination(lastItemValue.value) : await fetchRepositoriesWithPagination(lastItemValue.value, path.value !== 'repositories');
  if(route.path === '/e-library'){
    data = (await fetchRepositoriesWithPagination(lastItemValue.value, false)).filter(repo => repo.type == 'Document Repository');
  }
  repositoryData.value = [...repositoryData.value, ...data];
  repositoryItems.value = repositoryData.value
  searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
  lastItemValue.value = lastItemValue.value + 1
  if(data.length === 0){
    reachEnd.value = true
  }
}

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const init = async () => {
  reachEnd.value = false
  const tagsData = tags.value
  lastItemValue.value = 1
  path.value = getFirstPath(<string>route.path)
  pageLoading.value = true
  fetchTags();
  currentTags.value = tagsData.splice(0, 6)
  let fetchedData = props.forUser ? await fetchRepositoriesByUserWithPagination(lastItemValue.value) : await fetchRepositoriesWithPagination(lastItemValue.value, path.value !== 'repositories');
  if(route.path === '/e-library'){
    fetchedData = (await fetchRepositoriesWithPagination(lastItemValue.value, false)).filter(repo => repo.type == 'Document Repository');
  }
  repositoryData.value = [...fetchedData];
  repositoryItems.value = repositoryData.value;
  lastItemValue.value = lastItemValue.value + 1
  observerReady.value = true
  searchedRepositories.value = repositoryData.value;
  if(route.query.tag){
    selectedTags.value.push(<string>route.query.tag);
    searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
  }
  pageLoading.value = false
}


watch(() => route.path, async () => {
  searchQuery.value = '';
  selectedTags.value = [];
  await init();
})

onMounted(async () => {
  await init();
})

onUnmounted(() => {
  searchQuery.value = '';
  selectedTags.value = [];
  observerReady.value = false
  lastItemValue.value = 1

})

</script>

<template>
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-heading d-flex align-center">
              <span v-if="forUser" class="mr-1"> My </span>  {{computedTitle}}
            </p>
            <p class="text-subtitle">
              Create and manage
              {{path == 'ip-technologies' ?  'IP technologies' : route.path === '/e-library' ? 'documents' : 'projects'}}
              within your organization!
            </p>
          </div>
          <div v-if="user && userData.is_approved">
            <VBtnPrimaryFilled :to="{ name: forUser ? 'new-repository-my' : 'new-repository'}" v-if="isSmall || isTablet" icon >
              <PhPlus size="16"/>
            </VBtnPrimaryFilled>
            <VBtnPrimaryFilled :to="{ name: forUser ? 'new-repository-my' : 'new-repository'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
              <PhPlus size="16" class="mr-2"/>
              New {{path == 'ip-technologies' ?  'IP Technology' : route.path === '/e-library' ? 'Document' : 'Project'}}
            </VBtnPrimaryFilled>
          </div>
        </VRow>
      </div>
      <VDivider/>
      <div class="pa-6">
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
            <p class="text-gs20">Search {{path == 'ip-technologies' ?  'IP technologies' : route.path === '/e-library' ? 'documents' : 'projects'}} by title, keyword, tags.</p>
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
              All {{computedTitle}}
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
            Browse Latest {{computedTitle}}
          </p>
          <p class="d-flex align-center">
            Latest
            <PhCaretDown weight="fill" class="ml-1"/>
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
            <RepositoryItem v-for="repository in searchedRepositories" :repository="repository"/>
            <div class="pa-3" v-if="reachEnd">
              <p class="text-center">
                All {{path == 'ip-technologies' ?  'IP technologies' : route.path === '/e-library' ? 'documents' : 'projects'}} are loaded!
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
              :header="`No ${computedTitle} Found`"
              description="We couldn't find any projects at the moment."
              :isCallbackNeeded="searchQuery !== ''"
              @callback="searchQuery = ''"
          />
        </div>
      </div>
    </div>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -460px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

:deep(.v-field__outline){
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}
</style>
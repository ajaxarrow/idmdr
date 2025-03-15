<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {
  PhCaretDown,
  PhFaders,
  PhHardDrives,
  PhMagnifyingGlass,
  PhPlus,
  PhX
} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import {useTags} from "../composables/useTags.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import Observer from "../../../core/components/Observer.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import FilterRepositoryDialog from "../components/FilterRepositoryDialog.vue";
import {useScroll} from "../../../core/composables/useScroll.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const {scrollTop} = useScroll()
const {setSnackbarMessage} = useSnackbarStore()
const {user} = useUserStore();
const {tags, selectedTags, fetchTags} = useTags();
const {fetchRepositoriesByUserWithPagination, filterRepositoriesbyTags, filterRepositoriesBySearchQuery} = useRepositoryServices();
const searchQuery = ref('');
const repositoryItems = ref<Repository[]>([]);
const repositoryData = ref<Repository[]>([]);
const searchedRepositories = ref<Repository[]>([]);
const currentTags = ref<string[]>([]);
const {isSmall, isTablet} = useScreenStore();
const {route} = useRouting();

const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)
const pageLoading = ref(false)

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

watch(() => selectedTags.value, async (newVal) => {
  if (newVal.includes('All Repositories')){
    selectedTags.value = [];
    lastItemValue.value = 1
    await fetchMoreRepositories()
  }
})

const fetchMoreRepositories = async () => {
  const data = await fetchRepositoriesByUserWithPagination(lastItemValue.value);
  repositoryData.value = [...repositoryData.value, ...data];
  searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
  lastItemValue.value = lastItemValue.value + 1
  if(data.length === 0){
    reachEnd.value = true
  }
}

onMounted(async () => {
  fetchTags();
  currentTags.value = tags.value.splice(0, 6)
  pageLoading.value = true
  const fetchedData = await fetchRepositoriesByUserWithPagination(lastItemValue.value);
  repositoryData.value = [...fetchedData];
  repositoryItems.value = repositoryData.value;
  lastItemValue.value = lastItemValue.value + 1
  observerReady.value = true
  searchedRepositories.value = repositoryData.value;
  if(route.query.tag){
    selectedTags.value.push(<string>route.query.tag);
    searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
  }
  await setSnackbarMessage()
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
  selectedTags.value = [];
  observerReady.value = false
})

</script>

<template>s
  <MainLayout title="My Projects">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-heading d-flex align-center">
              My Projects
            </p>
            <p class="text-subtitle">Create and manage projects within your organization!</p>
          </div>
          <div v-if="user">
            <VBtnPrimaryFilled :to="{ name: 'new-repository-my'}" v-if="isSmall || isTablet" icon >
              <PhPlus size="16"/>
            </VBtnPrimaryFilled>
            <VBtnPrimaryFilled :to="{ name: 'new-repository-my'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
              <PhPlus size="16" class="mr-2"/>
              New Project
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
            Browse Latest Projects
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
                All projects are loaded!
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
    </div>
  </MainLayout>
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
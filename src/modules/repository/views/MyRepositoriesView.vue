<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhCaretDown, PhCaretUp, PhHardDrives, PhInfo, PhMagnifyingGlass, PhPlus, PhX} from "@phosphor-icons/vue";
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

const {setSnackbarMessage} = useSnackbarStore()
const {user} = useUserStore();
const {tags, selectedTags, fetchTags} = useTags();
const {fetchRepositoriesByUserWithPagination, filterRepositoriesbyTags, filterRepositoriesBySearchQuery, loading} = useRepositoryServices();
const searchQuery = ref('');
const repositoryItems = ref<Repository[]>([]);
const repositoryData = ref<Repository[]>([]);
const searchedRepositories = ref<Repository[]>([]);
const {isSmall, isTablet} = useScreenStore();
const showMoreChips = ref(false);
const {route} = useRouting();

const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)

const toggleShowMoreChips = () => {
  showMoreChips.value =!showMoreChips.value;
}

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
  const data = await fetchRepositoriesByUserWithPagination(lastItemValue.value);
  repositoryData.value = [...repositoryData.value, ...data];
  lastItemValue.value = lastItemValue.value + 1
  if(data.length === 0){
    reachEnd.value = true
  }
}

onMounted(async () => {
  fetchTags();
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
})

onUnmounted(() => {
  searchQuery.value = '';
  selectedTags.value = [];
  observerReady.value = false
})

</script>

<template>s
  <MainLayout title="Repositories">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-heading d-flex align-center">
              My Repositories
            </p>
            <p class="text-subtitle">Create and manage repositories within your organization!</p>
          </div>
          <div v-if="user">
            <VBtnPrimaryFilled :to="{ name: 'new-repository-my'}" v-if="isSmall || isTablet" icon >
              <PhPlus size="16"/>
            </VBtnPrimaryFilled>
            <VBtnPrimaryFilled :to="{ name: 'new-repository-my'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
              <PhPlus size="16" class="mr-2"/>
              New Repository
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
            <p class="text-gs20">Search repositories by title, keyword, tags.</p>
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
              All Repositories
              <PhX v-if="selectedTags.length === 0" size="12" class="ml-1"/>
            </VChip>
            <VChip
                v-for="(tag, index) in tags.slice(0, showMoreChips? tags.length : 5)"
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
          <VChip
              @click="toggleShowMoreChips"
              class="tag d-flex align-center mr-2 show-chip chip"
              variant="outlined"
              key="Toggle Chips">
            {{showMoreChips ? 'Show Less' : 'Show More'}}
            <PhCaretUp v-if="showMoreChips" size="12" class="ml-1"/>
            <PhCaretDown v-else size="12" class="ml-1"/>
          </VChip>
        </VRow>
        <VRow justify="space-between" align="center" class="ma-0 my-6">
          <p class="text-title d-flex align-center">
            <PhHardDrives size="24" class="mr-1"/>
            Browse Latest Repositories
          </p>
          <p class="d-flex align-center">
            Latest
            <PhCaretDown weight="fill" class="ml-1"/>
          </p>
        </VRow>
        <div v-if="loading" class="loading-state-container">
          <VProgressCircular
              indeterminate
              color="#23668b"
          ></VProgressCircular>
        </div>
        <div v-else>
          <div v-if="searchedRepositories.length > 0">
            <RepositoryItem v-for="repository in searchedRepositories" :repository="repository"/>
            <div class="pa-3" v-if="reachEnd">
              <p class="text-center">No more repositories to fetch!</p>
            </div>
            <div class="pa-3" v-else>
              <Observer @intersect="fetchMoreRepositories" v-if="observerReady"/>
            </div>
          </div>
          <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Repositories Found</p>
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
<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {PhCaretDown, PhCaretUp, PhHardDrives, PhInfo, PhMagnifyingGlass, PhX} from "@phosphor-icons/vue";
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import {useTags} from "../../repository/composables/useTags.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
const {route} = useRouting()
const {organization, setOrganizationData} = useOrganizationStore();


const {tags, selectedTags, fetchTags} = useTags();
const {filterRepositoriesBySearchQuery, filterRepositoriesbyTags,  fetchRepositoriesByOrganization} = useRepositoryServices();
const searchQuery = ref('');
const repositoryData = ref<Repository[]>([]);
const repositoryItems = ref<Repository[]>([]);
const searchedRepositories = ref([]);

const showMoreChips = ref(false);

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


onMounted(async () => {
  setOrganizationData(route.params.slug as string);
  repositoryItems.value = fetchRepositoriesByOrganization(route.params.slug as string);
  fetchTags();
  repositoryData.value = fetchRepositoriesByOrganization(route.params.slug as string);
  fetchTags();
  searchedRepositories.value = repositoryData.value;
  if(route.query.tag){
    selectedTags.value.push(<string>route.query.tag);
    searchedRepositories.value = filterRepositoriesbyTags(repositoryItems.value, repositoryData.value, selectedTags.value);
  }
})

onUnmounted(() => {
  searchQuery.value = '';
  selectedTags.value = [];
})

</script>

<template>
  <OrganizationDetailsLayout :organization="organization" activeTab="repositories">
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
          Browse Repositories by {{organization.name}} ({{organization.acronym}})
        </p>
        <p class="d-flex align-center">
          Latest
          <PhCaretDown weight="fill" class="ml-1"/>
        </p>
      </VRow>
      <p v-if="repositoryItems.length == 0" class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Repositories Found</p>
      <div v-else>
        <RepositoryItem
            v-if="searchedRepositories.length > 0"
            v-for="repository in searchedRepositories"
            :repository="repository"
        />
        <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Repositories Found</p>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>


</style>
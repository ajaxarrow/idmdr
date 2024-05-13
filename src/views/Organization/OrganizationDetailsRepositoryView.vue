<script setup lang="ts">
import OrganizationDetailsLayout from "../../layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../composables/useRouting.ts";
import {useOrganizationStore} from "../../stores/organizationStore.ts";
import {onMounted, ref, watch} from "vue";
import {useRepositoryStore} from "../../stores/repositoryStore.ts";
import {PhCaretDown, PhCaretUp, PhHardDrives, PhInfo, PhMagnifyingGlass, PhX} from "@phosphor-icons/vue";
import RepositoryItem from "../../components/Dashboard/RepositoryItem.vue";
import {useTagsStore} from "../../stores/tagsStore.ts";
import {useRepositoriesStore} from "../../stores/repositoriesStore.ts";
const {route} = useRouting()
const {organization, setOrganizationData} = useOrganizationStore();
const {repositoryItems, setRepositoryItems} = useRepositoryStore();

const {tags, selectedTags, fetchTags} = useTagsStore();
const {filterRepositoriesbyTags, filterRepositoriesBySearchQuery, searchQuery, searchedRepositories, repositoryData, setRepositoryData} = useRepositoriesStore();

const showMoreChips = ref(false);

const toggleShowMoreChips = () => {
  showMoreChips.value =!showMoreChips.value;
}

watch(() => searchQuery.value, () => {
  filterRepositoriesBySearchQuery()
});

watch(() => selectedTags.value, () => {
  filterRepositoriesbyTags(repositoryItems.value);
})

watch(() => selectedTags.value, (newVal) => {
  if (newVal.includes('All Repositories')){
    selectedTags.value = [];
  }
})


onMounted(() => {
  setOrganizationData(route.params.slug as string);
  setRepositoryItems(route.params.slug as string);
  fetchTags();
  setRepositoryData(repositoryItems.value)
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
              class="tag d-flex align-center mr-2 tag-chips "
              variant="outlined"
              key="All Repositories"
              value="All Repositories">
            All Repositories
            <PhX v-if="selectedTags.length === 0" size="12" class="ml-1"/>
          </VChip>
          <VChip
              v-for="(tag, index) in tags.slice(0, showMoreChips? tags.length : 5)"
              class="tag"
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
            class="tag d-flex align-center mr-2 show-chip "
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
      <VRow v-if="repositoryItems.length == 0" class="ma-0 mb-10" justify="center" align="center">
          <PhInfo size="20" class="mb-0 mx-1"/>
          <p class="text-h6">No Repositories Found</p>
      </VRow>
      <RepositoryItem v-for="repository in searchedRepositories" :repository="repository" />
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.tag-chips{
  background-color: #fafafa;
  border: 1px solid #e4e4e4;
}

.tag{
  font-size: 12px;
}

.outlined-chip{
  border: 1px solid #3291c7;
}

.show-chip{
  background-color: #f4fbfd;
  border: 1px solid #e4e4e4;
}

</style>
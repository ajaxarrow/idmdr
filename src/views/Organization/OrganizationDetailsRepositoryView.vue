<script setup lang="ts">
import OrganizationDetailsLayout from "../../layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../composables/useRouting.ts";
import {useOrganizationStore} from "../../stores/organizationStore.ts";
import {onMounted, ref} from "vue";
import {useRepositoryStore} from "../../stores/repositoryStore.ts";
import {PhCaretDown, PhHardDrives, PhInfo, PhMagnifyingGlass, PhX} from "@phosphor-icons/vue";
import RepositoryItem from "../../components/Dashboard/RepositoryItem.vue";
const {route} = useRouting()
const {organization, setOrganizationData} = useOrganizationStore();
const {repositoryItems, setRepositoryItems} = useRepositoryStore();

const selectedTags = ref(['All Repositories']);
const tags = [
  {
    name: 'All Repositories'
  },
  {
    name: 'Agriculture',
  },
  {
    name: 'Plantation',
  },
  {
    name: 'Forestry',
  },
  {
    name: 'Agrifishery',
  },
]

onMounted(() => {
  setOrganizationData(route.params.slug as string);
  setRepositoryItems(route.params.slug as string);
})
</script>

<template>
  <OrganizationDetailsLayout :organization="organization" activeTab="repositories">
    <div v-if="organization" class="pa-6">
      <VTextField
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
      <VRow class="ma-0 mt-2">
        <VChipGroup
            selected-class="text-primary"
            v-model="selectedTags"
            multiple
            column
        >
          <VChip
              v-for="tag in tags"
              class="tag"
              :class="{'d-flex align-center mr-2 tag-chips': !selectedTags.includes(tag.name)}"
              variant="outlined"
              :key="tag.name"
              :value="tag.name">
            {{tag.name}}
            <PhX v-if="selectedTags.includes(tag.name)" size="12" class="ml-1"/>
          </VChip>
        </VChipGroup>
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
      <RepositoryItem v-else v-for="repository in repositoryItems" :repository="repository"/>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>

</style>
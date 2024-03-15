<script setup lang="ts">
  import MainLayout from "../../layouts/MainLayout.vue";
  import {PhCaretDown, PhHardDrives, PhMagnifyingGlass, PhPlus, PhX} from "@phosphor-icons/vue";
  import {useScreenStore} from "../../stores/screenSizeStore.ts";
  import {ref} from "vue";
  import {repositories} from "../../data/repository.ts";
  import RepositoryItem from "../../components/Dashboard/RepositoryItem.vue";

  const {isSmall, isTablet} = useScreenStore();
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
</script>

<template>
  <MainLayout title="Repositories">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-heading d-flex align-center">
              Repositories
            </p>
            <p class="text-subtitle">Create and manage repositories within your organization!</p>
          </div>
          <VBtnPrimaryFilled :to="{ name: 'new-repository'}" v-if="isSmall || isTablet" icon >
            <PhPlus size="20"/>
          </VBtnPrimaryFilled>
          <VBtnPrimaryFilled :to="{ name: 'new-repository'}" v-else width="201px" height="45px" rounded="lg" class="satoshi-md">
            <PhPlus size="20" class="mr-2"/>
            Add Repository
          </VBtnPrimaryFilled>
        </VRow>
      </div>
      <VDivider/>
      <div class="pa-6">
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
            Browse Latest Repositories
          </p>
          <p class="d-flex align-center">
            See All
            <PhCaretDown weight="fill" class="ml-1"/>
          </p>
        </VRow>
        <RepositoryItem v-for="repository in repositories" :repository="repository" />
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

:deep .v-field__outline {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

.tag-chips{
  background-color: #fafafa;
  border: 1px solid #e4e4e4;
}

.tag{
  font-size: 12px;
}



</style>
<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import {PhPlus} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {usePageSizeHelper} from "../../../core/composables/usePageSizeHelper.ts";

const { isSmall, isTablet } = useScreenStore();
const { fetchAllRepositories, fetchRepositoryIDsByUser } = useRepositoryServices();
const {generatePageSizeIncrements} = usePageSizeHelper()

const repositories = ref<Repository[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedPriorityLevel = ref('');


const priorityLevelOptions = [
  { title: 'All Priorities', value: '' },
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
];

// Table headers
const headers = ref([
  { title: 'Project', key: 'title', sortable: true },
  { title: 'Priority', key: 'priority_level', sortable: true },
  { title: 'Start Date', key: 'start_date', sortable: true },
  { title: 'End Date', key: 'end_date', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]);



watch([search, selectedPriorityLevel, itemsPerPage], () => {
  page.value = 1;
  loadRepositories();
  updateTotalCount()
});




const loadRepositories = async () => {
  loading.value = true;
  try {
    const data = await fetchAllRepositories(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedPriorityLevel.value
    );
    repositories.value = data;
  } catch (error) {
    console.error('Failed to load repositories:', error);
  } finally {
    loading.value = false;
  }
};


const handlePageChange = async (newPage: number) => {
  page.value = newPage;
  await loadRepositories();
};



const getInitials = (name: string): string => {
  return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const getPriorityColor = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'yellow',
  };
  return priorityMap[priority.toLowerCase()] || 'grey';
};

const updateTotalCount = async () => {
  try {
    // Pass search and priority level to get accurate count
    totalItems.value = (await fetchRepositoryIDsByUser(200, false, search.value, selectedPriorityLevel.value)).length;
  } catch (error) {
    console.error('Failed to get total count:', error);
    totalItems.value = 0;
  }
};

onMounted(async () => {
  await updateTotalCount();
  await loadRepositories();
});
</script>

<template>
  <div class="relative-container circle-quarter" style="height: 100%">
    <div class="pa-6 relative-container" style="z-index: 20">
      <VRow justify="space-between" align="center" class="ma-0">
        <div>
          <p class="text-heading d-flex align-center">All Projects</p>
          <p class="text-subtitle">Create and manage all projects across NOMCAARRD</p>
        </div>
        <div>
          <VBtnPrimaryFilled :to="{ name: 'new-repository' }" v-if="isSmall || isTablet" icon>
            <PhPlus size="16" />
          </VBtnPrimaryFilled>
          <VBtnPrimaryFilled
              :to="{ name: 'new-repository' }"
              v-else
              height="45px"
              rounded="lg"
              class="satoshi-md"
              style="font-size: 14px !important"
          >
            <PhPlus size="16" class="mr-2" />
            New Projects
          </VBtnPrimaryFilled>
        </div>
      </VRow>
    </div>
    <VDivider />
    <div class="pa-6">
      <VContainer fluid>
        <VSheet class="datatable-container" >
          <VCardTitle class="d-flex align-center flex-wrap pt-4 px-4">
            <VTextField
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search..."
                hide-details
                density="compact"
                class="me-3 mb-3"
                style="max-width: 300px"
                variant="outlined"
                rounded="md"
                color="primary"
                base-color="gs60"
            />
            <div class="flex-grow-1"></div>
            <VSelect
                v-model="selectedPriorityLevel"
                :items="priorityLevelOptions"
                label="Priority"
                hide-details
                density="compact"
                class="me-3 mb-3"
                variant="outlined"
                rounded="md"
                color="primary"
                base-color="gs60"
                style="max-width: 150px"
            />
          </VCardTitle>

          <VDataTableServer
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="repositories"
              :items-per-page="itemsPerPage"
              :loading="loading"
              :items-length="totalItems"
              :items-per-page-options="generatePageSizeIncrements(totalItems)"
              @update:page="handlePageChange"
          >
            <template v-slot:item.title="{ item }">
              <div class="d-flex align-center" style="max-width: 400px;">
                <VAvatar
                    size="36"
                    class="me-2"
                    color="primary"
                    variant="tonal"
                    v-if="!item.image"
                >
                  {{ getInitials(item.title) }}
                </VAvatar>
                <VAvatar
                    size="36"
                    class="me-2"
                    v-else
                >
                  <VImg :src="item.image" alt="Project" />
                </VAvatar>
                <div>
                  <p class="font-weight-medium mb-0">{{ item.title }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">{{ formatDate(item.updated_at) }}</p>
                </div>
              </div>
            </template>
            <template v-slot:item.priority_level="{ item }">
              <VChip
                  :color="getPriorityColor(item.priority_level)"
                  size="small"
                  class="text-capitalize"
              >
                {{ item.priority_level }}
              </VChip>
            </template>
            <template v-slot:item.actions="{ item }">
              <VBtn icon size="small" variant="text" color="primary" :to="`/repository/${item.slug}`">
                <VIcon size="20">mdi-eye</VIcon>
              </VBtn>
              <VBtn icon size="small" variant="text" color="warning" :to="`/repository/${item.slug}/edit`">
                <VIcon size="20">mdi-pencil</VIcon>
              </VBtn>
              <VBtn icon size="small" variant="text" color="error">
                <VIcon size="20">mdi-delete</VIcon>
              </VBtn>
            </template>
            <template v-slot:no-data>
              <div class="d-flex flex-column align-center pa-6">
                <VIcon size="64" color="grey-lighten-1" icon="mdi-folder-open-outline" />
                <p class="text-h6 mt-4">No Projects Found</p>
                <p class="text-body-2 text-center text-medium-emphasis">
                  There are no projects matching your search criteria
                </p>
              </div>
            </template>
          </VDataTableServer>
        </VSheet>
      </VContainer>
    </div>
  </div>
</template>




<style scoped>
.circle-quarter::after {
  content: "";
  position: absolute;
  left: -209px;
  top: -460px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #def1fb;
  z-index: 1;
  opacity: 75%;
}

:deep(.v-field__outline){
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep(input::placeholder){
  color: #5F6061;
  opacity: 90%;
}

</style>
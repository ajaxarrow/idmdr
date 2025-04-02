<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue';
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import {PhPlus} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {usePageSizeHelper} from "../../../core/composables/usePageSizeHelper.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";

const { isSmall, isTablet } = useScreenStore();
const { fetchAllRepositories, fetchRepositoryIDsByUser } = useRepositoryServices();
const {fetchAllOrganizations} = useOrganizationServices();
const {generatePageSizeIncrements} = usePageSizeHelper();
const selectedOrganization = ref<string>('');

const repositories = ref<Repository[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedPriorityLevel = ref('');
const organizations = ref<any[]>([]);


const priorityLevelOptions = [
  { title: 'All Priorities', value: '' },
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
];



const headers = ref([
  { title: 'Project', key: 'title', sortable: true, visible: true },
  { title: 'Priority', key: 'priority_level', sortable: true, visible: true },
  { title: 'Start Date', key: 'start_date', sortable: true, visible: false },
  { title: 'End Date', key: 'end_date', sortable: true, visible: false },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));

const visibleHeaders = computed(() => {
  return headers.value.filter(header => selectedColumns.value.includes(header.key));
});

const updateColumnVisibility = (selectedKeys: string[]) => {
  headers.value.forEach(header => {
    header.visible = selectedKeys.includes(header.key);
  });
};

const isColumnVisible = (key: string) => {
  const column = headers.value.find(h => h.key === key);
  return column ? column.visible : false;
};


watch([search, selectedPriorityLevel, itemsPerPage, selectedOrganization], () => {
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
        selectedPriorityLevel.value,
        selectedOrganization.value
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
  organizations.value = [{ uid: '', name: 'All', acronym: '' }, ...(await fetchAllOrganizations(1, 1000))];
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
                v-model="selectedColumns"
                :items="headers"
                item-title="title"
                item-value="key"
                label="Filter Columns"
                multiple
                clearable
                chips
                density="compact"
                class="me-3 mb-3"
                variant="outlined"
                rounded="md"
                color="primary"
                base-color="gs60"
                style="max-width: 250px"
                hide-details
                @update:model-value="updateColumnVisibility"
            />
            <VSelect
                v-model="selectedOrganization"
                :items="organizations"
                :item-title="organization => organization.acronym ? `${organization.name} (${organization.acronym})` : organization.name"
                :item-value="organization => `${organization.uid}`"
                label="Organization"
                hide-details
                density="compact"
                class="me-3 mb-3"
                variant="outlined"
                rounded="md"
                color="primary"
                base-color="gs60"
                style="max-width: 250px"
            />
            <VSelect
                v-if="isColumnVisible('priority_level')"
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
              :headers="visibleHeaders"
              :items="repositories"
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
                  <VImg :src="item.image as string" alt="Project" />
                </VAvatar>
                <div>
                  <p class="font-weight-medium mb-0">{{ item.title }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">{{item.org_data?.name}}({{item.org_data?.acronym}}) | {{ formatDate(item.updated_at) }}</p>
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
              <VBtn icon size="small" variant="text" color="primary" :to="{ name: 'repository-data', params: { slug: item.slug }}">
                <VIcon size="20">mdi-eye</VIcon>
              </VBtn>
              <VBtn icon size="small" variant="text" color="warning" :to="{ name: 'edit-repository', params: { slug: item.slug }}">
                <VIcon size="20">mdi-pencil</VIcon>
              </VBtn>
              <VBtn icon size="small" variant="text" color="error">
                <VIcon size="20">mdi-delete</VIcon>
              </VBtn>
            </template>
            <template v-slot:no-data>
              <EmptyStateInfo
                  header="No Projects Found"
                  description="There are no projects matching your search criteria"
                  :isCallbackNeeded="search !== ''"
                  @callback="search = ''"
              />
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
<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue';
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import {
  PhPlus,
  PhCheck,
  PhX,
  PhPower,
  PhPencil,
  PhDotsThreeOutlineVertical,
  PhEye,
  PhGear,
  PhFunnel, // Added for filter icon
  PhMagnifyingGlass // Added for search icon
} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {usePageSizeHelper} from "../../../core/composables/usePageSizeHelper.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";

const {route} = useRouting();
const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore()
const { fetchAllRepositories, fetchRepositoryIDsByUser, manageRepositoryStatus, manageRepositoryAdminStatus } = useRepositoryServices();
const {fetchAllOrganizations} = useOrganizationServices();
const {generatePageSizeIncrements} = usePageSizeHelper();
const selectedOrganization = ref<string>('');
const pageEntity = computed(() => route.path === '/repositories' ? 'Project' : 'IP Technology');

const repositories = ref<Repository[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedPriorityLevel = ref('');
const organizations = ref<any[]>([]);
const selectedType = ref('');
const selectedProjectStatus = ref<string | boolean>('');
const selectedProjectPublicStatus = ref<string | boolean>('');
const path = computed(() => route.path)

// Added for filter drawer
const showFilterDrawer = ref(false);

const manageRepoStatusCallback = async (id: string, isActive: boolean) => {
  await manageRepositoryStatus(id, isActive);
  showSnackbarMessage(`Project Status Changed to ${isActive ? 'Active' : 'Inactive'}`, Status.success);
  await loadRepositories();
};

const manageRepoAdminStatusCallback = async (id: string, isEnabled: boolean) => {
  await manageRepositoryAdminStatus(id, isEnabled);
  showSnackbarMessage(`Project ${isEnabled ? 'Enabled' : 'Disabled'} Successfully`, Status.success);
  await loadRepositories();
};

const getStatusInfo = (repository: Repository) => {
  if (!repository.is_approved) {
    return {
      status: 'Disabled',
      color: 'error',
      icon: PhX,
      tooltip: 'Project is disabled by admin'
    };
  } else if (repository.is_active) {
    return {
      status: 'Active',
      color: 'success',
      icon: PhCheck,
      tooltip: 'Project is active'
    };
  } else {
    return {
      status: 'Inactive',
      color: 'warning',
      icon: PhPower,
      tooltip: 'Project is inactive'
    };
  }
};

const priorityLevelOptions = [
  { title: 'All Priorities', value: '' },
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
];

const typeOptions = [
  { title: 'All Types', value: '' },
  { title: 'Document Type', value: 'Document Repository' },
  { title: 'With Technology', value: 'Project Repository' },
];

const projectStatusOptions = [
  { title: 'All Statuses', value: '' },
  { title: 'Disabled', value: false},
  { title: 'Enabled', value: true },
];

const projectPublicStatusOptions = [
  { title: 'All Status', value: '' },
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
];

const headers = computed(() => [
  { title: 'Project', key: 'title', sortable: true, visible: true },
  { title: 'Status', key: 'status', sortable: true, visible: true },
  ...(route.path === '/repositories'
      ? [{ title: 'Type', key: 'type', sortable: true, visible: true }]
      : []),
  { title: 'Priority', key: 'priority_level', sortable: true, visible: false },
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

// Computed for active filter count
// const activeFilterCount = computed(() => {
//   let count = 0;
//   if (selectedPriorityLevel.value) count++;
//   if (selectedOrganization.value) count++;
//   if (selectedType.value) count++;
//   if (selectedProjectStatus.value !== '') count++;
//   if (selectedProjectPublicStatus.value !== '') count++;
//   if (selectedColumns.value.length !== headers.value.filter(h => h.visible).length) count++;
//   return count;
// });

// Reset all filters function
const resetAllFilters = () => {
  selectedPriorityLevel.value = '';
  selectedOrganization.value = '';
  selectedType.value = '';
  selectedProjectStatus.value = '';
  selectedProjectPublicStatus.value = '';
  selectedColumns.value = headers.value.filter(h => h.key !== 'priority_level' && h.key !== 'start_date' && h.key !== 'end_date').map(h => h.key);
  updateColumnVisibility(selectedColumns.value);
};

watch([search, selectedPriorityLevel, itemsPerPage, selectedOrganization, selectedType, selectedProjectStatus, selectedProjectPublicStatus],
    () => {
      page.value = 1;
      loadRepositories();
      updateTotalCount();
    });

watch([selectedProjectPublicStatus],
    () => {
      selectedProjectStatus.value = true;
      page.value = 1;
      loadRepositories();
      updateTotalCount();
    });

const loadRepositories = async () => {
  loading.value = true;
  try {
    const data = await fetchAllRepositories(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedPriorityLevel.value,
        selectedOrganization.value,
        selectedProjectStatus.value,
        selectedProjectPublicStatus.value,
        path.value == '/ip-technologies' ? 'Project Repository' : selectedType.value ,
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
    const repositoriesData = await fetchRepositoryIDsByUser(200, false, search.value, selectedPriorityLevel.value);

    totalItems.value = path.value === '/repositories'
        ? repositoriesData.length
        : repositoriesData.filter((repo: any) => repo.type === 'Project Repository').length;

  } catch (error) {
    console.error('Failed to get total count:', error);
    totalItems.value = 0;
  }
};

watch(()=> route.path, async () => {
  await updateTotalCount();
  await loadRepositories()
})

onMounted(async () => {
  organizations.value = [{ uid: '', name: 'All', acronym: '' }, ...(await fetchAllOrganizations(1, 1000))];
  await updateTotalCount();
  await loadRepositories()
});
</script>

<template>
  <div class="relative-container circle-quarter" style="height: 100%">
    <!-- Header Section with subtle improvements -->
    <div class="pa-6 relative-container" style="z-index: 20">
      <VRow justify="space-between" align="center" class="ma-0">
        <div>
          <p class="text-heading d-flex align-center">
            All {{ path == '/repositories' ? 'Projects' : 'IP Technologies' }}
          </p>
          <p class="text-subtitle">Create and manage all {{path == '/repositories' ? 'projects' : 'IP technologies'}} across NOMCAARRD</p>
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
            New {{path == '/repositories' ? 'Project' : 'IP Technology'}}
          </VBtnPrimaryFilled>
        </div>
      </VRow>
    </div>
    <VDivider />

    <!-- Main Content Section with improved layout -->
    <div class="pa-6">
      <VContainer fluid>
        <VSheet class="datatable-container rounded-lg elevation-1">
          <!-- Search and filter bar - simplified with filter button -->
          <div class="d-flex flex-wrap align-center justify-space-between px-4 pt-4 pb-2">
            <!-- Search field -->
            <div class="search-container d-flex align-center flex-grow-1" style="max-width: 350px">
              <VTextField
                  v-model="search"
                  placeholder="Search projects..."
                  hide-details
                  density="compact"
                  class="search-field"
                  variant="outlined"
                  rounded="md"
                  color="primary"
                  base-color="gs60"
              >
                <template v-slot:prepend-inner>
                  <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
                </template>
              </VTextField>
            </div>

            <!-- Filter button with badge showing active filter count -->
            <div class="d-flex align-center">
              <VBtn
                  color="blue-grey-darken-1"
                  variant="tonal"
                  rounded="md"
                  class="filter-btn ml-2 px-3"
                  @click="showFilterDrawer = !showFilterDrawer"
              >
                <div class="d-flex align-center">
                  <PhFunnel size="16" class="mr-2" />
                  <span class="text-body-2">Filters</span>
                </div>
              </VBtn>
            </div>
          </div>

          <!-- Expandable filter area -->
          <VExpandTransition>
            <div v-if="showFilterDrawer" class="filter-drawer px-4 pb-3">
              <div class="d-flex justify-space-between align-center my-2">
                <p class="text-subtitle-1 font-weight-medium mb-0">Filter Options</p>
                <VBtn
                    variant="text"
                    density="compact"
                    color="primary"
                    @click="resetAllFilters"
                >
                  Clear All
                </VBtn>
              </div>

              <VDivider class="mb-3"></VDivider>

              <VRow>
                <!-- Column visibility filter -->
                <VCol cols="12" sm="6" md="4" lg="3">
                  <VSelect
                      v-model="selectedColumns"
                      :items="headers"
                      item-title="title"
                      item-value="key"
                      label="Table Columns"
                      multiple
                      chips
                      closable-chips
                      density="compact"
                      variant="outlined"
                      rounded="md"
                      color="primary"
                      base-color="gs60"
                      hide-details
                      class="mb-3"
                      @update:model-value="updateColumnVisibility"
                  />
                </VCol>

                <!-- Organization filter -->
                <VCol cols="12" sm="6" md="4" lg="3">
                  <VSelect
                      v-model="selectedOrganization"
                      :items="organizations"
                      :item-title="organization => organization.acronym ? `${organization.name} (${organization.acronym})` : organization.name"
                      :item-value="organization => `${organization.uid}`"
                      label="Organization"
                      hide-details
                      density="compact"
                      variant="outlined"
                      rounded="md"
                      color="primary"
                      base-color="gs60"
                      class="mb-3"
                  />
                </VCol>

                <!-- Priority filter -->
                <VCol cols="12" sm="6" md="4" lg="3">
                  <VSelect
                      v-if="isColumnVisible('priority_level')"
                      v-model="selectedPriorityLevel"
                      :items="priorityLevelOptions"
                      label="Priority"
                      hide-details
                      density="compact"
                      variant="outlined"
                      rounded="md"
                      color="primary"
                      base-color="gs60"
                      class="mb-3"
                  />
                </VCol>

                <!-- Project Status filter -->
                <VCol cols="12" sm="6" md="4" lg="3">
                  <VSelect
                      v-if="isColumnVisible('status')"
                      v-model="selectedProjectStatus"
                      :items="projectStatusOptions"
                      :item-title="type => type.title"
                      :item-value="type => type.value"
                      :label="`${path == '/repositories' ? 'Project' : 'IP Technology'} Admin Status`"
                      hide-details
                      density="compact"
                      variant="outlined"
                      rounded="md"
                      color="primary"
                      base-color="gs60"
                      class="mb-3"
                  />
                </VCol>

                <!-- Project Public Status filter -->
                <VCol cols="12" sm="6" md="4" lg="3">
                  <VSelect
                      v-if="isColumnVisible('status')"
                      v-model="selectedProjectPublicStatus"
                      :items="projectPublicStatusOptions"
                      :item-title="type => type.title"
                      :item-value="type => type.value"
                      :label="`${path == '/repositories' ? 'Project' : 'IP Technology'} Public Status`"
                      hide-details
                      density="compact"
                      variant="outlined"
                      rounded="md"
                      color="primary"
                      base-color="gs60"
                      class="mb-3"
                  />
                </VCol>

                <!-- Type filter - only for repositories path -->
                <VCol cols="12" sm="6" md="4" lg="3" v-if="isColumnVisible('type') && path == '/repositories'">
                  <VSelect
                      v-model="selectedType"
                      :items="typeOptions"
                      :item-title="type => type.title"
                      :item-value="type => type.value"
                      label="Project Type"
                      hide-details
                      density="compact"
                      variant="outlined"
                      rounded="md"
                      color="primary"
                      base-color="gs60"
                      class="mb-3"
                  />
                </VCol>
              </VRow>
            </div>
          </VExpandTransition>

          <!-- Data Table with improved styling -->
          <VDataTableServer
              v-model:items-per-page="itemsPerPage"
              :headers="visibleHeaders"
              :items="repositories"
              :loading="loading"
              :items-length="totalItems"
              :items-per-page-options="generatePageSizeIncrements(totalItems)"
              @update:page="handlePageChange"
              class="elevation-0"
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

            <template v-slot:item.status="{ item }">
              <VTooltip :text="getStatusInfo(item).tooltip">
                <template v-slot:activator="{ props }">
                  <VChip
                      :color="getStatusInfo(item).color"
                      size="small"
                      class="text-capitalize"
                      v-bind="props"
                  >
                    <component :is="getStatusInfo(item).icon" size="14" class="mr-1" />
                    {{ getStatusInfo(item).status }}
                  </VChip>
                </template>
              </VTooltip>
            </template>

            <template v-if="path === '/repositories'" v-slot:item.type="{ item }">
              <VChip size="small">
                {{ item.type === 'Document Repository' ? 'Document Project' : 'IP Technology' }}
              </VChip>
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
              <VMenu
                  location="bottom end"
                  :close-on-content-click="false"
                  transition="slide-y-transition"
              >
                <template #activator="{ props }">
                  <VBtn icon variant="text" v-bind="props" density="comfortable">
                    <PhDotsThreeOutlineVertical weight="fill"/>
                  </VBtn>
                </template>
                <VCard class="action-menu rounded-lg" min-width="220" elevation="3">
                  <VList density="compact" nav>
                    <VListItem :to="{ name: 'repository-data', params: { slug: item.slug }}" class="action-menu-item">
                      <template v-slot:prepend>
                        <PhEye class="mr-2" />
                      </template>
                      <VListItemTitle>View {{pageEntity}}</VListItemTitle>
                    </VListItem>

                    <VListItem :to="{ name: 'edit-repository', params: { slug: item.slug }}" class="action-menu-item">
                      <template v-slot:prepend>
                        <PhPencil class="mr-2" />
                      </template>
                      <VListItemTitle>Edit {{pageEntity}}</VListItemTitle>
                    </VListItem>

                    <VListItem :to="{ name: 'repository-settings', params: { slug: item.slug }}" class="action-menu-item">
                      <template v-slot:prepend>
                        <PhGear class="mr-2" />
                      </template>
                      <VListItemTitle>Configure {{pageEntity}} Settings</VListItemTitle>
                    </VListItem>

                    <VDivider class="my-1"></VDivider>

                    <ConfirmationDialog
                        @callback="manageRepoAdminStatusCallback(item.uid as string, !item.is_approved)"
                        :confirm-content="item.is_approved ? `Disable ${pageEntity}` : `Enable ${pageEntity}`"
                        :content="item.is_approved ? `Are you sure you want to disable this ${pageEntity.charAt(0).toLowerCase() + pageEntity.slice(1)}?` : `Are you sure you want to enable this ${pageEntity.charAt(0).toLowerCase() + pageEntity.slice(1)}?`"
                    >
                      <VListItem class="action-menu-item">
                        <template v-slot:prepend>
                          <PhPower class="mr-2" />
                        </template>
                        <VListItemTitle>{{ item.is_approved ? `Disable ${pageEntity}` : `Enable ${pageEntity}` }}</VListItemTitle>
                      </VListItem>
                    </ConfirmationDialog>

                    <ConfirmationDialog
                        v-if="item.is_approved"
                        @callback="manageRepoStatusCallback(item.uid as string, !item.is_active)"
                        :confirm-content="item.is_active ? 'Deactivate Project' : 'Activate Project'"
                        :content="item.is_active ? 'Are you sure you want to deactivate this project? All project data will be deleted.' : 'Are you sure you want to activate this project?'"
                    >
                      <VListItem class="action-menu-item">
                        <template v-slot:prepend>
                          <PhX v-if="item.is_active" class="mr-2" />
                          <PhCheck v-else class="mr-2" />
                        </template>
                        <VListItemTitle>{{item.is_active ? 'Deactivate Project' : 'Activate Project'}}</VListItemTitle>
                      </VListItem>
                    </ConfirmationDialog>
                  </VList>
                </VCard>
              </VMenu>
            </template>

            <template v-slot:no-data>
              <EmptyStateInfo
                  :header="`No ${path === '/repositories' ? 'Projects' : 'Repositories'} Found`"
                  :description="`There are no ${path === '/repositories' ? 'projects' : 'repositories'} matching your search criteria`"
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
/* Improved styling */
.datatable-container {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.search-container {
  position: relative;
}

.filter-btn {
  height: 40px;
  transition: all 0.2s ease;
}

.filter-drawer {
  background-color: #f9fafc;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.action-menu {
  overflow: hidden;
}

.action-menu-item {
  transition: background-color 0.2s ease;
}

.action-menu-item:hover {
  background-color: #f0f5f9;
}

/* Background styles */
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

/* Form field styling */
:deep(.v-field__outline) {
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep(input::placeholder) {
  color: #5F6061;
  opacity: 90%;
}

/* Table enhancements */
:deep(.v-data-table) {
  font-family: 'Satoshi', sans-serif;
}

:deep(.v-data-table__td) {
  padding: 12px 16px;
}

:deep(.v-data-table__th) {
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
  background-color: #f9fafc;
}
</style>
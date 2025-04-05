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
  PhGear
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
    <div class="pa-6 relative-container" style="z-index: 20">
      <VRow justify="space-between" align="center" class="ma-0">
        <div>
          <p class="text-heading d-flex align-center">All {{ path == '/repositories' ?  'Projects' : 'IP Technologies' }}</p>
          <p class="text-subtitle">Create and manage all {{path == '/repositories' ?  'projects' : 'IP technologies'}} across NOMCAARRD</p>
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
            New {{path == '/repositories' ?  'Project' : 'IP Technology'}}
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
            <VSelect
                v-model="selectedProjectStatus"
                :items="projectStatusOptions"
                :item-title="type => type.title"
                :item-value="type => type.value"
                :label="`${path == '/repositories' ?  'Project' : 'IP Technology'} Admin Status`"
                hide-details
                density="compact"
                class="me-3 mb-3"
                variant="outlined"
                rounded="md"
                color="primary"
                base-color="gs60"
                style="max-width: 150px"
            />
            <VSelect
                v-model="selectedProjectPublicStatus"
                :items="projectPublicStatusOptions"
                :item-title="type => type.title"
                :item-value="type => type.value"
                :label="`${path == '/repositories' ?  'Project' : 'IP Technology'} Public Status`"
                hide-details
                density="compact"
                class="me-3 mb-3"
                variant="outlined"
                rounded="md"
                color="primary"
                base-color="gs60"
                style="max-width: 150px"
            />
            <VSelect
                v-if="isColumnVisible('type') && path == '/repositories'"
                v-model="selectedType"
                :items="typeOptions"
                :item-title="type => type.title"
                :item-value="type => type.value"
                label="Project Type"
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
                  location="bottom"
                  :close-on-content-click="false"
              >
                <template #activator="{ props }">
                  <p class="action-button cursor-pointer d-flex justify-space-between align-center ga-2" v-bind="props">
                      Options
                    <PhDotsThreeOutlineVertical weight="fill"/>
                  </p>
                </template>
                <VSheet width="200" class="rounded-b-lg py-2">
                  <RouterLink class="text-decoration-none" :to="{ name: 'repository-data', params: { slug: item.slug }}">
                    <p class="cursor-pointer action-menu-item">
                      <PhEye/>
                      View {{pageEntity}}
                    </p>
                  </RouterLink>
                  <RouterLink class="text-decoration-none" :to="{ name: 'edit-repository', params: { slug: item.slug }}">
                    <p class="cursor-pointer action-menu-item">
                      <PhPencil/>
                      Edit {{pageEntity}}
                    </p>
                  </RouterLink>
                  <RouterLink class="text-decoration-none" :to="{ name: 'repository-settings', params: { slug: item.slug }}">
                    <p class="cursor-pointer action-menu-item">
                      <PhGear/>
                      Configure {{pageEntity}} Settings
                    </p>
                  </RouterLink>
                  <ConfirmationDialog
                      @callback="manageRepoAdminStatusCallback(item.uid as string, !item.is_approved)"
                      :confirm-content="item.is_approved ? `Disable ${pageEntity}` : `Enable ${pageEntity}`"
                      :content="item.is_approved ? `Are you sure you want to disable this ${pageEntity.charAt(0).toLowerCase() + pageEntity.slice(1)}?` : `Are you sure you want to enable this ${pageEntity.charAt(0).toLowerCase() + pageEntity.slice(1)}?`"
                  >

                    <p class="cursor-pointer action-menu-item">
                      <PhPower/>
                      {{ item.is_approved ? `Disable ${pageEntity}` : `Enable ${pageEntity}` }}
                    </p>

                  </ConfirmationDialog>
                  <ConfirmationDialog
                      v-if="item.is_approved"
                      @callback="manageRepoStatusCallback(item.uid as string, !item.is_active)"
                      :confirm-content="item.is_active ? 'Deactivate Project' : 'Activate Project'"
                      :content="item.is_active ? 'Are you sure you want to deactivate this project? All project data will be deleted.' : 'Are you sure you want to activate this project?'"
                  >
                    <p class="cursor-pointer action-menu-item">
                      <PhX v-if="item.is_active"/>
                      <PhCheck v-else  />
                      {{item.is_active ? 'Deactivate Project' : 'Activate Project'}}
                    </p>
                  </ConfirmationDialog>
                </VSheet>
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
.action-button{
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover{
  background-color: #F0F5F9;
}

.action-menu-item{
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
  color: black !important;
}

.action-menu-item:hover{
  background-color: #e0e3e3;
}

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
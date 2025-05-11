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
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";

const {route} = useRouting();
const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore()
const { fetchAllRepositories, fetchRepositoryIDsByUser, manageRepositoryStatus, manageRepositoryAdminStatus } = useRepositoryServices();
const {fetchAllOrganizationsBasicData} = useOrganizationServices();
const selectedOrganization = ref<string>('');
const pageEntity = computed(() => route.path === '/repositories' ? 'Project' : route.path === '/e-library' ? 'Document' : 'IP Technology');

const repositories = ref<Repository[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedPriorityLevel = ref('');
const organizations = ref<any[]>([]);
const selectedType = ref('');
const selectedProjectState = ref<string | boolean>('');
const selectedProjectPublicState = ref<string | boolean>('');
const selectedProjectStatus = ref<string>('');
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

const projectStateOptions = [
  { title: 'All States', value: '' },
  { title: 'Disabled', value: false},
  { title: 'Enabled', value: true },
];

const projectPublicStateOptions = [
  { title: 'All', value: '' },
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
];

const projectStatusOptions = [
  { title: 'All', value: '' },
  { title: 'Ongoing', value: 'Ongoing' },
  { title: 'Completed', value: 'Completed' },
  { title: 'Suspended', value: 'Suspended' },
  { title: 'Terminated', value: 'Terminated' },
  { title: 'Unliquidated', value: 'Unliquidated' },
]

const headers = computed(() => [
  { title: 'Project', key: 'title', sortable: true, visible: true },
  { title: 'Status', key: 'status', sortable: true, visible: true },
  { title: 'State', key: 'state', sortable: true, visible: true },
  ...(route.path === '/repositories'
      ? [{ title: 'Type', key: 'type', sortable: true, visible: true }]
      : []),
  { title: 'Priority', key: 'priority_level', sortable: true, visible: false },
  { title: 'Start Date', key: 'start_date', sortable: true, visible: false },
  { title: 'End Date', key: 'end_date', sortable: true, visible: false },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));


const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};


const loadData = async ()=> {
  page.value = 1;
  await loadRepositories();
  await updateTotalCount();
}

watch([selectedPriorityLevel, itemsPerPage, selectedOrganization, selectedType, selectedProjectState, selectedProjectPublicState, selectedProjectStatus],
    async() => {
      await loadData()
    });

watch([selectedProjectPublicState],
    async () => {
      selectedProjectState.value = true;
      await loadData()
    });


const tableFilters = computed(() => [
  {
    key: 'priorityLevel',
    label: 'Priority Level',
    value: selectedPriorityLevel.value,
    items: priorityLevelOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'priority_level'
  },
  {
    key: 'projectState',
    label: `${path.value == '/repositories' ? 'Project' : 'IP Technology'} State`,
    value: selectedProjectState.value,
    items: projectStateOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'state'
  },
  {
    key: 'projectPublicState',
    label: `${path.value == '/repositories' ? 'Project' : 'IP Technology'} Availability`,
    value: selectedProjectPublicState.value,
    items: projectPublicStateOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'state'
  },
  {
    key: 'projectStatus',
    label: `${path.value == '/repositories' ? 'Project' : 'IP Technology'} Status`,
    value: selectedProjectStatus.value,
    items: projectStatusOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'status'
  },
  {
    key: 'projectType',
    label: "Project Type",
    value: selectedType.value,
    items: typeOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'type'
  }
]);

const clearFilters = () => {
  selectedPriorityLevel.value = '';
  selectedProjectStatus.value = '';
  selectedProjectState.value = '';
  selectedProjectPublicState.value = '';
  selectedType.value = '';
  selectedOrganization.value = ''
}

const handleFilterUpdate = ({ key, value }: { key: any, value: any }) => {
  if (key === 'priorityLevel') {
    selectedPriorityLevel.value = value;
  } else if (key === 'projectState') {
    selectedProjectState.value = value;
  } else if (key === 'projectPublicState') {
    selectedProjectPublicState.value = value;
    if (value !== '') {
      selectedProjectState.value = true;
    }
  } else if (key === 'projectStatus') {
    selectedProjectStatus.value = value;
  } else if (key === 'projectType') {
    selectedType.value = value;
  }
};


const loadRepositories = async () => {
  loading.value = true;
  try {
    const data = await fetchAllRepositories(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedPriorityLevel.value,
        selectedOrganization.value,
        selectedProjectState.value,
        selectedProjectPublicState.value,
        path.value == '/ip-technologies' ? 'Project Repository' : route.path === '/e-library' ? 'Document Repository' : selectedType.value ,
        selectedProjectStatus.value
    );
    repositories.value = data;
  } catch (error) {
    console.error('Failed to load repositories:', error);
  } finally {
    loading.value = false;
  }
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

const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    Ongoing: 'light-blue',
    Completed: 'green',
    Suspended: 'orange-lighten-1',
    Terminated: 'red',
    Unliquidated: 'blue-grey-darken-1',
  };
  return statusMap[status] || 'grey-lighten-1';
}

const updateTotalCount = async () => {
  console.log(path.value == '/ip-technologies' ? 'Project Repository' : route.path === '/e-library' ? 'Document Repository' : selectedType.value)
  try {
    // Pass search and priority level to get accurate count
    const repositoriesData = await fetchRepositoryIDsByUser(
        10000,
    false,
        search.value,
        selectedPriorityLevel.value,
        selectedOrganization.value,
        selectedProjectState.value,
        selectedProjectPublicState.value,
        path.value == '/ip-technologies' ? 'Project Repository' : route.path === '/e-library' ? 'Document Repository' : selectedType.value,
        selectedProjectStatus.value
    );

    totalItems.value = path.value === '/repositories' || route.path === '/e-library'
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
  organizations.value = [{ uid: '', name: 'All', acronym: '' }, ...(await fetchAllOrganizationsBasicData(1, 1000))];
  await loadData()
});
</script>


<template>
  <BaseDataTable
    :title="`All ${path == '/repositories' ? 'Projects' : route.path === '/e-library' ? 'E-Library' : 'IP Technologies'}`"
    :subtitle="`Create and manage all ${path == '/repositories' ? 'projects' : route.path === '/e-library' ? 'materials' : 'IP technologies'} across NOMCAARRD`"
    :items="repositories"
    :headers="headers"
    :loading="loading"
    :totalItems="totalItems"
    :searchPlaceholder="`Search ${path == '/repositories' ? 'projects' : route.path === '/e-library' ? 'documents' : 'IP Technologies'}...`"
    :emptyStateHeader="`No ${path == '/repositories' ? 'projects' : route.path === '/e-library' ? 'documents' : 'IP technologies'} found`"
    :emptyStateDescription="`There are no ${path == '/repositories' ? 'projects' : route.path === '/e-library' ? 'documents' : 'IP technologies'} found matching your criteria`"
    :filters="tableFilters"
    :itemsPerPageOptions="itemsPerPage"
    @update:search="search = $event"
    @update:page="page = $event"
    @update:itemsPerPage="itemsPerPage = $event"
    @update:selectedColumns="updateColumnVisibility"
    @loadData="loadRepositories"
    @clearFilters="clearFilters"
    @update:filter="handleFilterUpdate"
    @refreshData="loadData"
  >
    <template #header-actions>
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
        New {{path == '/repositories' ? 'Project' : route.path === '/e-library' ? 'Document Repository' : 'IP Technology'}}
      </VBtnPrimaryFilled>
    </template>

    <template #item.title="{ item }">
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
          <p class="text-caption text-medium-emphasis mb-0">{{item.org_data?.name}} ({{item.org_data?.acronym}}) | {{ formatDate(item.updated_at) }}</p>
        </div>
      </div>
    </template>
    <template #item.status="{ item }">
      <VChip
          :color="getStatusColor(item.status ? item.status : '')"
          size="small"
          class="text-capitalize"
      >
        {{ item.status ? item.status : 'N/A' }}
      </VChip>
    </template>

    <template #item.state="{ item }">
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


    <template v-if="path === '/repositories'" #item.type="{ item }">
      <VChip size="small">
        {{ item.type === 'Document Repository' ? 'Document Project' : 'IP Technology' }}
      </VChip>
    </template>

    <template #item.priority_level="{ item }">
      <VChip
          :color="getPriorityColor(item.priority_level)"
          size="small"
          class="text-capitalize"
      >
        {{ item.priority_level }}
      </VChip>
    </template>

    <template #item.actions="{ item }">
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
                :isWarning="item?.is_approved"
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
                :isWarning="item?.is_active"
                v-if="item.is_approved"
                @callback="manageRepoStatusCallback(item.uid as string, !item.is_active)"
                :confirm-content="item.is_active ?  `Deactivate ${pageEntity}` : `Activate ${pageEntity}`"
                :content="item.is_active ? `Are you sure you want to deactivate this ${pageEntity.charAt(0).toLowerCase() + pageEntity.slice(1)}? All data will be deleted.` : `Are you sure you want to activate this ${pageEntity.charAt(0).toLowerCase() + pageEntity.slice(1)}?`"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhX v-if="item.is_active" class="mr-2" />
                  <PhCheck v-else class="mr-2" />
                </template>
                <VListItemTitle>{{item.is_active ? `Deactivate ${pageEntity}` : `Activate ${pageEntity}`}}</VListItemTitle>
              </VListItem>
            </ConfirmationDialog>
          </VList>
        </VCard>
      </VMenu>
    </template>

    <template #additional-filters>
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
    </template>

  </BaseDataTable>
</template>

<style scoped>
.action-menu {
  overflow: hidden;
}

.action-menu-item {
  transition: background-color 0.2s ease;
}

.action-menu-item:hover {
  background-color: #f0f5f9;
}

</style>
<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue';
import {
  PhPlus,
  PhCheck,
  PhX,
  PhPower,
  PhPencil,
  PhDotsThreeOutlineVertical,
  PhEye,
  PhGear, PhMagnifyingGlass, PhDownload, PhCaretDown
} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {CustomUserData} from "../../../interfaces/member.interface.ts";
import {useRepositoryMemberServices} from "../../repository/services/repository-member.services.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {useVisibilityHelper} from "../../../core/composables/useVisibilityHelper.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import ChangeVisibilityDialog from "../../../core/components/ChangeVisibilityDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import Papa from 'papaparse';
const {userData} = useUserStore()
const { isSmall, isTablet } = useScreenStore();
const {route} = useRouting();
const {showSnackbarMessage} = useSnackbarStore()
const {fetchAllOrganizations, fetchOrganizationCount, manageOrgStatus, manageOrgAdminStatus} = useOrganizationServices();
const {getVisibilityLabel} = useVisibilityHelper()
const {fetchCustomUsers} = useRepositoryMemberServices();
const {arrayToString} = useStringArrayHelper()
const organizations = ref<Organization[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(5);
const page = ref(1);
const totalItems = ref(0);
const selectedOrgStatus = ref<string | boolean>('');
const selectedOrgAdminStatus = ref<string | boolean>('');
const customUsers = ref<any[]>([])
const selectedUsers = ref<CustomUserData[]>([])
const userRef = ref(null);
const userSearch = ref('')
const selectedUsersOption = ref(['All'])
const selectedNames = computed(() =>
    arrayToString(selectedUsers.value.map(user => user?.data?.first_name || 'Unknown'))
)
const selectedVisibilities = ref<string[]>([]);
const allType = ref<boolean>(true);
const convertedVisibilities = computed(() => {
  return arrayToString(selectedVisibilities.value)
});
const handleSearch = async (query: any) => {
  userSearch.value = query
}


const props = defineProps({
  isForUser: {
    type: Boolean,
    default: false
  }
})

const handleEnterKey = (event: KeyboardEvent) => {
  event.preventDefault();
  event.stopPropagation();
  addCustomUser();
  return false;
};

// Handle blur event
const handleBlur = () => {
  addCustomUser();
};

const addCustomUser = async () => {
  if(userSearch.value.trim().length > 0){
    const newUser: CustomUserData = {
      type: 'custom',
      data: {
        username: userSearch.value as string,
        first_name: userSearch.value as string,
        last_name: '',
        email: '',
        uid: ''
      }
    };
    selectedUsers.value?.push(newUser);
    //@ts-ignore
    selectedUsers.value = selectedUsers.value?.filter(user => typeof user === 'object');
    userSearch.value = '';
    //@ts-ignore
    userRef.value.search = '';
    await loadData()
  }
}

const changeVisibilityCallback = async () => {
  showSnackbarMessage("Project Visibility Changed Successfully", Status.success)
  await loadOrganizations();
}

const manageOrgStatusCallback = async (id: string, isActive: boolean) => {
  await manageOrgStatus(id, isActive);
  showSnackbarMessage(`CMI Status Changed to ${isActive ? 'Active' : 'Inactive'}`, Status.success);
  await loadOrganizations();
};

const manageOrgAdminStatusCallback = async (id: string, isEnabled: boolean) => {
  await manageOrgAdminStatus(id, isEnabled);
  showSnackbarMessage(`CMI ${isEnabled ? 'Enabled' : 'Disabled'} Successfully`, Status.success);
  await loadOrganizations();
};


const includedUserOptions = [
  { title: 'All Representatives', value: 'All' },
  { title: 'Research & Development', value: 'rdc_rep' },
  { title: 'Information Communication', value: 'icc_rep' },
  { title: 'Technology Transfer', value: 'ttc_rep' },
  { title: 'Science Communication', value: 'scc_rep' },
];

const visibilityOptions = [
  { title: 'Public', value: '1' },
  { title: 'Private', value: '2' },
  { title: 'Within Organization', value: '3' },
  { title: 'Within All Organization', value: '4' },
];

const orgOptions = [
  { title: 'All CMIs', value: true },
  { title: 'Managed and Affiliated CMIs', value: false }
]

const getStatusInfo = (org: Organization) => {
  if (!org.is_approved) {
    return {
      status: 'Disabled',
      color: 'error',
      icon: PhX,
      tooltip: 'CMI is disabled by admin'
    };
  } else if (org.is_active) {
    return {
      status: 'Active',
      color: 'success',
      icon: PhCheck,
      tooltip: 'CMI is active'
    };
  } else {
    return {
      status: 'Inactive',
      color: 'warning',
      icon: PhPower,
      tooltip: 'CMI is inactive'
    };
  }
};

const orgAdminStatusOptions = [
  { title: 'All States', value: '' },
  { title: 'Disabled', value: false},
  { title: 'Enabled', value: true },
];

const orgStatusOptions = [
  { title: 'All', value: '' },
  { title: 'Active', value: true },
  { title: 'Inactive', value: false },
];


const headers = computed(() => [
  { title: 'Title', key: 'title', sortable: false, visible: true },
  { title: 'Status', key: 'status', sortable: false, visible: true },
  ...(route.path === '/organizations' && props.isForUser
      ? []
      : [{ title: 'Visibility', key: 'visibility', sortable: false, visible: true },]),
  {title: 'Research and Development Rep', key: 'rdc_rep', sortable: false, visible: true},
  {title: 'Information Communication Rep', key: 'icc_rep', sortable: false, visible: true},
  {title: 'Technology Transfer Rep', key: 'ttc_rep', sortable: false, visible: true},
  {title: 'Science Communication Rep', key: 'scc_rep', sortable: false, visible: true},
  { title: 'Actions', key: 'actions', sortable: false, visible: true }
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));

const isColumnVisible = (key: string) => {
  const column = headers.value.find((h: any) => h.key === key);
  return column ? selectedColumns.value.includes(key) : false;
};
const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};


const loadData = async ()=> {
  page.value = 1;
  await loadOrganizations();
  await updateTotalCount();
}

const tableFilters = computed(() => [
  ...(!userData.is_superuser ? [{
    key: 'orgTypeStatus',
    label: 'Filter By Organization',
    value: allType.value,
    items: orgOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'title'
  }] : []),
  ...(!props.isForUser ? [{
    key: 'orgAdminStatus',
    label: 'CMI State',
    value: selectedOrgAdminStatus.value,
    items: orgAdminStatusOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'status'
  }] : []),
  {
    key: 'orgStatus',
    label: 'CMI Availability Status',
    value: selectedOrgStatus.value,
    items: orgStatusOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'status'
  }
]);

const clearFilters = () => {
  selectedOrgStatus.value = '';
  selectedOrgAdminStatus.value = '';
  selectedUsers.value = [];
  selectedUsersOption.value = ['All'];
  selectedVisibilities.value = [];
  allType.value = true;
}

const handleFilterUpdate = ({ key, value }: { key: any, value: any }) => {
  if (key === 'orgAdminStatus') {
    selectedOrgAdminStatus.value = value;
  } else if (key === 'orgStatus') {
    selectedOrgStatus.value = value;
    if (value !== '') {
      selectedOrgAdminStatus.value = true;
    }
  } else if (key === 'orgTypeStatus') {
    allType.value = value;
  }
};


const loadOrganizations = async () => {
  loading.value = true;
  let rdc_rep = '';
  let icc_rep = '';
  let ttc_rep = '';
  let scc_rep = '';
  let all_reps = '';

  if (selectedUsersOption.value.includes('All')) {
    all_reps = selectedNames.value;
  } else {
    if (selectedUsersOption.value.includes('rdc_rep')) {
      rdc_rep = selectedNames.value;
    }
    if (selectedUsersOption.value.includes('icc_rep')) {
      icc_rep = selectedNames.value;
    }
    if (selectedUsersOption.value.includes('ttc_rep')) {
      ttc_rep = selectedNames.value;
    }
    if (selectedUsersOption.value.includes('scc_rep')) {
      scc_rep = selectedNames.value;
    }
  }

  try {
    const data = await fetchAllOrganizations(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedOrgAdminStatus.value,
        selectedOrgStatus.value,
        all_reps,
        rdc_rep,
        ttc_rep,
        icc_rep,
        scc_rep,
        route.path === '/organizations' && props.isForUser && allType.value ? '1,4' : convertedVisibilities.value,
        props.isForUser,
        true,
        route.path === '/organizations' && props.isForUser && allType.value ? 'or' : 'and'
    );
    organizations.value = data;
  } catch (error) {
    console.error('Failed to load repositories:', error);
  } finally {
    loading.value = false;
  }
};




const updateTotalCount = async () => {
  loading.value = true;
  let rdc_rep = '';
  let icc_rep = '';
  let ttc_rep = '';
  let scc_rep = '';
  let all_reps = '';

  if (selectedUsersOption.value.includes('All')) {
    all_reps = selectedNames.value;
  } else {
    if (selectedUsersOption.value.includes('rdc_rep')) {
      rdc_rep = selectedNames.value;
    }
    if (selectedUsersOption.value.includes('icc_rep')) {
      icc_rep = selectedNames.value;
    }
    if (selectedUsersOption.value.includes('ttc_rep')) {
      ttc_rep = selectedNames.value;
    }
    if (selectedUsersOption.value.includes('scc_rep')) {
      scc_rep = selectedNames.value;
    }
  }
  try {
    // Pass search and priority level to get accurate count
    totalItems.value = await fetchOrganizationCount(
        page.value,
        10000,
        search.value,
        selectedOrgAdminStatus.value,
        selectedOrgStatus.value,
        all_reps,
        rdc_rep,
        ttc_rep,
        icc_rep,
        scc_rep,
        route.path === '/organizations' && props.isForUser && allType.value ? '1,4' : convertedVisibilities.value,
        props.isForUser,
        route.path === '/organizations' && props.isForUser && allType.value ? 'or' : 'and'
    );


  } catch (error) {
    console.error('Failed to get total count:', error);
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }

};

const downloadLoading = ref(false);
const downloadCSV = async () => {
  downloadLoading.value = true;

  try {
    // Fetch all organizations with current filters but without pagination
    let rdc_rep = '';
    let icc_rep = '';
    let ttc_rep = '';
    let scc_rep = '';
    let all_reps = '';

    if (selectedUsersOption.value.includes('All')) {
      all_reps = selectedNames.value;
    } else {
      if (selectedUsersOption.value.includes('rdc_rep')) {
        rdc_rep = selectedNames.value;
      }
      if (selectedUsersOption.value.includes('icc_rep')) {
        icc_rep = selectedNames.value;
      }
      if (selectedUsersOption.value.includes('ttc_rep')) {
        ttc_rep = selectedNames.value;
      }
      if (selectedUsersOption.value.includes('scc_rep')) {
        scc_rep = selectedNames.value;
      }
    }

    // Fetch all data for CSV export
    const allData = await fetchAllOrganizations(
        1, // page
        10000, // large number to get all items
        search.value,
        selectedOrgAdminStatus.value,
        selectedOrgStatus.value,
        all_reps,
        rdc_rep,
        ttc_rep,
        icc_rep,
        scc_rep,
        route.path === '/organizations' && props.isForUser && allType.value ? '1,4' : convertedVisibilities.value,
        props.isForUser,
        true,
        route.path === '/organizations' && props.isForUser && allType.value ? 'or' : 'and'
    );

    // Transform data for CSV export
    const csvData = allData.map((org: Organization) => {
      // Helper function to format representative data
      const formatReps = (repData: any[]) => {
        if (!repData || repData.length === 0) return 'N/A';
        return repData.map(rep => `${rep.data?.first_name || ''} ${rep.data?.last_name || ''}`.trim()).join(', ');
      };

      // Get status information
      const statusInfo = getStatusInfo(org);

      return {
        'Title': org.name || '',
        'Acronym': org.acronym || '',
        'Address': org.address || '',
        'Description': org.description ? org.description.replace(/<[^>]*>/g, '') : '', // Strip HTML tags
        'Status': statusInfo.status,
        'State': org.is_active ? 'Active' : 'Inactive',
        'Admin Status': org.is_approved ? 'Enabled' : 'Disabled',
        'Visibility': getVisibilityLabel(org.visibility as number),
        'Research & Development Rep': formatReps(org.rd_repData!),
        'Information Communication Rep': formatReps(org.ic_repData!),
        'Technology Transfer Rep': formatReps(org.tt_repData!),
        'Science Communication Rep': formatReps(org.sc_repData!),
        'GeoJSON': org.geojson
            ? JSON.stringify(org.geojson).replace(/"/g, '""')
            : '',
        // 'Created Date': org.created_at ? new Date(org.created_at).toLocaleDateString() : '',
        // 'Updated Date': org.updated_at ? new Date(org.updated_at).toLocaleDateString() : '',
        'UID': org.uid || '',
        'Slug': org.slug || ''
      };
    });

    // Generate CSV content
    const csv = Papa.unparse(csvData, {
      header: true,
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ',',
      newline: '\r\n'
    });

    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);

      // Generate filename with current date and filter info
      const currentDate = new Date().toISOString().split('T')[0];
      let filename = `cmis_${currentDate}`;

      // Add filter info to filename if filters are applied
      if (search.value) {
        filename += `_search-${search.value.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }
      if (selectedOrgStatus.value !== '') {
        filename += `_status-${selectedOrgStatus.value ? 'active' : 'inactive'}`;
      }
      if (selectedOrgAdminStatus.value !== '') {
        filename += `_admin-${selectedOrgAdminStatus.value ? 'enabled' : 'disabled'}`;
      }

      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    showSnackbarMessage(`CSV file downloaded successfully (${csvData.length} records)`, Status.success);

  } catch (error) {
    console.error('Failed to download CSV:', error);
    showSnackbarMessage('Failed to download CSV file', Status.error);
  } finally {
    downloadLoading.value = false;
  }
};
const downloadVisibleCSV = () => {
  downloadLoading.value = true;

  try {
    // Use current organizations data
    const csvData = organizations.value.map((org: Organization) => {
      const formatReps = (repData: any[]) => {
        if (!repData || repData.length === 0) return 'N/A';
        return repData.map(rep => `${rep.data?.first_name || ''} ${rep.data?.last_name || ''}`.trim()).join(', ');
      };

      const statusInfo = getStatusInfo(org);

      return {
        'Title': org.name || '',
        'Acronym': org.acronym || '',
        'Address': org.address || '',
        'Description': org.description ? org.description.replace(/<[^>]*>/g, '') : '', // Strip HTML tags
        'Status': statusInfo.status,
        'State': org.is_active ? 'Active' : 'Inactive',
        'Admin Status': org.is_approved ? 'Enabled' : 'Disabled',
        'Visibility': getVisibilityLabel(org.visibility as number),
        'Research & Development Rep': formatReps(org.rd_repData!),
        'Information Communication Rep': formatReps(org.ic_repData!),
        'Technology Transfer Rep': formatReps(org.tt_repData!),
        'Science Communication Rep': formatReps(org.sc_repData!),
        'GeoJSON': org.geojson
            ? JSON.stringify(org.geojson).replace(/"/g, '""')
            : '',
        'UID': org.uid || '',
        'Slug': org.slug || ''
      };
    });

    const csv = Papa.unparse(csvData, {
      header: true,
      quotes: true,
      quoteChar: '"',
      escapeChar: '"',
      delimiter: ',',
      newline: '\r\n'
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);

      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `cmis_page-${page.value}_${currentDate}.csv`;

      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    showSnackbarMessage(`CSV file downloaded successfully (${csvData.length} records from current page)`, Status.success);

  } catch (error) {
    console.error('Failed to download CSV:', error);
    showSnackbarMessage('Failed to download CSV file', Status.error);
  } finally {
    downloadLoading.value = false;
  }
};




watch([itemsPerPage, selectedOrgStatus, selectedOrgAdminStatus, selectedUsers, selectedVisibilities, allType],
    async() => {
      await loadData()
    });

watch([selectedOrgStatus],
    async () => {
      selectedOrgAdminStatus.value = true;
      await loadData()
    });

watch(
    () => selectedUsersOption.value,
    (newValue, oldValue) => {

      if (oldValue.includes('All') && newValue.length > 1) {
        selectedUsersOption.value = selectedUsersOption.value.filter(option => option !== 'All');
      }
      else if (newValue.includes('All') && newValue.length > 1) {
        selectedUsersOption.value = ['All'];
      }

      if(selectedUsers.value.length > 0){
        loadData();
      }
    },
    { deep: true }
);

onMounted(async () => {
  loading.value = true;
  customUsers.value =  await fetchCustomUsers();
  await loadData()
});
</script>


<template>
  <BaseDataTable
      title="All Consortium Member Institutions"
      subtitle="Create and manage all consortium member institutions across NOMCAARRD"
      :items="organizations"
      :headers="headers"
      :loading="loading"
      :totalItems="totalItems"
      searchPlaceholder="Search Consortium Member Institutions..."
      emptyStateHeader="No Consortium Member Institutions found"
      emptyStateDescription="There are no Consortium Member Institutions found matching your criteria"
      :filters="tableFilters"
      :itemsPerPageOptions="itemsPerPage"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @update:selectedColumns="updateColumnVisibility"
      @loadData="loadOrganizations"
      @clearFilters="clearFilters"
      @update:filter="handleFilterUpdate"
      @refreshData="loadData"
      :expandable="true"
  >
    <template #header-actions>
      <VBtnPrimaryFilled :to="{ name: 'new-organization' }" v-if="isSmall || isTablet" icon>
        <PhPlus size="16" />
      </VBtnPrimaryFilled>
      <VBtnPrimaryFilled
          :to="{ name: 'new-organization' }"
          v-else
          height="45px"
          rounded="lg"
          class="satoshi-md"
          style="font-size: 14px !important"
      >
        <PhPlus size="16" class="mr-2" />
        New CMI
      </VBtnPrimaryFilled>
    </template>

    <template #item.title="{ item }">
      <div class="d-flex align-center" style="max-width: 400px;">
        <VAvatar
            size="36"
            class="me-2"
        >
          <VImg :src="item.image as string" alt="CMI" />
        </VAvatar>
        <div>
          <p class="font-weight-medium mb-0">{{ item.name }} ({{item.acronym}})</p>
          <p class="text-caption text-medium-emphasis mb-0">{{item.address}}</p>
        </div>
      </div>
    </template>

    <template #item.status="{ item }">
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

    <template #item.rdc_rep="{ item }">
      <p class="pr-3">
        <span v-if="item.rd_repData?.length == 0">N/A</span>
        <span v-else v-for="(owner, index) in item.rd_repData">
            {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != item.rd_repData?.length! - 1">, </span>
          </span>
      </p>
    </template>

    <template #item.ttc_rep="{ item }">
      <p class="pr-3">
        <span v-if="item.tt_repData?.length == 0">N/A</span>
        <span v-else v-for="(owner, index) in item.tt_repData">
            {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != item.tt_repData?.length! - 1">, </span>
          </span>
      </p>
    </template>

    <template #item.icc_rep="{ item }">
      <p class="pr-3">
        <span v-if="item.ic_repData?.length == 0">N/A</span>
        <span v-else v-for="(owner, index) in item.ic_repData">
            {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != item.ic_repData?.length! - 1">, </span>
          </span>
      </p>
    </template>

    <template #item.scc_rep="{ item }">
      <p class="pr-3">
        <span v-if="item.sc_repData?.length == 0">N/A</span>
        <span v-else v-for="(owner, index) in item.sc_repData">
            {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != item.sc_repData?.length! - 1">, </span>
          </span>
      </p>
    </template>

    <template #item.visibility="{ item }">
      <p style="max-width: 300px;">{{getVisibilityLabel(item.visibility as number)}}</p>
    </template>


    <template #item.actions="{ item }">
      <VMenu
          v-if="userData.is_superuser"
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
            <VListItem :to="{ name: 'organization-data', params: { slug: item.slug }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhEye class="mr-2" />
              </template>
              <VListItemTitle>View CMI</VListItemTitle>
            </VListItem>

            <VListItem :to="{ name: 'edit-organization', params: { slug: item.slug }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhPencil class="mr-2" />
              </template>
              <VListItemTitle>Edit CMI</VListItemTitle>
            </VListItem>

            <VListItem :to="{ name: 'organization-settings', params: { slug: item.slug }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhGear class="mr-2" />
              </template>
              <VListItemTitle>Configure CMI Settings</VListItemTitle>
            </VListItem>

            <VDivider class="my-1"></VDivider>

            <ChangeVisibilityDialog
                :id="<string>item?.uid!"
                :visibility="item?.visibility as number"
                type="organization"
                @callback="changeVisibilityCallback"
            >
              <VListItem class="action-menu-item cursor-pointer">
                <template v-slot:prepend>
                  <PhMagnifyingGlass class="mr-2" />
                </template>
                <VListItemTitle>Change CMI Visibility</VListItemTitle>
              </VListItem>
            </ChangeVisibilityDialog>

            <ConfirmationDialog
                :isWarning="item?.is_approved"
                @callback="manageOrgAdminStatusCallback(item.uid as string, !item.is_approved)"
                :confirm-content="item.is_approved ? 'Disable Consortium Member Institution' : 'Enable Consortium Member Institution'"
                :content="item.is_approved ? 'Are you sure you want to disable this consortium member institution? All project data will be not available in the users side.' : 'Are you sure you want to enable this consortium member institution?'"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhPower class="mr-2" />
                </template>
                <VListItemTitle>{{ item.is_approved ? 'Disable CMI' : 'Enable CMI' }}</VListItemTitle>
              </VListItem>
            </ConfirmationDialog>

            <ConfirmationDialog
                :isWarning="item?.is_active"
                v-if="item.is_approved"
                @callback="manageOrgStatusCallback(item.uid as string, !item.is_active)"
                :confirm-content="item.is_active ? 'Deactivate Consortium Member Institution' : 'Activate Consortium Member Institution'"
                :content="item.is_active ? 'Are you sure you want to deactivate this consortium member institution?' : 'Are you sure you want to activate this consortium member institution?'"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhX v-if="item.is_active" class="mr-2" />
                  <PhCheck v-else class="mr-2" />
                </template>
                <VListItemTitle>{{item.is_active ? 'Deactivate CMI' : 'Activate CMI'}}</VListItemTitle>
              </VListItem>
            </ConfirmationDialog>
          </VList>
        </VCard>
      </VMenu>
      <RouterLink v-else :to="{ name: 'organization-data', params: { slug: item.slug }}" class="text-bs50 text-decoration-none">
        <PhEye class="mr-2" size="16" />
      </RouterLink>
    </template>

    <template #expanded-row="{ item }">
      <tr>
        <td :colspan="headers.filter(h => h.visible).length + 1">
          <div class="pa-4">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">About {{item.acronym}}</h3>
            <div class="ql-snow">
              <div class="ql-editor description-content" v-html="item.description"></div>
            </div>
          </div>
        </td>
      </tr>
    </template>
    <template #additional-filters>
      <VCol cols="12" sm="6" md="4" lg="3" v-if="isColumnVisible('visibility')">
        <VAutocomplete
            v-model="selectedVisibilities"
            :items="visibilityOptions"
            label="Visibility"
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
        />
      </VCol>

    </template>

    <template #custom-filters>
      <!-- Container for both representative filters -->

        <div class="filter-container w-100 border border-2 rounded-lg ma-0 ma-3 pa-3 border-primary position-relative">
          <!-- Heading with tooltip for both fields -->
          <div class="d-flex align-center mb-3">
            <span class="font-weight-medium">Representative Filters</span>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                    v-bind="props"
                    size="small"
                    class="ms-2"
                    color="primary"
                >
                  mdi-information-outline
                </v-icon>
              </template>
              <span>These filters work together: first select which fields to include, then filter by specific representatives</span>
            </v-tooltip>
          </div>

          <VRow class="ma-0">
            <!-- Included Fields Filter -->
            <VCol cols="12" sm="6" md="6" lg="6">
              <VAutocomplete
                  v-model="selectedUsersOption"
                  :items="includedUserOptions"
                  :item-title="user => user.title"
                  :item-value="user => user.value"
                  label="Included Fields"
                  hint="Select which representative fields to include in the filter"
                  persistent-hint
                  density="compact"
                  variant="outlined"
                  rounded="md"
                  color="primary"
                  base-color="gs60"
                  multiple
                  chips
                  closable-chips
              />
            </VCol>

            <!-- Representative Filter -->
            <VCol cols="12" sm="6" md="6" lg="6">
              <VCombobox
                  ref="userRef"
                  v-model="selectedUsers"
                  :items="customUsers"
                  :item-title="user => user.data ? `${user.data.first_name} ${user.data.last_name || ''}` : 'Unknown'"
                  :item-value="user => user.data ? `${user.data.first_name}` : ''"
                  label="Representative"
                  hint="Select or add specific representatives to filter the results"
                  persistent-hint
                  density="compact"
                  variant="outlined"
                  rounded="md"
                  color="primary"
                  base-color="gs60"
                  multiple
                  chips
                  closable-chips
                  @update:search="handleSearch($event)"
                  :hide-no-data="false"
                  @keydown.enter="(e: any) => handleEnterKey(e)"
                  @blur="handleBlur()"
              >
                <template v-slot:no-data>
                  <VListItem @click="addCustomUser()">
                    <VListItemTitle>
                      Add {{ userSearch }} in the filter
                    </VListItemTitle>
                  </VListItem>
                </template>
              </VCombobox>
            </VCol>
          </VRow>
        </div>
    </template>

    <template #additional-toolbar-buttons>
        <VMenu
            location="bottom end"
            transition="slide-y-transition"
        >
          <template #activator="{ props }">
            <VBtn
                v-bind="props"
                variant="tonal"
                color="primary"
                rounded="md"
                class="satoshi-md me-2 filter-btn px-3"
                height="40px"
                style="font-size: 14px !important"
            >
              <PhDownload size="16" class="mr-2" />
              <span class="text-body-2">Export</span>
              <PhCaretDown size="12" class="ml-1" />
            </VBtn>
          </template>

          <VCard class="rounded-lg" min-width="200" elevation="3">
            <VList density="compact" nav>
              <VListItem
                  @click="downloadCSV"
                  :disabled="loading || organizations.length === 0"
                  class="cursor-pointer"
              >
                <template v-slot:prepend>
                  <PhDownload class="mr-2" />
                </template>
                <VListItemTitle>Download All Data</VListItemTitle>
                <VListItemSubtitle>Export all filtered results</VListItemSubtitle>
              </VListItem>

              <VListItem
                  @click="downloadVisibleCSV"
                  :disabled="loading || organizations.length === 0"
                  class="cursor-pointer"
              >
                <template v-slot:prepend>
                  <PhDownload class="mr-2" />
                </template>
                <VListItemTitle>Download Current Page</VListItemTitle>
                <VListItemSubtitle>Export visible page only</VListItemSubtitle>
              </VListItem>
            </VList>
          </VCard>
        </VMenu>
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
.filter-container {
  transition: all 0.2s ease;
}
.filter-container:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
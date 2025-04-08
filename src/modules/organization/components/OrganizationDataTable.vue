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
  PhGear
} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";
import {Organization} from "../../../interfaces/organization.interface.ts";

const {route} = useRouting();
const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore()
const {fetchAllOrganizations, fetchOrganizationCount, manageOrgStatus, manageOrgAdminStatus} = useOrganizationServices();

const organizations = ref<Organization[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(5);
const page = ref(1);
const totalItems = ref(0);
const selectedOrgStatus = ref<string | boolean>('');
const selectedOrgAdminStatus = ref<string | boolean>('');



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
  { title: 'Title', key: 'title', sortable: true, visible: true },
  { title: 'Status', key: 'status', sortable: true, visible: true },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));


const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};


const loadData = async ()=> {
  page.value = 1;
  await loadOrganizations();
  await updateTotalCount();
}

watch([itemsPerPage, selectedOrgStatus, selectedOrgAdminStatus],
    async() => {
      await loadData()
    });

watch([selectedOrgStatus],
    async () => {
      selectedOrgAdminStatus.value = true;
      await loadData()
    });


const tableFilters = computed(() => [
  {
    key: 'orgAdminStatus',
    label: 'CMI State',
    value: selectedOrgAdminStatus.value,
    items: orgAdminStatusOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'state'
  },
  {
    key: 'orgStatus',
    label: 'CMI Availability Status',
    value: selectedOrgStatus.value,
    items: orgStatusOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'state'
  },
]);

const clearFilters = () => {
  selectedOrgStatus.value = '';
  selectedOrgAdminStatus.value = '';
}

const handleFilterUpdate = ({ key, value }: { key: any, value: any }) => {
  if (key === 'orgAdminStatus') {
    selectedOrgAdminStatus.value = value;
  } else if (key === 'orgStatus') {
    selectedOrgStatus.value = value;
    if (value !== '') {
      selectedOrgAdminStatus.value = true;
    }
  }
};


const loadOrganizations = async () => {
  loading.value = true;
  try {
    const data = await fetchAllOrganizations(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedOrgAdminStatus.value,
        selectedOrgStatus.value

    );
    organizations.value = data;
  } catch (error) {
    console.error('Failed to load repositories:', error);
  } finally {
    loading.value = false;
  }
};




const updateTotalCount = async () => {
  try {
    // Pass search and priority level to get accurate count
    totalItems.value = await fetchOrganizationCount(
        page.value,
        10000,
        search.value,
        selectedOrgAdminStatus.value,
        selectedOrgStatus.value
    );


  } catch (error) {
    console.error('Failed to get total count:', error);
    totalItems.value = 0;
  }
};


onMounted(async () => {
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
          <VImg :src="item.image as string" alt="Project" />
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
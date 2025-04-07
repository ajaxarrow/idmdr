<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import { useSnackbarStore } from "../../../core/stores/snackbar.store.ts";
import { useUserManagementServices } from "../services/user-management.services.ts";
import { computed, onMounted, ref, watch } from "vue";
import { PhCheck, PhDotsThreeOutlineVertical, PhX, PhPower } from "@phosphor-icons/vue";
import { User } from "../../../interfaces/member.interface.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";

import { Status } from "../../../interfaces/enums/status.enum.ts";
import BaseDataTable from "../components/datatable/BaseDataTable.vue";

const { showSnackbarMessage } = useSnackbarStore();
const { fetchAllUsers, fetchTotalUsers, manageUserStatus } = useUserManagementServices();

const selectedUserAccountStatus = ref<string | boolean>('');
const selectedUserAvailabilityStatus = ref<string | boolean>('');
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(5);
const page = ref(1);
const totalItems = ref(0);
const users = ref<User[]>([]);

watch([selectedUserAccountStatus, selectedUserAvailabilityStatus], async () => {
  page.value = 1;
  await loadUsers();
  await fetchTotalUsers();
})

const manageUserStatusCallback = async (id: string, value: boolean, isForAccount: boolean) => {
  await manageUserStatus(id, value, isForAccount);
  if (isForAccount) {
    showSnackbarMessage(`User Account ${value ? 'Enabled' : 'Disabled'} Successfully`, Status.success);
  } else {
    showSnackbarMessage(`User Account ${value ? 'Approved' : 'Deactivated'} Successfully`, Status.success);
  }
  await loadUsers();
};

const userStatusOptions = [
  { title: 'All Statuses', value: '' },
  { title: 'Waiting for Approval', value: false },
  { title: 'Active', value: true },
];

const userAccountStatusOptions = [
  { title: 'All Status', value: '' },
  { title: 'Enabled', value: true },
  { title: 'Disabled', value: false },
];

const getStatusInfo = (user: User) => {
  if (!user.is_active) {
    return {
      status: 'Disabled',
      color: 'error',
      icon: PhX,
      tooltip: 'Account is disabled by admin'
    };
  } else if (user.is_approved) {
    return {
      status: 'Approved',
      color: 'success',
      icon: PhCheck,
      tooltip: 'Account is already approved by admin'
    };
  } else {
    return {
      status: 'Waiting for Approval',
      color: 'warning',
      icon: PhPower,
      tooltip: 'Account is waiting for admin approval'
    };
  }
};

const headers = computed(() => [
  { title: 'Full Name', key: 'full_name', sortable: true, visible: true },
  { title: 'Username', key: 'username', sortable: true, visible: false },
  { title: 'Status', key: 'status', sortable: true, visible: true },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);


const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));

const updateColumnVisibility = (selectedKeys) => {
  selectedColumns.value = selectedKeys;
};

// Configure filters for the BaseDataTable component
const tableFilters = computed(() => [
  {
    key: 'userAvailabilityStatus',
    label: 'User Availability Status',
    value: selectedUserAvailabilityStatus.value,
    items: userStatusOptions,
    itemTitle: (type) => type.title,
    itemValue: (type) => type.value,
    visibleKey: 'status'
  },
  {
    key: 'userAccountStatus',
    label: 'User Account Status',
    value: selectedUserAccountStatus.value,
    items: userAccountStatusOptions,
    itemTitle: (type) => type.title,
    itemValue: (type) => type.value,
    visibleKey: 'status'
  }
]);

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await fetchAllUsers(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedUserAvailabilityStatus.value,
        selectedUserAccountStatus.value,
    );
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loading.value = false;
  }
};

const handleFilterUpdate = ({ key, value }) => {
  if (key === 'userAvailabilityStatus') {
    selectedUserAvailabilityStatus.value = value;
    // Auto-set active accounts when selecting an availability status
    if (value !== '') {
      selectedUserAccountStatus.value = true;
    }
  } else if (key === 'userAccountStatus') {
    selectedUserAccountStatus.value = value;
  }
};

const clearFilters = () => {
  selectedUserAccountStatus.value = '';
  selectedUserAvailabilityStatus.value = '';
};

const updateTotalCount = async () => {
  try {
    totalItems.value = await fetchTotalUsers();
  } catch (error) {
    console.error('Failed to get total count:', error);
  }
};

onMounted(async () => {
  await updateTotalCount();
  await loadUsers();
});
</script>

<template>
  <MainLayout title="User Management">
    <BaseDataTable
        title="All Users"
        subtitle="Manage All Users across the system"
        :headers="headers"
        :items="users"
        :loading="loading"
        :totalItems="totalItems"
        searchPlaceholder="Search users..."
        emptyStateHeader="No Users Found"
        emptyStateDescription="There are no users found matching your search criteria"
        :filters="tableFilters"
        @update:search="search = $event"
        @update:page="page = $event"
        @update:itemsPerPage="itemsPerPage = $event"
        @update:selectedColumns="updateColumnVisibility"
        @loadData="loadUsers"
        @clearFilters="clearFilters"
        @update:filter="handleFilterUpdate"
    >
      <!-- Full Name column slot -->
      <template #item.full_name="{ item }: { item: User }">
        <div class="d-flex align-center" style="max-width: 400px;">
          <VAvatar
              size="36"
              class="me-2"
          >
            <VImg :src="item.profile_picture as string ?? 'https://mighty.tools/mockmind-api/content/abstract/46.jpg'" alt="Project" />
          </VAvatar>
          <div>
            <p class="font-weight-medium mb-0">{{ item.first_name ? item.first_name : item.username }} {{item.last_name}}</p>
            <p class="text-caption text-medium-emphasis mb-0">{{item.email}}</p>
          </div>
        </div>
      </template>

      <!-- Status column slot -->
      <template #item.status="{ item }: { item: User }">
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

      <!-- Actions column slot -->
      <template #item.actions="{ item }: { item: User }">
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
              <ConfirmationDialog
                  @callback="manageUserStatusCallback(item.uid as string, !item.is_active, true)"
                  :confirm-content="item.is_active ? `Disable Account` : `Enable Account`"
                  :content="item.is_active ? 'Are you sure you want to disable this account? All project data will be deleted.' : 'Are you sure you want to enable this account?'"
              >
                <VListItem class="action-menu-item">
                  <template v-slot:prepend>
                    <PhPower class="mr-2" />
                  </template>
                  <VListItemTitle>{{ item.is_active ? 'Disable User Account' : 'Enable Account' }}</VListItemTitle>
                </VListItem>
              </ConfirmationDialog>

              <ConfirmationDialog
                  v-if="item.is_active"
                  @callback="manageUserStatusCallback(item.uid as string, !item.is_approved, false)"
                  :confirm-content="item.is_approved ? 'Deactivate User' : 'Activate User Account'"
                  :content="item.is_approved ? 'Are you sure you want to deactivate this account? All project data will be deleted.' : 'Are you sure you want to activate this account?'"
              >
                <VListItem class="action-menu-item">
                  <template v-slot:prepend>
                    <PhX v-if="item.is_approved" class="mr-2" />
                    <PhCheck v-else class="mr-2" />
                  </template>
                  <VListItemTitle>{{item.is_approved ? 'Deactivate User Account' : 'Activate User Account'}}</VListItemTitle>
                </VListItem>
              </ConfirmationDialog>
            </VList>
          </VCard>
        </VMenu>
      </template>
    </BaseDataTable>
  </MainLayout>
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
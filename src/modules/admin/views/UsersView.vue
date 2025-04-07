<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useUserManagementServices} from "../services/user-management.services.ts";
import {computed, onMounted, ref, watch} from "vue";
import {PhCheck, PhDotsThreeOutlineVertical, PhFunnel, PhMagnifyingGlass, PhPower, PhX} from "@phosphor-icons/vue";
import {User} from "../../../interfaces/member.interface.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import {usePageSizeHelper} from "../../../core/composables/usePageSizeHelper.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";

const {showSnackbarMessage} = useSnackbarStore()
const {generatePageSizeIncrements} = usePageSizeHelper();
const {fetchAllUsers, fetchTotalUsers, manageUserStatus} = useUserManagementServices()
const selectedUserAccountStatus = ref<string | boolean>('')
const selectedUserAvailabilityStatus = ref<string | boolean>('')
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(5);
const page = ref(1);
const totalItems = ref(0);
const users = ref<User[]>([])
const showFilterDrawer = ref(false)

const manageUserStatusCallback = async (id: string, value: boolean, isForAccount: boolean) => {
  await manageUserStatus(id, value, isForAccount)
  if(isForAccount){
    showSnackbarMessage(`User Account ${value ?  'Enabled' : 'Disabled'} Successfully`, Status.success)
  } else {
    showSnackbarMessage(`User Account ${value ?  'Approved' : 'Deactiviated'} Successfully`, Status.success)
  }
  await loadUsers()
}

const userStatusOptions = [
  { title: 'All Statuses', value: '' },
  { title: 'Waiting for Approval', value: false},
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
  // { title: 'Email', key: 'email', sortable: true, visible: true },
  { title: 'Status', key: 'status', sortable: true, visible: true },
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

const resetAllFilters = () => {
  selectedUserAccountStatus.value = '';
  selectedUserAvailabilityStatus.value = '';
  selectedColumns.value = headers.value.filter(h => h.key !== 'username').map(h => h.key);
}

const loadUsers = async () => {
  loading.value = true;
  try{
    users.value = await fetchAllUsers(
      page.value,
      itemsPerPage.value,
      search.value,
      selectedUserAvailabilityStatus.value,
      selectedUserAccountStatus.value,
    )
  } catch (error: any) {
    console.error('Failed to load repositories:', error);
  } finally {
    loading.value = false;
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  loadUsers();
};

watch([search, selectedUserAvailabilityStatus, selectedUserAccountStatus, itemsPerPage], () => {
  page.value = 1;
  loadUsers();
  updateTotalCount();
})

watch([selectedUserAvailabilityStatus], () => {
  selectedUserAccountStatus.value = true;
  page.value = 1;
  loadUsers();
  updateTotalCount();
})

const updateTotalCount = async () => {
  try{
    totalItems.value = await fetchTotalUsers()
  } catch (error: any) {
    console.error('Failed to get total count:', error);
  }
};

onMounted(async () => {
  await updateTotalCount();
  await loadUsers();

})

</script>

<template>
  <MainLayout title="User Management">
    <div class="relative-container circle-quarter" style="height: 100%">
      <!-- Header Section with subtle improvements -->
      <div class="pa-6 relative-container" style="z-index: 20">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-heading d-flex align-center">
              All Users
            </p>
            <p class="text-subtitle">Manage All Users across the system</p>
          </div>
          <div>
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
              <div v-if="showFilterDrawer" class="filter-drawer px-4 pb-3 pt-2">
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


                  <!-- Project Status filter -->
                  <VCol cols="12" sm="6" md="4" lg="3" v-if="isColumnVisible('status')">
                    <VSelect
                        v-model="selectedUserAvailabilityStatus"
                        :items="userStatusOptions"
                        :item-title="type => type.title"
                        :item-value="type => type.value"
                        label="User Availability Status"
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
                  <VCol cols="12" sm="6" md="4" lg="3" v-if="isColumnVisible('status')">
                    <VSelect
                        v-model="selectedUserAccountStatus"
                        :items="userAccountStatusOptions"
                        :item-title="type => type.title"
                        :item-value="type => type.value"
                        label="User Account Status"
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

            <VDataTableServer
                v-model:items-per-page="itemsPerPage"
                :headers="visibleHeaders"
                :items="users"
                :loading="loading"
                :items-length="totalItems"
                :items-per-page-options="generatePageSizeIncrements(totalItems)"
                @update:page="handlePageChange"
                class="elevation-0"
            >
              <template v-slot:item.full_name="{ item }">
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
              <template v-slot:item.state="{ item }">
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

              <template v-slot:no-data>
                <EmptyStateInfo
                    header="No Users Found"
                    description="There are no users found matching your search criteri`"
                    :isCallbackNeeded="search !== ''"
                    @callback="search = ''"
                />
              </template>
            </VDataTableServer>
          </VSheet>
        </VContainer>
      </div>
    </div>
  </MainLayout>
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
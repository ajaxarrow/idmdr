<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";
import {Expert, Name} from "../../../interfaces/organization.interface.ts";
import {expertise} from "../../../data/repository.inventory.fields.ts";
import {onMounted, watch, computed, ref} from "vue";
import {
  PhCaretDown,
  PhDotsThreeOutlineVertical,
  PhDownload,
  PhEye,
  PhPencil,
  PhPlus,
  PhTrash
} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {Post} from "../../../interfaces/post.interface.ts";
import Papa from "papaparse";

const {userData} = useUserStore()
const {route} = useRouting()
const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchAllOrganizationsBasicData, fetchOrganizationIDsByUser} = useOrganizationServices();
const {arrayToString} = useStringArrayHelper()
const {fetchExpertsByAdmin, fetchTotalExperts, deleteExpert} = useOrganizationExpertsServices()
const selectedOrganization = ref<string>('');
const experts = ref<Expert[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedExpertise = ref<string[]>([]);
const convertedExpertise = computed(() => arrayToString(selectedExpertise.value.map((item: any) => item.value)));
const organizations = ref<any[]>([]);

const deleteExpertCallback = async (uuid: string) => {
  showSnackbarMessage('Expert Deleted Successfully', Status.success)
  await deleteExpert(uuid);
  await loadData();
}

const expertiseOptions = [
  { title: "All", value: "" },
  ...expertise.slice().sort().map((item) => ({
    title: item,
    value: item,
  })),
];

const headers = computed(() => [
  { title: 'Name', key: 'name', sortable: true, visible: true },
  { title: 'Expertise', key: 'expertise', sortable: true, visible: true },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));

const isColumnVisible = (key: string) => {
  const column = headers.value.find((h: any) => h.key === key);
  return column ? selectedColumns.value.includes(key) : false;
};

const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};

const tableFilters = computed(() => [

]);

const clearFilters = () => {
  selectedExpertise.value = [];
}

const handleFilterUpdate = ({ key, value }: { key: any, value: any }) => {
  if(key === 'expertise') {
    selectedExpertise.value = value
  }
}

const loadData = async ()=> {
  page.value = 1;
  await loadExperts();
  await updateTotalCount();
}

const loadExperts = async() => {
  loading.value = true;
  try{
    experts.value = await fetchExpertsByAdmin(
        page.value,
        itemsPerPage.value,
        search.value,
        route.name == 'organization-experts' && route.params.slug ? route.params.slug as string : selectedOrganization.value,
        convertedExpertise.value,
        !userData.is_superuser

    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const updateTotalCount = async() => {
  totalItems.value = await fetchTotalExperts(1, 10000000, search.value, route.name == 'organization-experts' && route.params.slug ? route.params.slug as string : selectedOrganization.value, convertedExpertise.value, !userData.is_superuser);
}

const getNameComponent = (nameField: Name | string | undefined, component: keyof Name): string => {
  if (typeof nameField === 'object' && nameField !== null) {
    return nameField[component] || '';
  }
  return '';
};

// Helper function to get full name
const getFullName = (nameField: Name | string | undefined): string => {
  if (typeof nameField === 'string') {
    return nameField;
  }
  if (typeof nameField === 'object' && nameField !== null) {
    const parts = [
      nameField.salutation,
      nameField.first_name,
      nameField.middle_name,
      nameField.last_name,
      nameField.extension
    ].filter(part => {
      //@ts-ignore
      return part && typeof part === 'string' && part.trim() !== ''
    });
    return parts.join(' ');
  }
  return '';
};
const downloadCSV = async () => {
  try {
    const allData = await fetchExpertsByAdmin(
        1,
        1000,
        search.value,
        route.name == 'organization-experts' && route.params.slug ? route.params.slug as string : selectedOrganization.value,
        convertedExpertise.value,
        !userData.is_superuser

    );

    // Transform data for CSV export
    const csvData = allData.map((expert: Expert) => {
      return {
        'UID': expert.uid || '',
        'Salutation': getNameComponent(expert.name, 'salutation'),
        'First Name': getNameComponent(expert.name, 'first_name'),
        'Middle Name': getNameComponent(expert.name, 'middle_name'),
        'Last Name': getNameComponent(expert.name, 'last_name'),
        'Extension': getNameComponent(expert.name, 'extension'),
        'Full Name': getFullName(expert.name),
        'Expertise': convertedExpertise.value,
        'Contact': expert.contact
            ? expert.contact.value
            : '',
        'Associated CMI': typeof expert.organization === 'object' && expert.organization !== null
            ? expert.organization.name || ''
            : expert.organization || '',
        'Additional Info': expert.additional_info
            ? expert.additional_info.replace(/<[^>]*>/g, '')
            : '',
        'Created Date': expert.created_at
            ? new Date(expert.created_at).toLocaleDateString()
            : '',
        'Updated Date': expert.updated_at
            ? new Date(expert.updated_at).toLocaleDateString()
            : '',
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
      let filename = `experts_${currentDate}`;

      // Add filter info to filename if filters are applied
      if (search.value) {
        filename += `_search-${search.value.replace(/[^a-zA-Z0-9]/g, '_')}`;
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
  }
};

const downloadVisibleCSV = () => {

  try {
    const csvData = experts.value.map((expert: Expert) => {
      return {
        'UID': expert.uid || '',
        'Salutation': getNameComponent(expert.name, 'salutation'),
        'First Name': getNameComponent(expert.name, 'first_name'),
        'Middle Name': getNameComponent(expert.name, 'middle_name'),
        'Last Name': getNameComponent(expert.name, 'last_name'),
        'Extension': getNameComponent(expert.name, 'extension'),
        'Full Name': getFullName(expert.name),
        'Expertise': convertedExpertise.value,
        'Contact': expert.contact
            ? expert.contact.value
            : '',
        'Associated CMI': typeof expert.organization === 'object' && expert.organization !== null
            ? expert.organization.name || ''
            : expert.organization || '',
        'Additional Info': expert.additional_info
            ? expert.additional_info.replace(/<[^>]*>/g, '')
            : '',
        'Created Date': expert.created_at
            ? new Date(expert.created_at).toLocaleDateString()
            : '',
        'Updated Date': expert.updated_at
            ? new Date(expert.updated_at).toLocaleDateString()
            : '',
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
      const filename = `experts_page-${page.value}_${currentDate}.csv`;

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
  }
};

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

watch([selectedOrganization, selectedExpertise], async () => {
  await loadData();
})

onMounted(async () => {
  organizations.value = [
    { uid: '', name: 'All', acronym: '' },
    ...(userData.is_superuser
        ? await fetchAllOrganizationsBasicData(1, 1000)
        : await fetchOrganizationIDsByUser())
  ];
  await loadData()
})


</script>

<template>
  <BaseDataTable
      title="All Experts"
      subtitle="Create and manage all experts across NOMCAARRD"
      :items="experts"
      :headers="headers"
      :loading="loading"
      :totalItems="totalItems"
      searchPlaceholder="Search experts..."
      emptyStateHeader="`No Experts found"
      :mptyStateDescription="`There are no experts found matching your criteria`"
      :filters="tableFilters"
      :itemsPerPageOptions="itemsPerPage"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @update:selectedColumns="updateColumnVisibility"
      @loadData="loadExperts"
      @clearFilters="clearFilters"
      @update:filter="handleFilterUpdate"
      @refreshData="loadData"
      :expandable="true"
      :showCircle="route.name !== 'organization-experts' && getFirstPath(<string>route.path) != 'cmis'"
  >
    <template #header-actions>
      <VBtnPrimaryFilled :to="{name: 'new-expert'}" v-if="isSmall || isTablet" icon >
        <PhPlus size="16"/>
      </VBtnPrimaryFilled>
      <VBtnPrimaryFilled :to="{name: 'new-expert'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
        <PhPlus size="16" class="mr-2"/>
        New Expert
      </VBtnPrimaryFilled>
    </template>

    <template #item.name="{ item }">
        <div>
          <p class="font-weight-medium mb-0">{{ typeof item?.name === 'object'
              ? `${item?.name?.salutation ? item?.name?.salutation : ''} ${item?.name?.first_name || ''} ${item?.name?.middle_name || ''} ${item?.name?.last_name || ''} ${item?.name?.extension || ''}`.trim()
              : item?.name || '' }}</p>
          <p class="text-caption text-medium-emphasis mb-0">{{item.organization?.name}} ({{item.organization?.acronym}})</p>
        </div>
    </template>

    <template #item.expertise="{ item }">
      <p class="text-subtitle">{{ arrayToString(item.expertise as string[])}}</p>
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
            <VListItem :to="{ name: 'organization-experts-details', params: { expert: item.uid, slug: item.organization.uid }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhEye class="mr-2" />
              </template>
              <VListItemTitle>View Expert Details</VListItemTitle>
            </VListItem>

            <VListItem :to="{ name: 'edit-expert', params: { slug: item.uid }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhPencil class="mr-2" />
              </template>
              <VListItemTitle>Edit Expert</VListItemTitle>
            </VListItem>

            <VDivider class="my-1"></VDivider>
            <ConfirmationDialog
                :isWarning="true"
                @callback="deleteExpertCallback(item.uid as string)"
                confirm-content="Delete Expert"
                content="Are you sure you want to delete this expert?"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhTrash class="mr-2" />
                </template>
                <VListItemTitle>Delete Expert</VListItemTitle>
              </VListItem>
            </ConfirmationDialog>
          </VList>
        </VCard>
      </VMenu>
    </template>

    <template #expanded-row="{ item }">
      <tr>
        <td :colspan="headers.filter(h => h.visible).length + 1">
          <div class="pa-4">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Additional Info</h3>
            <div class="ql-snow">
              <div class="ql-editor description-content" v-html="item.additional_info"></div>
            </div>
          </div>
        </td>
      </tr>
    </template>

    <template #additional-filters>
      <VCol cols="12" sm="6" md="4" lg="3" v-if="route.name !== 'organization-experts'">
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
      <VCol cols="12" sm="6" md="4" lg="3" v-if="isColumnVisible('expertise')">
        <VCombobox
            v-model="selectedExpertise"
            :items="expertiseOptions"
            label="Expertise"
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
                :disabled="loading || expertise.length === 0"
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
                :disabled="loading || expertise.length === 0"
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
</style>
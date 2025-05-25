<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {useTags} from "../../repository/composables/useTags.ts";
import {computed, onMounted, ref, watch} from "vue";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useSectorServices} from "../services/sector.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";
import {PhCaretDown, PhDotsThreeOutlineVertical, PhDownload, PhPencil, PhPlus, PhTrash,} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {expertise} from "../../../data/repository.inventory.fields.ts";
import {Expert} from "../../../interfaces/organization.interface.ts";
import Papa from "papaparse";

const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore()
const {arrayToString, stringToArray} = useStringArrayHelper()
const {tags, fetchTags} = useTags();
const {route} = useRouting()
const {fetchAllOrganizationsBasicData} = useOrganizationServices()
const {fetchRepositoryIDsByUser} = useRepositoryServices()
const {deleteSector, fetchSectorTotalCount, fetchAllSectors} = useSectorServices()
const selectedEntity = ref<string>('');
const sectors = ref<Sector[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedType = ref<number>(0);
const selectedTags = ref<string[]>([]);
const convertedTags = computed(() => arrayToString(selectedTags.value));
const repositories = ref<any[]>([]);
const cmis = ref<any[]>([]);
const selectedRepository = ref('')
const selectedCmi = ref('')
const showFilters = ref(false);

const deleteSectorCallback = async (id: string) => {
  await deleteSector(id);
  showSnackbarMessage('Associated Area Deleted Successfully', Status.success)
  await loadSectors();
}

const typeOptions = [
  { title: 'All', value: 0 },
  { title: 'CMI', value: 8888 },
  { title: 'Project', value: 9999 },
]

const headers = computed(() => [
    { title: 'Title', key: 'name', sortable: false, visible: true },
    { title: 'Associated Entity', key: 'entity', sortable: false, visible: true },
    { title: 'Tags', key: 'tags', sortable: false, visible: true },
    { title: 'Actions', key: 'actions', sortable: false, visible: true },
  ]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));

const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};

const tableFilters = computed(() => [

])

const isColumnVisible = (key: string) => {
  const column = headers.value.find((h: any) => h.key === key);
  return column ? selectedColumns.value.includes(key) : false;
};

const handleFilterUpdate = () => {

};

const clearFilters = () => {
  selectedCmi.value = '';
  selectedRepository.value = '';
  selectedEntity.value = '';
  selectedType.value = 0;
  selectedTags.value = [];
}

const loadSectors = async () => {
  loading.value = true;
  try {
    const data = await fetchAllSectors(
      page.value,
      itemsPerPage.value,
      search.value,
      selectedType.value,
      selectedEntity.value,
      convertedTags.value as string
    );
    sectors.value = data;
  } catch (error) {
    showSnackbarMessage('Error loading sectors', Status.error);
  } finally {
    loading.value = false;
  }
};

const updateTotalCount = async () => {
  try {
    const count = await fetchSectorTotalCount(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedType.value,
        selectedEntity.value,
        convertedTags.value as string
    );
    totalItems.value = count;
  } catch (error) {
    showSnackbarMessage('Error fetching total count', Status.error);
  }
};

const loadData = async () => {
  page.value = 1;
  await loadSectors();
  await updateTotalCount();
};

const downloadCSV = async () => {
  try {
    const allData = await fetchAllSectors(
        page.value,
        itemsPerPage.value,
        search.value,
        selectedType.value,
        selectedEntity.value,
        convertedTags.value as string
    );

    // Transform data for CSV export
    const csvData = allData.map((sector: Sector) => {
      return {
        'UID': sector.uid || '',
        'Name': sector.name || '',
        'Description': sector.description
            ? sector.description.replace(/<[^>]*>/g, '') // Remove HTML tags
            : '',
        'Associated Entity': sector.parent === 'Organization'
            ? sector.orgData?.name || ''
            : sector.repoData?.title || '',
        'Additional Info': sector.additional_info
            ? sector.additional_info.replace(/<[^>]*>/g, '')
            : '',
        'Created Date': sector.created_at
            ? new Date(sector.created_at).toLocaleDateString()
            : '',
        'Owner': sector.owner
            ? `${sector.owner.first_name} ${sector.owner.last_name}` : '',
        'Updated Date': sector.updated_at
            ? new Date(sector.updated_at).toLocaleDateString()
            : '',
        'GeoJSON': sector.geojson
            ? JSON.stringify(sector.geojson).replace(/"/g, '""')
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
      let filename = `associated_areas_${currentDate}`;

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
    const csvData = sectors.value.map((sector: Sector) => {
      return {
        'UID': sector.uid || '',
        'Name': sector.name || '',
        'Description': sector.description
            ? sector.description.replace(/<[^>]*>/g, '') // Remove HTML tags
            : '',
        'Associated Entity': sector.parent === 'Organization'
            ? sector.orgData?.name || ''
            : sector.repoData?.title || '',
        'Additional Info': sector.additional_info
            ? sector.additional_info.replace(/<[^>]*>/g, '')
            : '',
        'Created Date': sector.created_at
            ? new Date(sector.created_at).toLocaleDateString()
            : '',
        'Owner': sector.owner
            ? `${sector.owner.first_name} ${sector.owner.last_name}` : '',
        'Updated Date': sector.updated_at
            ? new Date(sector.updated_at).toLocaleDateString()
            : '',
        'GeoJSON': sector.geojson
            ? JSON.stringify(sector.geojson).replace(/"/g, '""')
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
      const filename = `associated_areas_page-${page.value}_${currentDate}.csv`;

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

watch(
    () => route.query.tag,
    (newTagQuery) => {
      if (newTagQuery) {
        selectedTags.value = stringToArray(newTagQuery as string);
        showFilters.value = true;
      } else {
        selectedTags.value = [];
      }
    }
);

const initTagsFromRoute = () => {
  if (route.query.tag) {
    selectedTags.value = stringToArray(route.query.tag as string);
    showFilters.value = true;
  }
};



watch(() => selectedCmi.value, async () => {
  selectedEntity.value = selectedCmi.value;
});

watch(() => selectedRepository.value, async () => {
  selectedEntity.value = selectedRepository.value;
});


watch([selectedEntity, search, selectedType, selectedTags], async () => {
  await loadData();
});

onMounted(async () => {
  loading.value = true;
  initTagsFromRoute();
  fetchTags();
  cmis.value =  [{ uid: '', name: 'All', acronym: '' }, ...(await fetchAllOrganizationsBasicData(1, 1000))];
  repositories.value = [{ uid: '', title: 'All', slug: '' }, ...(await fetchRepositoryIDsByUser(
      10000, false))];
  await loadData();
});


</script>

<template>
  <MainLayout title="Associated Areas">
    <BaseDataTable
        id="uid"
        title="All Associated Areas"
        subtitle="Browse and manage associated areas, boundaries and locations in NOMCAARRD"
        :headers="headers"
        :items="sectors"
        :loading="loading"
        :totalItems="totalItems"
        searchPlaceholder="Search Associated Areas"
        emptyStateHeader="No Associated Areas Found"
        emptyStateDescription="No associated areas found. Please check your filters or add a new associated area."
        :filters="tableFilters"
        :itemsPerPageOptions="itemsPerPage"
        @update:search="search = $event"
        @update:page="page = $event"
        @update:itemsPerPage="itemsPerPage = $event"
        @update:selectedColumns="updateColumnVisibility"
        @loadData="loadSectors"
        @clearFilters="clearFilters"
        @update:filter="handleFilterUpdate"
        @refreshData="loadData"
        :expandable="true"
        :showFilter="showFilters"
    >
      <template #header-actions>
        <VBtnPrimaryFilled :to="{ name: 'new-sector' }" v-if="isSmall || isTablet" icon>
          <PhPlus size="16" />
        </VBtnPrimaryFilled>
        <VBtnPrimaryFilled
            :to="{ name: 'new-sector' }"
            v-else
            height="45px"
            rounded="lg"
            class="satoshi-md"
            style="font-size: 14px !important"
        >
          <PhPlus size="16" class="mr-2" />
          New Associated Area
        </VBtnPrimaryFilled>
      </template>
      <template #item.name="{ item }">
        <div class="d-flex align-center" style="max-width: 400px;">
          <VAvatar
              size="36"
              class="me-2"
          >
            <VImg :src="item.image as string" alt="Project" />
          </VAvatar>
          <div>
            <p class="font-weight-medium mb-0">{{ item.name }}</p>
            <p v-if="item.parent === 'Organization' " class="text-caption text-medium-emphasis mb-0" >
              {{ item.parent_obj?.name }} ({{ item.parent_obj?.acronym }})
            </p>
            <p v-else class="text-caption text-medium-emphasis mb-0" >
              {{ item.parent_obj?.title  }}
            </p>
          </div>
        </div>
      </template>

      <template #item.entity="{ item }">
        <span class="province-title">{{ item.parent === 'Organization' ? 'Consortium Member Organization' : 'Project' }}</span>
      </template>

      <template #item.tags="{ item }">
        <p style="max-width: 300px;">{{arrayToString(item.tags as string[])}}</p>
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
              <VListItem :to="{ name: 'edit-sector', params: { slug: item.slug }}" class="action-menu-item">
                <template v-slot:prepend>
                  <PhPencil class="mr-2" />
                </template>
                <VListItemTitle>Edit Sector</VListItemTitle>
              </VListItem>
              <VDivider class="my-1"></VDivider>
              <ConfirmationDialog
                  :isWarning="true"
                  @callback="deleteSectorCallback(item.uid as string)"
                  confirm-content="Delete Sector"
                  content="Are you sure you want to delete this Sector?"
              >
                <VListItem class="action-menu-item">
                  <template v-slot:prepend>
                    <PhTrash class="mr-2" />
                  </template>
                  <VListItemTitle>Delete Sector</VListItemTitle>
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
              <h3 class="text-subtitle-1 font-weight-bold mb-2">Description</h3>
              <div class="ql-snow">
                <div class="ql-editor description-content" v-html="item.description"></div>
              </div>
            </div>
          </td>
        </tr>
      </template>
      <template #additional-filters>
        <VCol cols="12" sm="6" md="4" lg="3" v-if="isColumnVisible('tags')">
          <VCombobox
              v-model="selectedTags"
              :items="tags"
              label="Tags"
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
        <VCol cols="12" sm="6" md="4" lg="3">
          <VSelect
              v-model="selectedType"
              :items="typeOptions"
              :item-value="type => type.value"
              :item-title="type => `${type.title}`"
              label="Associated Entity"
              hide-details
              density="compact"
              variant="outlined"
              rounded="md"
              color="primary"
              base-color="gs60"
              class="mb-3"
          />
        </VCol>
        <VCol cols="12" sm="6" md="4" lg="3" v-if="selectedType !== 30">
          <VSelect
              v-model="selectedCmi"
              :items="cmis"
              :item-title="organization => organization.acronym ? `${organization.name} (${organization.acronym})` : organization.name"
              :item-value="organization => `${organization.uid}`"
              label="CMI"
              hide-details
              density="compact"
              variant="outlined"
              rounded="md"
              color="primary"
              base-color="gs60"
              class="mb-3"
          />
        </VCol>
        <VCol cols="12" sm="6" md="4" lg="3" v-if="selectedType !== 14">
          <VSelect
              v-model="selectedRepository"
              :items="repositories"
              :item-value="repository => `${repository.slug}`"
              :item-title="repository => `${repository.title}`"
              label="Technologies"
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
                  :disabled="loading || sectors.length === 0"
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
                  :disabled="loading || sectors.length === 0"
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
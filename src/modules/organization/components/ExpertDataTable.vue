<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";
import {Expert} from "../../../interfaces/organization.interface.ts";
import {expertise} from "../../../data/repository.inventory.fields.ts";
import {onMounted, watch, computed, ref} from "vue";
import {PhDotsThreeOutlineVertical, PhEye, PhPencil, PhPlus, PhTrash} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";

const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchAllOrganizationsBasicData} = useOrganizationServices();
const {arrayToString} = useStringArrayHelper()
const {fetchExpertsByAdmin, fetchTotalExperts, deleteExpert} = useOrganizationExpertsServices()
const selectedOrganization = ref<string>('');
const experts = ref<Expert[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const selectedExpertise = ref<string>('');
const organizations = ref<any[]>([]);

const deleteExpertCallback = async (uuid: string) => {
  showSnackbarMessage('Expert Deleted Successfully', Status.success)
  await deleteExpert(uuid);
  await loadData();
}

const expertiseOptions = [
  { title: "All", value: "" },
  ...expertise.map((item) => ({
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


const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};

const tableFilters = computed(() => [
  {
    key: 'expertise',
    label: 'Expertise',
    value: selectedExpertise.value,
    items: expertiseOptions,
    itemTitle: (type: any) => type.title,
    itemValue: (type: any) => type.value,
    visibleKey: 'expertise',
  },
]);

const clearFilters = () => {
  selectedExpertise.value = '';
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
        selectedOrganization.value,
        selectedExpertise.value
    );
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const updateTotalCount = async() => {
  totalItems.value = await fetchTotalExperts(1, 10000000, search.value, selectedOrganization.value, selectedExpertise.value);
}

watch([selectedOrganization, selectedExpertise], async () => {
  await loadData();
})

onMounted(async () => {
  organizations.value = [{ uid: '', name: 'All', acronym: '' }, ...(await fetchAllOrganizationsBasicData(1, 1000))];
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
              ? `${item?.name?.first_name || ''} ${item?.name?.middle_name || ''} ${item?.name?.last_name || ''} ${item?.name?.extension || ''}`.trim()
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
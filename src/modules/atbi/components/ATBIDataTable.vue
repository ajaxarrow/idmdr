<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {useAtbiServices} from "../services/atbi.services.ts";
import {ATBI} from "../../../interfaces/atbi.interface.ts";
import {onMounted, ref, watch, computed} from "vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {
  PhDotsThreeOutlineVertical,
  PhEnvelope,
  PhEye,
  PhFacebookLogo,
  PhPencil,
  PhPhone,
  PhPlus,
  PhTrash
} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import BaseDataTable from "../../admin/components/datatable/BaseDataTable.vue";

const { isSmall, isTablet } = useScreenStore();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchRepositoryIDsByUser} = useRepositoryServices()
const {fetchAllAtbis, fetchTotalAtbisCount, deleteAtbi} = useAtbiServices()
const selectedTechnology = ref<string>('');
const atbis = ref<ATBI[]>([]);
const loading = ref(false);
const search = ref('');
const itemsPerPage = ref(10);
const page = ref(1);
const totalItems = ref(0);
const technologies = ref<any[]>([]);

const deleteAtbiCallback = async (uuid: string) => {
  await deleteAtbi(uuid);
  showSnackbarMessage('ATBI Deleted Successfully', Status.success);
  await loadData();

}

const headers = computed(() => [
  { title: 'Name', key: 'name', sortable: true, visible: true },
  { title: 'Owners', key: 'owners', sortable: true, visible: true },
  { title: 'Contact Information', key: 'contact', sortable: false, visible: true },
  { title: 'Actions', key: 'actions', sortable: false, visible: true },
]);

const selectedColumns = ref(headers.value.filter(h => h.visible).map(h => h.key));
const updateColumnVisibility = (selectedKeys: string[]) => {
  selectedColumns.value = selectedKeys;
};

const tableFilters = computed(() => [

]);

const clearFilters = () => {

}

const handleFilterUpdate = () => {

}

const loadData = async () => {
  page.value = 1;
  await updateTotalCount();
  await loadAtbis();
}

const loadAtbis = async () => {
  loading.value = true;
  try {
    atbis.value = await fetchAllAtbis(page.value, itemsPerPage.value, search.value, selectedTechnology.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const updateTotalCount = async () => {
  totalItems.value = await fetchTotalAtbisCount(1, 100000000, search.value, selectedTechnology.value);
}

watch([selectedTechnology], async () => {
  await loadData();
})

onMounted(async() => {
  loading.value = true;
  technologies.value = [{ uid: '', title: 'All', slug: '' }, ...(await fetchRepositoryIDsByUser(
      10000, false, '', '', '', true, true, 'Project Repository'
  ))];
  await loadData();
})



</script>

<template>
  <BaseDataTable
      id="uuid"
      title="All ATBIs"
      subtitle=" ATBI means Agri-Aqua Technology Business Incubation (ATBI). It is a program gears to support more incubatees in the Agri-Aqua sector."
      :items="atbis"
      :headers="headers"
      :loading="loading"
      :totalItems="totalItems"
      searchPlaceholder="Search atbis..."
      emptyStateHeader="`No ATBIs found"
      :mptyStateDescription="`There are no atbis found matching your criteria`"
      :filters="tableFilters"
      :itemsPerPageOptions="itemsPerPage"
      @update:search="search = $event"
      @update:page="page = $event"
      @update:itemsPerPage="itemsPerPage = $event"
      @update:selectedColumns="updateColumnVisibility"
      @loadData="loadAtbis"
      @clearFilters="clearFilters"
      @update:filter="handleFilterUpdate"
      @refreshData="loadData"
      :expandable="true"
  >
    <template #header-actions>
      <VBtnPrimaryFilled :to="{name: 'new-atbi'}" v-if="isSmall || isTablet" icon >
        <PhPlus size="16"/>
      </VBtnPrimaryFilled>
      <VBtnPrimaryFilled :to="{name: 'new-atbi'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
        <PhPlus size="16" class="mr-2"/>
        New ATBI
      </VBtnPrimaryFilled>
    </template>

    <template #item.name="{ item }">
      <div class="d-flex align-center">
        <VAvatar
            size="36"
            class="me-2"
        >
          <VImg :src="item?.logo? <string>item?.logo: 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"/>
        </VAvatar>
        <div>
          <p class="font-weight-medium mb-0">
            {{
              item?.name
            }}
          </p>
          <p class="text-caption text-medium-emphasis mb-0">Associated Technology: {{item?.tech_name}}</p>
        </div>
      </div>
    </template>

    <template #item.owners="{ item }">
      <p>
        <span v-if="item?.ownerData?.length == 0">N/A</span>
        <span v-else v-for="(owner, index) in item?.ownerData">
        {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != item?.ownerData?.length! - 1">, </span></span>
      </p>
    </template>

    <template #item.contact="{ item }">
      <div v-if="item.mobile && item.email && item.facebook" class="contact-container">
        <div v-if="item.mobile" class="contact-item">
          <PhPhone :size="16" />
          <a :href="`tel:${item.mobile}`">{{ item.mobile }}</a>
        </div>
        <div v-if="item.email" class="contact-item">
          <PhEnvelope :size="16" />
          <a :href="`mailto:${item.email}`">{{ item.email }}</a>
        </div>
        <div v-if="item.facebook" class="contact-item">
          <PhFacebookLogo :size="16" />
          <a :href="item.facebook" target="_blank">Facebook</a>
        </div>
      </div>
      <p v-else>N/A</p>
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
            <VListItem :to="{ name: 'atbi-details', params: {slug: item.uuid }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhEye class="mr-2" />
              </template>
              <VListItemTitle>View ATBI Details</VListItemTitle>
            </VListItem>

            <VListItem :to="{ name: 'edit-atbi', params: { slug: item.uuid }}" class="action-menu-item">
              <template v-slot:prepend>
                <PhPencil class="mr-2" />
              </template>
              <VListItemTitle>Edit ATBI</VListItemTitle>
            </VListItem>

            <VDivider class="my-1"></VDivider>
            <ConfirmationDialog
                :isWarning="true"
                @callback="deleteAtbiCallback(item.uuid as string)"
                confirm-content="Delete ATBI"
                content="Are you sure you want to delete this ATBI?"
            >
              <VListItem class="action-menu-item">
                <template v-slot:prepend>
                  <PhTrash class="mr-2" />
                </template>
                <VListItemTitle>Delete ATBI</VListItemTitle>
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
            v-model="selectedTechnology"
            :items="technologies"
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

.contact-container {
 display: flex;
 flex-direction: column;
 gap: 6px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.contact-item a {
  color: #3291C7;
  text-decoration: none;
}

.contact-item svg {
  color: #23668b;
  text-decoration: none;
}

.contact-item a:hover, .contact-item:hover, .contact-item svg:hover {
  text-decoration: underline;
}
</style>
<script setup lang="ts">
import { useScreenStore } from "../../../core/stores/screen-size.store.ts";
import { ref, watch } from "vue";
import { useRepositoryServices } from "../services/repository.services.ts";
import { PhPlus } from "@phosphor-icons/vue";
import {Repository} from "../../../interfaces/repository.interface.ts";

const { fetchAllRepositories } = useRepositoryServices();

const repositories = ref<Repository[]>([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref("");
const itemsPerPage = ref(10);
const options = ref({ page: 1, sortBy: [], sortDesc: [] });

const headers = ref([
  { text: "Title", value: "title", sortable: true },
  { text: "Category", value: "technology_category", sortable: true },
  { text: "Status", value: "technology_status", sortable: true },
  { text: "Updated At", value: "updated_at", sortable: true },
  { text: "Actions", value: "actions", sortable: false },
]);

const fetchData = async () => {
  loading.value = true;
  try {
    repositories.value = await fetchAllRepositories(options.value.page);
  } finally {
    loading.value = false;
  }
};

// Watchers for automatic data updates
watch([options, search], fetchData, { deep: true });

const viewItem = (item: any) => console.log("View", item);
const editItem = (item: any) => console.log("Edit", item);
const deleteItem = (item: any) => console.log("Delete", item);

const { isSmall, isTablet } = useScreenStore();
</script>

<template>
  <div class="relative-container circle-quarter" style="height: 100%">
    <div class="pa-6 relative-container" style="z-index: 20">
      <VRow justify="space-between" align="center" class="ma-0">
        <div>
          <p class="text-heading d-flex align-center">All Projects</p>
          <p class="text-subtitle">Create and manage all projects across NOMCAARRD</p>
        </div>
        <div>
          <VBtnPrimaryFilled
              :to="{ name: 'new-repository' }"
              v-if="isSmall || isTablet"
              icon
          >
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
            New Projects
          </VBtnPrimaryFilled>
        </div>
      </VRow>
    </div>
    <VDivider />
    <div class="pa-6">
      <VContainer>
        <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="repositories"
            :loading="loading"
            :server-items-length="totalItems"
            :options="options"
            item-value="uid"
            :items-length="repositories.length"
            show-select
        >
          <template v-slot:top>
            <VToolbar flat>
              <VToolbarTitle>Repositories</VToolbarTitle>
              <VSpacer />
              <VTextField
                  v-model="search"
                  label="Search"
                  clearable
                  @update:modelValue="fetchData"
                  hide-details
              />
              <VBtn color="primary" @click="fetchData">Refresh</VBtn>
            </VToolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <VIcon @click="viewItem(item)">mdi-eye</VIcon>
            <VIcon @click="editItem(item)">mdi-pencil</VIcon>
            <VIcon @click="deleteItem(item)">mdi-delete</VIcon>
          </template>
        </VDataTableServer>
      </VContainer>
    </div>
  </div>
</template>

<style scoped>
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

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8c8c8c;
  --v-field-border-width: 1px !important;
}
</style>

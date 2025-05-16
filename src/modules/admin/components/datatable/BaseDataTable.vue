<script setup lang="ts">
import {ref, computed, watch, PropType, onMounted} from 'vue';
import {PhArrowClockwise, PhFunnel, PhMagnifyingGlass} from "@phosphor-icons/vue";
import {usePageSizeHelper} from "../../../../core/composables/usePageSizeHelper.ts";
import EmptyStateInfo from "../../../../core/components/EmptyStateInfo.vue";


const props = defineProps({
  id: {
    type: String,
    default: 'uid'
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  headers: {
    type: Array as PropType<any[]>,
    required: true,
    default: () => []
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: true
  },
  totalItems: {
    type: Number,
    default: 0
  },
  itemsPerPageOptions: {
    type: Number,
    default: 0,
    required: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  emptyStateHeader: {
    type: String,
    default: 'No Items Found'
  },
  emptyStateDescription: {
    type: String,
    default: 'There are no items matching your search criteria'
  },
  filters: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  expandable: {
    type: Boolean,
    default: false
  },
  showFilter: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'update:search',
  'update:page',
  'update:itemsPerPage',
  'update:selectedColumns',
  'loadData',
  'clearFilters',
  'update:filter',
  'refreshData'
]);

const { generatePageSizeIncrements } = usePageSizeHelper()

const search = ref('');
const itemsPerPage = ref<number>(<number>props.itemsPerPageOptions);
const page = ref(1);
const showFilterDrawer = ref(false);

const selectedColumns = ref(props.headers!.filter((h: any) => h.visible).map((h: any) => h.key));

const visibleHeaders = computed(() => {
  return props.headers!.filter((header: any) => selectedColumns.value.includes(header.key));
});

const updateColumnVisibility = (selectedKeys: string[]) => {
  emit('update:selectedColumns', selectedKeys);
};

const isColumnVisible = (key: string) => {
  const column = props.headers!.find((h: any) => h.key === key);
  return column ? selectedColumns.value.includes(key) : false;
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  emit('update:page', newPage);
  emit('loadData');
};

const resetAllFilters = () => {
  page.value = 1;
  search.value = '';
  emit('clearFilters');
  const defaultColumns = props.headers!.filter((h: any) => h.visible).map((h: any) => h.key);
  selectedColumns.value = defaultColumns;
  emit('update:selectedColumns', defaultColumns);
};

const updateFilterValue = (filterKey: any, value: any) => {
  emit('update:filter', { key: filterKey, value });
  page.value = 1;
};

watch(search, (newValue) => {
  emit('update:search', newValue);
  page.value = 1;
  emit('update:page', 1);
  emit('refreshData');
});

watch(itemsPerPage, (newValue) => {
  emit('update:itemsPerPage', newValue);
  page.value = 1;
  emit('update:page', 1);
  emit('refreshData');
});


watch(()=> props.itemsPerPageOptions, (newValue) => {
  if (newValue != null) {
    itemsPerPage.value = newValue
  }
});

const refresh = () => {
  page.value = 1;
  emit('refreshData')
}

watch (
  () => props.showFilter,
  (newValue) => {
    showFilterDrawer.value = newValue as boolean;
  },
  { immediate: true }
);

onMounted(() => {
  showFilterDrawer.value = props.showFilter ?? false;
})
</script>

<template>
  <div class="relative-container circle-quarter" style="height: 100%">
    <!-- Header Section -->
    <div class="pa-6 relative-container" style="z-index: 20">
      <VRow justify="space-between" align="center" class="ma-0">
        <div>
          <p class="text-heading d-flex align-center">
            {{ title }}
          </p>
          <p class="text-subtitle">{{ subtitle }}</p>
        </div>
        <div>
          <slot name="header-actions"></slot>
        </div>
      </VRow>
    </div>
    <VDivider />

    <!-- Main Content Section -->
    <div class="pa-6">
      <VContainer fluid>
        <VSheet class="datatable-container rounded-lg elevation-1">
          <!-- Search and filter bar -->
          <div class="d-flex flex-wrap align-center justify-space-between px-4 pt-4 pb-2">
            <!-- Search field -->
            <div class="search-container d-flex align-center flex-grow-1" style="max-width: 350px">
              <VTextField
                  v-model="search"
                  :placeholder="searchPlaceholder"
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

            <!-- Filter button -->
            <div class="d-flex align-center">
              <VBtn
                  color="blue-grey-darken-1"
                  variant="tonal"
                  rounded="md"
                  class="filter-btn ml-2 px-3"
                  @click="refresh()"
              >
                <div class="d-flex align-center">
                  <PhArrowClockwise size="16" class="mr-2" />
                  <span class="text-body-2">Refresh</span>
                </div>
              </VBtn>
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
                <slot name="additional-filters"></slot>
                <!-- Dynamic filters from props -->
                <template v-for="filter in filters" :key="filter.key">
                  <VCol cols="12" sm="6" md="4" lg="3" v-if="!filter.visibleKey || isColumnVisible(filter.visibleKey)">
                    <VSelect
                        :model-value="filter.value"
                        :items="filter.items"
                        :item-title="filter.itemTitle || ''"
                        :item-value="filter.itemValue || ''"
                        :label="filter.label"
                        hide-details
                        density="compact"
                        variant="outlined"
                        rounded="md"
                        color="primary"
                        base-color="gs60"
                        class="mb-3"
                        @update:model-value="(value) => updateFilterValue(filter.key, value)"
                    />
                  </VCol>
                </template>
              </VRow>
              <VRow>
                <slot name="custom-filters">

                </slot>
              </VRow>
            </div>
          </VExpandTransition>

          <!-- Data Table -->
          <VDataTableServer
              :item-value="props.id as string"
              v-model:page="page"
              v-model:items-per-page="itemsPerPage as number"
              :headers="visibleHeaders"
              :items="items as any[]"
              :loading="loading ?? true"
              :items-length="totalItems"
              :items-per-page-options="generatePageSizeIncrements(totalItems)"
              @update:page="handlePageChange"
              class="elevation-0"
              :show-expand="props.expandable as boolean"
          >
            <!-- Dynamic slots for each column -->
            <template v-for="header in headers" :key="header.key" v-slot:[`item.${header.key}`]="slotProps">
              <slot :name="`item.${header.key}`" v-bind="slotProps"></slot>
            </template>

            <template #expanded-row="{ item }">
              <slot name="expanded-row" :item="item" />
            </template>

            <!-- Empty state -->
            <template v-slot:no-data>
              <EmptyStateInfo
                  :header="emptyStateHeader"
                  :description="emptyStateDescription"
                  :isCallbackNeeded="search !== ''"
                  @callback="search = ''"
              />
            </template>
          </VDataTableServer>
        </VSheet>
      </VContainer>
    </div>
  </div>
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
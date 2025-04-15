<script setup lang="ts">
import {computed, onMounted, PropType, ref, watch} from "vue";
import {ATBI, AtbiSubEntity, AtbiSubEntityImage} from "../../../interfaces/atbi.interface.ts";
import {PhDotsThreeOutlineVertical, PhPencil, PhPlus, PhTrash, PhMagnifyingGlass, PhImage} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useAtbiSubEntityServices} from "../services/atbi-sub-entity.services.ts";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";

const {isSmall, isTablet} = useScreenStore();
const {deleteAtbiSubEntity, fetchAtbiSubEntities} = useAtbiSubEntityServices()
const {showSnackbarMessage} = useSnackbarStore()

const loading = ref(false)
const search = ref("")
const imageModalOpen = ref(false)
const selectedImages = ref<AtbiSubEntityImage[]>([])
const currentImageIndex = ref(0)

const props = defineProps({
  atbi: {
    type: Object as PropType<ATBI>
  },
  type: {
    type: String
  }
})

const capitalizedType = computed(() => {
  return props.type
      ? props.type.charAt(0).toUpperCase() + props.type.slice(1)
      : '';
});

const atbientity = ref<AtbiSubEntity[]>([])

const title = computed(() => {
  if (props.type) {
    switch (props.type) {
      case 'facility':
        return 'Facilities'
      case 'product':
        return 'Products'
      case 'linkage':
        return 'Linkages'
      default:
        return 'Awards'
    }
  }
})

const isPriceQuantityVisible = computed(() => {
  return props.type === 'product' || props.type === 'facility'
})

const headers = computed(() => {
  return[
    { title: 'Name', key: 'name', sortable: true, visible: true },
    { title: 'Price', key: 'price', sortable: true, visible: isPriceQuantityVisible.value },
    { title: 'Quantity', key: 'quantity', sortable: true, visible: isPriceQuantityVisible.value },
    { title: 'Unit', key: 'unit', sortable: true, visible: isPriceQuantityVisible.value },
    { title: 'Images', key: 'images', sortable: false, visible: true },
    { title: 'Actions', key: 'actions', sortable: false, visible: true },
  ]
})


const loadAtbiSubEntities = async () => {
  loading.value = true
  atbientity.value = await fetchAtbiSubEntities(props.type as string, props.atbi?.uuid as string)
  loading.value = false
}

const filteredItems = computed(() => {
  if (!search.value) return atbientity.value

  const searchLower = search.value.toLowerCase()
  return atbientity.value.filter(item =>
      item.name?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
  )
})

const openImageModal = (images: AtbiSubEntityImage[]) => {
  selectedImages.value = Array.isArray(images) ? images : []
  currentImageIndex.value = 0
  imageModalOpen.value = true
}

const nextImage = () => {
  if (currentImageIndex.value < selectedImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const currentImage = computed(() => {
  if (selectedImages.value.length > 0 && selectedImages.value[currentImageIndex.value]) {
    return selectedImages.value[currentImageIndex.value].image
  }
  return ''
})

watch(() => props.type, async () => {
  await loadAtbiSubEntities()
  })



const deleteAtbiSubEntityCallback = async (id: string) => {
  await deleteAtbiSubEntity(id)
  showSnackbarMessage(`${props.type} Deleted Successfully`, Status.success)
  await loadAtbiSubEntities()
}

onMounted(async () => {
  await loadAtbiSubEntities()
})

</script>

<template>
  <div>
    <div class="pa-6 relative-container" style="z-index: 20">
      <VRow justify="space-between" align="center" class="ma-0">
        <VCol md="9" class="pa-0">
          <p class="text-heading d-flex align-center">
            {{ title }}
          </p>
          <p class="text-subtitle">Browse {{title}} for {{props.atbi?.tech_name}}</p>
        </VCol>
        <VCol md="3" class="pa-0">
          <VRow class="ma-0 justify-end">
            <VBtnPrimaryFilled
                :to="{
                    name: 'new-atbi-entity',
                    params: {
                      atbi: props.atbi?.uuid,
                      type: props.type
                    }}"
                v-if="isSmall || isTablet" icon >
              <PhPlus size="16"/>
            </VBtnPrimaryFilled>
            <VBtnPrimaryFilled :to="{
                    name: 'new-atbi-entity',
                    params: {
                      atbi: props.atbi?.uuid,
                      type: props.type
                    }}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
              <PhPlus size="16" class="mr-2"/>
              New {{props.type}}
            </VBtnPrimaryFilled>
          </VRow>
        </VCol>
      </VRow>
    </div>
    <div class="pa-6">
      <VContainer fluid>
        <VSheet class="datatable-container rounded-lg elevation-1">
          <!-- Search bar -->
          <div class="px-4 pt-4 d-flex align-center">
            <VTextField
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search..."
                density="compact"
                hide-details
                variant="outlined"
                rounded="lg"
                class="search-field"
            >
              <template v-slot:prepend-inner>
                <PhMagnifyingGlass size="18" />
              </template>
            </VTextField>
          </div>

          <VDataTable
              :headers="headers.filter(h => h.visible)"
              :items="filteredItems"
              :loading="loading"
              class="elevation-0"
              item-value="uuid"
              show-expand
          >
            <!-- Image column template -->
            <template #item.images="{ item }">
              <VBtn
                  v-if="item.images && item.images.length > 0"
                  icon
                  variant="text"
                  @click="openImageModal(item.images)"
                  class="image-preview-btn"
              >
                <PhImage size="22" />
                <span class="image-count" v-if="item.images.length > 1">{{ item.images.length }}</span>
              </VBtn>
              <span v-else>No images</span>
            </template>

            <!-- Actions column template -->
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
                    <VListItem
                        :to="{
                        name: 'edit-atbi-entity',
                        params: {
                          atbi: props.atbi?.uuid,
                          type: props.type,
                          slug: item.uuid
                        }
                      }"
                        class="action-menu-item">
                      <template v-slot:prepend>
                        <PhPencil class="mr-2" />
                      </template>
                      <VListItemTitle>Edit {{capitalizedType}}</VListItemTitle>
                    </VListItem>
                    <ConfirmationDialog
                        :isWarning="true"
                        @callback="deleteAtbiSubEntityCallback(item.uuid as string)"
                        :confirm-content="`Delete ${capitalizedType}`"
                        :content="`Are you sure you want to disable this ${props.type}?`"
                    >
                      <VListItem class="action-menu-item">
                        <template v-slot:prepend>
                          <PhTrash class="mr-2" />
                        </template>
                        <VListItemTitle>Delete {{capitalizedType}}</VListItemTitle>
                      </VListItem>
                    </ConfirmationDialog>
                  </VList>
                </VCard>
              </VMenu>
            </template>

            <!-- Expanded content for description -->
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
          </VDataTable>
        </VSheet>
      </VContainer>
    </div>

    <!-- Image Modal -->
    <VDialog v-model="imageModalOpen" max-width="800px">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center pa-4">
          <span>Image Gallery ({{ currentImageIndex + 1 }}/{{ selectedImages.length }})</span>
          <VBtn icon variant="text" @click="imageModalOpen = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VCardTitle>
        <VCardText class="pa-0">
          <div class="image-container">
            <img v-if="currentImage" :src="currentImage as string" alt="Image preview" class="full-image" />
            <div v-else class="no-image">No image available</div>

            <!-- Navigation arrows -->
            <div class="image-navigation" v-if="selectedImages.length > 1">
              <VBtn
                  icon
                  variant="text"
                  :disabled="currentImageIndex === 0"
                  @click="prevImage"
                  class="nav-btn left-nav"
              >
                <VIcon>mdi-chevron-left</VIcon>
              </VBtn>
              <VBtn
                  icon
                  variant="text"
                  :disabled="currentImageIndex === selectedImages.length - 1"
                  @click="nextImage"
                  class="nav-btn right-nav"
              >
                <VIcon>mdi-chevron-right</VIcon>
              </VBtn>
            </div>
          </div>
        </VCardText>

        <!-- Image thumbnails -->
        <VCardActions v-if="selectedImages.length > 1" class="pa-4">
          <div class="thumbnails-container">
            <div
                v-for="(img, index) in selectedImages"
                :key="index"
                class="thumbnail"
                :class="{ 'active': index === currentImageIndex }"
                @click="currentImageIndex = index"
            >
              <img :src="img.image as string" alt="Thumbnail" />
            </div>
          </div>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}

.datatable-container {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

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

.search-field {
  max-width: 300px;
  margin-bottom: 16px;
}

.image-preview-btn {
  color: #1867c0;
  position: relative;
}

.image-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #1867c0;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  max-height: 70vh;
  position: relative;
}

.full-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.no-image {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: #757575;
  font-style: italic;
}

.image-navigation {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.nav-btn {
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 50%;
  margin: 0 20px;
  color: white !important;
  pointer-events: auto;
}

.left-nav {
  margin-right: auto;
}

.right-nav {
  margin-left: auto;
}

.thumbnails-container {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  width: 100%;
  padding: 8px 0;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.thumbnail.active {
  border-color: #1867c0;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Override scoped CSS for v-html content */
:deep(.description-content) {
  line-height: 1.6;
}

:deep(.description-content p) {
  margin-bottom: 0.5rem;
}
</style>
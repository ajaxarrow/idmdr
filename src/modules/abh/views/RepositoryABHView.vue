<script setup lang="ts">
import {useRepositoryStore} from "../../repository/stores/repository.store.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {computed, onMounted, ref} from "vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {ABH, AbhImage} from "../../../interfaces/abh.interface.ts";
import {useAbhServices} from "../services/abh.services.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {AtbiSubEntityImage} from "../../../interfaces/atbi.interface.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {PhDotsThreeOutlineVertical, PhImage, PhMagnifyingGlass, PhPencil, PhPlus, PhTrash} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";

const {showSnackbarMessage} = useSnackbarStore()
const {isSmall, isTablet} = useScreenStore();
const {userData} = useUserStore()
const {route} = useRouting()
const {repository} = useRepositoryStore();
const {fetchRepositoryData} = useRepositoryServices();
const {fetchRepositoryIDsByUser} = useRepositoryServices();
const {fetchAbhsByTechnology, deleteAbh} = useAbhServices()
const isMember = ref(false)
const abhs = ref<ABH[]>([])
const loading = ref(false)
const search = ref("")
const imageModalOpen = ref(false)
const selectedImages = ref<AbhImage[]>([])
const currentImageIndex = ref(0)

const loadAbhs = async () => {
  loading.value = true
  abhs.value = await fetchAbhsByTechnology(<string>route.params.slug)
  loading.value = false
}

const headers = computed(() => {
  return[
    { title: 'Technology Assessment', key: 'technology_assessment', sortable: true, visible: true },
    { title: 'Images', key: 'image_data', sortable: false, visible: true },
    { title: 'Actions', key: 'actions', sortable: false, visible: true },
  ]
})

const filteredItems = computed(() => {
  if (!search.value) return abhs.value

  const searchLower = search.value.toLowerCase()
  return abhs.value.filter(item =>
      item.technology_assessment?.toLowerCase().includes(searchLower) ||
      item.business_model_development?.toLowerCase().includes(searchLower)
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

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};

const deleteABHCallback = async (id: string) => {
  await deleteAbh(id)
  await loadAbhs()
  showSnackbarMessage("Agri Aqua Business Hub deleted successfully",  Status.success)
}

onMounted(async () => {
  await fetchRepositoryData(<string>route.params.slug);
  const allUserRepo = await fetchRepositoryIDsByUser();
  if(isSlugInRepoList(repository.value, allUserRepo)) {
    isMember.value = true;
  }
  await loadAbhs()

})
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="abh">
    <div v-if="repository">
      <div class="pa-6 relative-container" style="z-index: 20">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <p class="text-heading d-flex align-center">
              Agri Aqua Business Hubs
            </p>
            <p class="text-subtitle">Browse Agri Aqua Business Hubs</p>
          </VCol>
          <VCol md="3" class="pa-0" v-if="isMember || userData?.is_superuser">
            <VRow class="ma-0 justify-end">
              <VBtnPrimaryFilled
                  :to="{
                    name: 'new-abh',
                    params: {
                      repo: route.params.slug
                    }}"
                  v-if="isSmall || isTablet" icon >
                <PhPlus size="16"/>
              </VBtnPrimaryFilled>
              <VBtnPrimaryFilled   :to="{
                    name: 'new-abh',
                    params: {
                      repo: route.params.slug
                    }}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                <PhPlus size="16" class="mr-2"/>
                New ABH
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
            >
              <!-- Image column template -->
              <template #item.image_data="{ item }">
                <VBtn
                    v-if="item.image_data && item.image_data.length > 0"
                    icon
                    variant="text"
                    @click="openImageModal(item.image_data)"
                    class="image-preview-btn"
                >
                  <PhImage size="22" />
                  <span class="image-count" v-if="item.image_data.length > 1">{{ item.image_data.length }}</span>
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
                          v-if="isMember || userData.is_superuser"
                          :to="{
                        name: 'edit-abh',
                        params: {
                          repo: route.params.slug,
                          slug: item.uuid
                        }
                      }"
                          class="action-menu-item">
                        <template v-slot:prepend>
                          <PhPencil class="mr-2" />
                        </template>
                        <VListItemTitle>Edit ABH</VListItemTitle>
                      </VListItem>
                      <ConfirmationDialog
                          v-if="isMember || userData.is_superuser"
                          :isWarning="true"
                          @callback="deleteABHCallback(item.uuid as string)"
                          confirm-content="Delete ABH"
                          :content="`Are you sure you want to disable this ABH?`"
                      >
                        <VListItem class="action-menu-item">
                          <template v-slot:prepend>
                            <PhTrash class="mr-2" />
                          </template>
                          <VListItemTitle>Delete ABH</VListItemTitle>
                        </VListItem>
                      </ConfirmationDialog>
                    </VList>
                  </VCard>
                </VMenu>
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
  </RepositoryDetailsLayout>
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
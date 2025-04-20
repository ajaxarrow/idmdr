<script setup lang="ts">
import {useRepositoryStore} from "../../repository/stores/repository.store.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {onMounted, ref} from "vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {ABH} from "../../../interfaces/abh.interface.ts";
import {useAbhServices} from "../services/abh.services.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {
  PhArrowLeft,
  PhDotsThreeOutlineVertical,
  PhPencil,
  PhTrash
} from "@phosphor-icons/vue";
import ConfirmationDialog from "../../../core/components/ConfirmationDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";

const {showSnackbarMessage} = useSnackbarStore()
const {isSmall, isTablet} = useScreenStore();
const {userData} = useUserStore()
const {route, router} = useRouting()
const {repository} = useRepositoryStore();
const {fetchRepositoryData} = useRepositoryServices();
const {fetchRepositoryIDsByUser} = useRepositoryServices();
const {fetchAbhData, deleteAbh} = useAbhServices()
const isMember = ref(false)
const abh = ref<ABH | null>(null)
const loading = ref(false)

const previewImage = ref('')
const selectedImageIndex = ref(-1);
const isImagePreviewed = ref(false)
const openImagePreview = (index: number) => {
  selectedImageIndex.value = index;
  previewImage.value = abh.value?.image_data![selectedImageIndex.value].image! as string
  isImagePreviewed.value = true;
};


const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};

const deleteABHCallback = async (id: string) => {
  await deleteAbh(id)
  showSnackbarMessage("Agri Aqua Business Hub deleted successfully",  Status.success)
  await router.push({name: 'repository-abh', params: {slug: repository.value?.uid}})

}

onMounted(async () => {
  abh.value = await fetchAbhData(<string>route.params.slug)
  await fetchRepositoryData(<string>route.params.repo);
  const allUserRepo = await fetchRepositoryIDsByUser();
  if(isSlugInRepoList(repository.value, allUserRepo)) {
    isMember.value = true;
  }


})
</script>

<template>
  <ImagePreviewOverlay
      :overlay="isImagePreviewed"
      :imageSrc="previewImage"
      @closeOverlay="isImagePreviewed = false"
  />
  <RepositoryDetailsLayout :repository="repository" activeTab="abh">
    <VRow class="ma-0 mr-6" justify="space-between" align="center">
      <div class="px-6 py-2">
        <RouterLink
            :to="{
          name: 'repository-abh',
          params: { slug: repository?.slug }
        }"
            class="text-decoration-none text-none">
          <p class="cursor-pointer back-button pa-2 d-flex align-center  text-black">
            <PhArrowLeft size="14" class="mr-1"/>
            Back To ABH view
          </p>
        </RouterLink>
      </div>
      <VMenu
          v-if="isMember || userData.is_superuser"
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
                          repo: route.params.repo,
                          slug: route.params.slug
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
                @callback="deleteABHCallback(route.params.slug as string)"
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
    </VRow>
    <div v-if="abh">
      <div v-if="abh.technology_assessment && abh.technology_assessment?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Technology Assessment</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.technology_assessment"></div>
            </div>
          </VRow>
        </div>
      </div>

      <div v-if="abh.business_model_development && abh.business_model_development?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Business Model Development</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.business_model_development"></div>
            </div>
          </VRow>
        </div>
      </div>

      <div v-if="abh.business_plan_preparation && abh.business_plan_preparation?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Business Plan Preparation</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.business_plan_preparation"></div>
            </div>
          </VRow>
        </div>
      </div>

      <div v-if="abh.market_research && abh.market_research?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Market Research</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.market_research"></div>
            </div>
          </VRow>
        </div>
      </div>

      <div v-if="abh.technology_registration_assistance && abh.technology_registration_assistance?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Technology Registration Assistance</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.technology_registration_assistance"></div>
            </div>
          </VRow>
        </div>
      </div>

      <div v-if="abh.feasibility && abh.feasibility?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Feasibility</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.feasibility"></div>
            </div>
          </VRow>
        </div>
      </div>

      <div v-if="abh.partnership_and_networking && abh.partnership_and_networking?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Partnership and Networking</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="abh.partnership_and_networking"></div>
            </div>
          </VRow>
        </div>
      </div>
      <div v-if="abh.image_data && abh.image_data!.length > 0">
        <VDivider/>
        <div class="px-8 pt-4 mb-10">
          <p class="text-about-heading py-3">Images</p>
          <VSheet width="100%" class="file-container mb-5">
            <div class="pa-4">
              <VRow justify="space-between" align="center" class="ma-0">
                <p><span class="text-data-heading">Image Gallery</span> ({{abh.image_data!.length}} Images)</p>
                <!--                <VTooltip v-if="isMember" location="bottom">-->
                <!--                  <template v-slot:activator="{ props }">-->
                <!--                    <PhDownload v-bind="props" size="24" class="cursor-pointer download-icon" @click="downloadRepoFiles"/>-->
                <!--                  </template>-->
                <!--                  <span>Download All Images</span>-->
                <!--                </VTooltip>-->
              </VRow>
            </div>

            <VDivider/>

            <div class="pa-4">
              <VRow>
                <VCol v-for="(image, index) in abh.image_data!" :key="index" cols="12" sm="6" md="4" lg="3">
                  <VCard class="image-card" @click="openImagePreview(index)" :class="{'selected-image': selectedImageIndex === index}">
                    <VImg
                        :src="image.image as string"
                        height="200"
                        cover
                        class="image-preview"
                    ></VImg>
                  </VCard>
                </VCol>
              </VRow>
            </div>

            <!--            <VDivider v-if="selectedImageIndex !== -1"/>-->

            <!--            <div v-if="selectedImageIndex !== -1" class="px-6 py-4">-->
            <!--              <VRow class="ma-0" justify="space-between">-->
            <!--                <div>-->
            <!--                  <p class="text-data-subheading d-flex align-center">-->
            <!--                    <PhInfo size="20" class="mr-2"/>-->
            <!--                    About the selected image-->
            <!--                  </p>-->
            <!--                  <p class="text-data-description">-->
            <!--                    {{ imageFiles[selectedImageIndex].description || 'No description available' }}-->
            <!--                  </p>-->
            <!--                </div>-->
            <!--                <p v-if="isMember" class="download-icon d-flex align-center cursor-pointer"-->
            <!--                   @click="downloadFile(imageFiles[selectedImageIndex].attachment as string)">-->
            <!--                  <PhDownload size="20" class="mr-2"/>-->
            <!--                  Download Image-->
            <!--                </p>-->
            <!--              </VRow>-->

            <!--              <VRow class="mt-4">-->
            <!--                <VCol cols="12" md="8" class="mx-auto">-->
            <!--                  <VImg-->
            <!--                      :src="imageFiles[selectedImageIndex].attachment as string"-->
            <!--                      max-height="500"-->
            <!--                      contain-->
            <!--                      class="selected-image-preview"-->
            <!--                  ></VImg>-->
            <!--                </VCol>-->
            <!--              </VRow>-->
            <!--            </div>-->
          </VSheet>
        </div>
      </div>
    </div>

  </RepositoryDetailsLayout>
</template>

<style scoped>
.back-button{
  width: 225px;
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #F0F5F9;
}
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
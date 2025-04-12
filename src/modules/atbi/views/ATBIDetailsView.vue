<script setup lang="ts">
import NotFound from "../../../assets/images/404.svg";
import { onMounted, ref, watch } from "vue";
import { ATBI } from "../../../interfaces/atbi.interface.ts";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import { useRouting } from "../../../core/composables/useRouting.ts";
import ATBIFacilities from "../components/ATBIFacilities.vue";
import ATBIProducts from "../components/ATBIProducts.vue";
import ATBIOverview from "../components/ATBIOverview.vue";
import {useAtbiServices} from "../services/atbi.services.ts";
import {PhArrowLeft, PhImages} from "@phosphor-icons/vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";

const { route, router } = useRouting()
const {isSmall} = useScreenStore()
const atbiData = ref<ATBI | null | undefined>(null)
const {fetchAtbiData} = useAtbiServices()
const pageLoading = ref(false)
const tab = ref("overview")
const tabs = ['Overview', 'Products', 'Facilities']
const selectedImageIndex = ref(0);
const previewImage = ref('')
const isImagePreviewed = ref(false)
const openImagePreview = (index: number) => {
  selectedImageIndex.value = index;
  previewImage.value = atbiData.value?.image_urls?.[selectedImageIndex.value].image as string
  isImagePreviewed.value = true;
};

// Update the tab value when it changes
watch(tab, (newTab) => {
  // Update the URL when tab changes
  updateQueryParams(newTab)
})

// Update URL query parameters
const updateQueryParams = (tabValue: string) => {
  router.replace({
    query: {
      ...route.query,
      tab: tabValue
    }
  })
}

// Check for tab in URL query parameters
const getTabFromQuery = () => {
  const tabQuery = route.query.tab as string
  if (tabQuery && tabs.map(t => t.toLowerCase()).includes(tabQuery.toLowerCase())) {
    return tabQuery.toLowerCase()
  }
  return "overview" // Default tab
}

onMounted(async() => {
  pageLoading.value = true

  // Get ATBI data
  atbiData.value = await fetchAtbiData(route.params.slug as string)
  console.log(atbiData.value)
  // Set tab from query or default to "overview"
  tab.value = getTabFromQuery()

  pageLoading.value = false
})
</script>

<template>
  <ImagePreviewOverlay
      :overlay="isImagePreviewed"
      :imageSrc="previewImage"
      @closeOverlay="isImagePreviewed = false"
  />
  <MainLayout title="ATBI Details">
    <div v-if="pageLoading" class="loading-state-container" style="height: 85vh;">
      <VProgressCircular indeterminate color="#23668b"></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="atbiData" style="height: 100%" class="relative-container circle">
        <div class="pa-6 relative-container" style="z-index: 20;">
          <div class="d-flex">
            <RouterLink :to="{ name: 'atbi' }" class="text-decoration-none text-none">
              <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
                <PhArrowLeft size="14" class="mr-1"/> Back To ATBI List
              </p>
            </RouterLink>
          </div>
          <VRow justify="space-between" align="center" class="ma-0 ga-4">
            <VCol md="8" class="pa-0">
            <p class="text-repository-heading d-flex align-center">
              {{atbiData.name}}
            </p>
            <!-- <p class="text-subtitle text-gs20">{{repository.subtitle}}</p>-->
            <p class="text-subtitle">
              Owners: <span v-if="atbiData?.ownerData?.length == 0">N/A</span>
              <span v-else v-for="(owner, index) in atbiData?.ownerData">
                {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != atbiData?.ownerData?.length! - 1">, </span>
              </span>
            </p>
            <p class="text-subtitle">
              {{ atbiData?.mobile }} · <a class="text-decoration-none text-bs50" :href="atbiData?.email">Email</a> · <a class="text-decoration-none text-bs50" :href="atbiData?.facebook">Facebook</a>
            </p>
          </VCol>
            <VCol md="3" class="pa-0" v-if="!isSmall && atbiData?.logo">
              <VRow class="ma-0" justify="end">
                <VImg
                    style="border-radius: 15px"
                    cover
                    height="125px"
                    width="250px"
                    :src="atbiData?.logo as string"
                />
              </VRow>
            </VCol>
          </VRow>
        </div>
        <VTabs class="mx-6" color="primary" v-model="tab">
          <VTab v-for="tabItem in tabs" class="tab-title text-none mx-2" :value="tabItem.toLowerCase()">
            {{tabItem}}
          </VTab>
        </VTabs>
        <VDivider/>

        <!-- Show component based on active tab -->
        <ATBIFacilities v-if="tab === 'facilities'" :atbi="atbiData!"/>
        <ATBIProducts v-if="tab === 'products'" :atbi="atbiData!"/>
        <ATBIOverview v-if="tab === 'overview'" :atbi="atbiData!"/>
      </div>
      <div v-else style="height: 100%">
        <div style="height:60vh" class="d-flex flex-column justify-center align-center">
          <VImg :src="NotFound" width="400px" />
          <p class="text-h4 font-weight-black">ATBI Data Not Found</p>
        </div>
      </div>
      <div v-if="atbiData?.image_urls?.length > 0">
        <VDivider/>
        <div class="px-8 pt-4 mb-10">
          <p class="text-about-heading py-3">Images</p>
          <VSheet width="100%" class="file-container mb-5">
            <div class="pa-4">
              <VRow justify="space-between" align="center" class="ma-0">
                <p><span class="text-data-heading">Image Gallery</span> ({{atbiData?.image_urls?.length}} Images)</p>
              </VRow>
            </div>

            <VDivider/>

            <div class="pa-4">
              <VRow>
                <VCol v-for="(image, index) in atbiData?.image_urls" :key="index" cols="12" sm="6" md="4" lg="3">
                  <VCard
                      class="image-card elevation-2"
                      @click="openImagePreview(index)"
                  >
                    <VImg
                        :src="image.image! as string"
                        height="200"
                        cover
                    >
                      <div class="image-overlay">
                        <VBtn
                            icon
                            variant="elevated"
                            size="small"
                            class="image-preview-btn"
                        >
                          <PhImages :size="20" />
                        </VBtn>
                      </div>
                    </VImg>
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
  </MainLayout>
</template>

<style scoped>
.file-container{
  border: 1.5px solid #E5ECF6;
  border-radius: 20px;
}
.text-repository-heading{
  font-weight: 900;
  font-size: 22px;
}
.circle::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -430px;
  width: 700px;
  height: 591px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}
.v-tab.v-tab.v-btn{
  min-width: 40px;
}
.v-tab{
  font-size: 16px;
  letter-spacing: .7px;
}
.back-button{
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #d3e6ef;
}
.image-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.image-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.image-preview-btn {
  background: rgba(255, 255, 255, 0.8) !important;
}
.attachments-container{
  max-height: 400px;
  overflow-y: scroll;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  padding: 20px 25px;
  transition: height 1s ease;
}
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
</style>
<script setup lang="ts">
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, computed, ref, onUnmounted} from "vue";
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {useOrgType} from "../composables/useOrgType.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import {
  PhDownload, PhFile,
  PhFileArchive,
  PhFileCsv,
  PhFileDoc, PhFileJpg,
  PhFileJs,
  PhFilePdf, PhFilePng, PhFilePpt, PhFileVideo,
  PhFileXls,
  PhInfo
} from "@phosphor-icons/vue";
import {Organization, OrganizationAttachment} from "../../../interfaces/organization.interface.ts";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
const {route} = useRouting()
const {setSnackbarMessage} = useSnackbarStore()
const {organization} = useOrganizationStore();
const {fetchOrganizationData, fetchOrganizationIDsByUser} = useOrganizationServices();
const {getOrganizationType, getOrganizationSubType} = useOrgType()
const {userData} = useUserStore()
const isMember = ref(false)
const selectedFileName = ref('');
const selectedFileDescription = ref('');
const selectedFileAttachment= ref('');
const selectedImageIndex = ref(-1);
const isImagePreviewed = ref(false)
const imageFiles = computed(() => {
  if (!organization.value?.files) return [];
  return organization.value?.files.filter(file =>
      file.mime_type?.startsWith('image/')
  ) as OrganizationAttachment[];
});
const previewImage = ref('')
const openImagePreview = (index: number) => {
  selectedImageIndex.value = index;
  previewImage.value = imageFiles.value[selectedImageIndex.value].attachment as string
  isImagePreviewed.value = true;
};

const selectFile = (fileDesc: string, filename: string, fileAttachment: string) => {
  if(selectedFileDescription.value === fileDesc){
    selectedFileAttachment.value = ''
    selectedFileDescription.value = ''
    selectedFileName.value = ''
  } else {
    selectedFileDescription.value = fileDesc
    selectedFileName.value = filename
    selectedFileAttachment.value = fileAttachment
  }
}

// const selectImage = (index: number) => {
//   selectedImageIndex.value = selectedImageIndex.value === index ? -1 : index;
// }

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};
const getFileExtension = (filename: string): string | null => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return null;
  }
  const extension = filename.substring(lastDotIndex + 1);
  return extension.toLowerCase();
}

const nonImageFiles = computed(() => {
  if (!organization.value?.files) return [];
  return organization.value?.files.filter(file =>
      !file.mime_type?.startsWith('image/')
  ) as OrganizationAttachment[];
});

interface FileIcon {
  [key: string]: { icon: any, color: string };
}

const getIcon = (name: string) => {
  const extension = getFileExtension(name);
  if (extension) {
    const iconMap: FileIcon = {
      'json': {icon: PhFileJs, color: '#C43ED0'},
      'csv': {icon: PhFileCsv, color: '#3291C7'},
      'pdf': {icon: PhFilePdf, color: '#C83246'},
      'docx': {icon: PhFileDoc, color: '#3291C7'},
      'zip': {icon: PhFileArchive, color: '#3291C7'},
      'xlsx': {icon: PhFileXls, color: '#033512'},
      'jpg': {icon: PhFileJpg, color: '#97411c'},
      'png': {icon: PhFilePng, color: '#1c7e97'},
      'ppt': {icon: PhFilePpt, color: '#971c1c'},
      'mp4': {icon: PhFileVideo, color: '#591c17'},
    };
    return iconMap[extension] || {icon: PhFile, color: '#32C8B4'};
  } else {
    return {icon: PhFile, color: '#32C8B4'};
  }
}

const downloadRepoFiles = (): void => {
  window.open(`${import.meta.env.VITE_BASE_API_URL_DJANGO}/v1/organization/attachments/download/${organization.value?.slug}`, '_blank');
};

const downloadFile = (attachment: string): void => {
  if (attachment) {
    window.open(attachment, '_blank');
  } else {
    console.error('Attachment URL is not valid.');
  }
};


onMounted(async () => {
  await fetchOrganizationData(route.params.slug as string);
  const allUserOrg = await fetchOrganizationIDsByUser();
  if(isSlugInOrgList(organization.value, allUserOrg)) {
    isMember.value = true;
  }
  await setSnackbarMessage()
})

onUnmounted(() => {
  organization.value = null
})
</script>

<template>
  <ImagePreviewOverlay
      :overlay="isImagePreviewed"
      :imageSrc="previewImage"
      @closeOverlay="isImagePreviewed = false"
  />
  <OrganizationDetailsLayout
      :organization="organization"
      :activeTab="'about'">
    <div v-if="organization">
      <div class="px-7 py-5" v-if="organization.description && organization.description?.trim().length != 0 && organization.description !== '<p><br></p>'">
        <div>
          <p class="text-about-heading py-3">About Organization</p>
          <div class="ql-snow">
            <div class="ql-editor" v-html="organization.description"></div>
          </div>
        </div>
      </div>
      <VDivider v-if="organization.description && organization.description?.trim().length != 0 && organization.description !== '<p><br></p>'"/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">Consortium Type</p>
        <VRow class="ma-0">
          <VCol v-if="organization.org_type" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">CMI Type</p>
            <p class="text-subtitle">{{ getOrganizationType(organization.org_type) }}</p>
          </VCol>
          <VCol v-if="organization.sub_org_type" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">CMI Sub Type</p>
            <p class="text-subtitle">{{ getOrganizationSubType(organization.sub_org_type) }}</p>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">Contact Information</p>
        <VRow class="ma-0">
          <VCol v-if="organization.president" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">President</p>
            <p class="text-subtitle">{{ organization.president }}</p>
          </VCol>
          <VCol v-if="organization.address" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Address</p>
            <p class="text-subtitle">{{ organization.address }}</p>
          </VCol>
          <VCol v-if="organization.tel_phone" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Telephone</p>
            <a :href="`tel:${organization.tel_phone}`" class="sub-link">{{ organization.tel_phone }}</a>
          </VCol>
          <VCol v-if="organization.phone" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Cell Number</p>
            <a :href="`tel:${organization.phone}`" class="text-subtitle sub-link">{{ organization.phone }}</a>
          </VCol>
          <VCol v-if="organization.email" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Email</p>
            <a :href="`mailto:${organization.email}`" class="text-subtitle sub-link">{{ organization.email }}</a>
          </VCol>
          <VCol v-if="organization.website" cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Website</p>
            <a :href="organization.website" class="text-subtitle sub-link">Visit {{organization.acronym}}'s website here</a>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <div class="px-7 py-5 mb-10">
        <p class="text-about-heading py-3">Cluster Representatives</p>
        <VRow class="ma-0">
          <VCol cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Research & Development</p>
            <p class="text-subtitle">
              <span v-if="organization.rd_repData?.length == 0">N/A</span>
              <span v-else v-for="(rep, index) in organization.rd_repData">
                {{rep.data?.first_name}} {{rep.data?.last_name}}<span v-if="index != organization.rd_repData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>

          <VCol cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Transfer</p>
            <p class="text-subtitle">
              <span v-if="organization.tt_repData?.length == 0">N/A</span>
              <span v-else v-for="(rep, index) in organization.tt_repData">
                {{rep.data?.first_name}} {{rep.data?.last_name}}<span v-if="index != organization.tt_repData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>

          <VCol cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Information Communication</p>
            <p class="text-subtitle">
              <span v-if="organization.ic_repData?.length == 0">N/A</span>
              <span v-else v-for="(rep, index) in organization.ic_repData">
                {{rep.data?.first_name}} {{rep.data?.last_name}}<span v-if="index != organization.ic_repData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>

          <VCol cols="12" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Science Communication</p>
            <p class="text-subtitle">
              <span v-if="organization.sc_repData?.length == 0">N/A</span>
              <span v-else v-for="(rep, index) in organization.sc_repData">
                {{rep.data?.first_name}} {{rep.data?.last_name}}<span v-if="index != organization.sc_repData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>

        </VRow>
      </div>
      <div v-if="organization.additional_info && organization.additional_info?.trim().length != 0 && organization.additional_info !== '<p><br></p>'">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Additional Information</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="organization.additional_info"></div>
            </div>
          </VRow>
        </div>
      </div>
      <div v-if="imageFiles.length > 0">
        <VDivider/>
        <div class="px-8 pt-4" :class="{'mb-10': nonImageFiles.length === 0}">
          <p class="text-about-heading py-3">Images</p>
          <VSheet width="100%" class="file-container mb-5">
            <div class="pa-4">
              <VRow justify="space-between" align="center" class="ma-0">
                <p><span class="text-data-heading">Image Gallery</span> ({{imageFiles.length}} Images)</p>
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
                <VCol v-for="(image, index) in imageFiles" :key="index" cols="12" sm="6" md="4" lg="3">
                  <VCard class="image-card" @click="openImagePreview(index)" :class="{'selected-image': selectedImageIndex === index}">
                    <VImg
                        :src="image.attachment as string"
                        height="200"
                        cover
                        class="image-preview"
                    ></VImg>
                    <VCardTitle class="image-title">
                      {{image.name}}
                    </VCardTitle>
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

      <!-- Other Files Section -->
      <VDivider v-if="nonImageFiles.length > 0"/>
      <div v-if="nonImageFiles.length > 0" class="px-8 pt-4 mb-10">
        <p class="text-about-heading py-3">Files</p>
        <VSheet width="100%" class="file-container">
          <div class="pa-4">
            <VRow justify="space-between" align="center" class="ma-0">
              <p><span class="text-data-heading">Data Explorer</span> ({{nonImageFiles.length}} Files)</p>
              <VTooltip v-if="isMember || userData.is_superuser" location="bottom">
                <template v-slot:activator="{ props }">
                  <PhDownload v-bind="props" size="24" class="cursor-pointer download-icon" @click="downloadRepoFiles"/>
                </template>
                <span>Download CMI Files</span>
              </VTooltip>
            </VRow>
          </div>

          <VDivider v-if="selectedFileDescription"/>

          <div class="px-6 py-4" v-if="selectedFileDescription">
            <VRow class="ma-0" justify="space-between">
              <div>
                <p class="text-data-subheading d-flex align-center">
                  <PhInfo size="20" class="mr-2"/>
                  About the selected file
                </p>
                <p class="text-data-description">{{selectedFileDescription}}</p>
              </div>
              <p v-if="isMember || userData.is_superuser" class="download-icon d-flex align-center cursor-pointer" @click="downloadFile(selectedFileAttachment)">
                <PhDownload size="20" class="mr-2"/>
                Download File
              </p>
            </VRow>
          </div>

          <VDivider/>

          <div class="pa-2">
            <VListItem
                v-for="(file, index) in nonImageFiles"
                :key="index"
                @click="selectFile(file.description!, file.name!, file.attachment! as string)">
              <div
                  class="my-2 pa-1 d-flex align-center"
                  :class="{'selected-file': selectedFileDescription === file.description}"
              >
                <component
                    :is="getIcon(file.name!).icon"
                    class="mr-2"
                    size="24"
                    :color="getIcon(file.name!).color"
                />
                {{file.name}}
              </div>
              <VDivider v-if="index !== nonImageFiles.length - 1"/>
            </VListItem>
          </div>
        </VSheet>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.sub-link{
  text-decoration: none !important;
  color: #23668b !important;
}

.sub-link:hover{
  text-decoration: underline !important;
  color: #3291C7 !important;
}

.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}

.organization-description{
  text-align: justify;
  text-indent: 20px;
}

.image-card {
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
}
.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.selected-image {
  border: 2px solid #3291C7;
  box-shadow: 0 0 10px rgba(50, 145, 199, 0.4);
}
.image-preview {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  object-fit: cover;
}
.image-title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 12px;
}
.selected-image-preview {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.image-description {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}
.image-gallery-heading {
  display: flex;
  align-items: center;
}
.image-gallery-heading .ph-image {
  margin-right: 8px;
  color: #3291C7;
}
.image-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.image-nav-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.image-nav-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.empty-gallery-message {
  text-align: center;
  padding: 40px 0;
  color: #666;
}
.gallery-container {
  padding-bottom: 20px;
}
.image-caption {
  text-align: center;
  padding: 8px 16px;
  font-style: italic;
  color: #666;
}
.image-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}
.image-metadata-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}
.image-metadata-item i {
  margin-right: 4px;
}

.download-icon{
  padding: 4px;
  border-radius: 10px;
}
.download-icon:hover{
  background-color: #e3e4ef;
}
.selected-file{
  background-color: #EEEEEE;
  border-radius: 5px;
}
.file-container{
  border: 1.5px solid #E5ECF6;
  border-radius: 20px;
}
</style>
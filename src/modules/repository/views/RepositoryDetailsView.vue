<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {
  PhDownload,
  PhFile,
  PhFileArchive,
  PhFileCsv,
  PhFileDoc,
  PhFileJpg,
  PhFileJs,
  PhFilePdf,
  PhFilePng,
  PhFilePpt,
  PhFileVideo,
  PhFileXls,
  PhInfo,
  PhImage
} from "@phosphor-icons/vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";

// Define the Attachment interface to match the description
interface Attachment {
  uid?: string;
  file: File | null;
  repository: string;
  attachment?: File | string;
  file_type?: string;
  mime_type?: string;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  visibility?: number;
  type: string;
  errorMessage?: string;
  showFiles?: boolean;
  isDescriptionUpdated?: boolean;
  isFileUpdated?: boolean;
  isNameUpdated?: boolean;
}

const {route} = useRouting()
const {arrayToString} = useStringArrayHelper()
const {repository} = useRepositoryStore();
const {fetchRepositoryData} = useRepositoryServices();
const {setSnackbarMessage} = useSnackbarStore()
const selectedFileName = ref('');
const selectedFileDescription = ref('');
const selectedFileAttachment= ref('');
const selectedImageIndex = ref(-1);
const {fetchRepositoryIDsByUser} = useRepositoryServices();
const isMember = ref(false)
const entityTitle = computed(() => {
  return repository.value
      ? repository.value?.type! === 'Project Repository'
          ? 'IP Technology'
          : 'Project'
      : 'Project';
});

// Separate files and images
const imageFiles = computed(() => {
  if (!repository.value?.files) return [];
  return repository.value?.files.filter(file =>
      file.mime_type?.startsWith('image/')
  ) as Attachment[];
});

const nonImageFiles = computed(() => {
  if (!repository.value?.files) return [];
  return repository.value?.files.filter(file =>
      !file.mime_type?.startsWith('image/')
  ) as Attachment[];
});

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};

const downloadRepoFiles = (): void => {
  window.open(`${import.meta.env.VITE_BASE_API_URL_DJANGO}/v1/repository/attachments/download/${repository.value?.slug}`, '_blank');
};

const downloadFile = (attachment: string): void => {
  if (attachment) {
    window.open(attachment, '_blank');
  } else {
    console.error('Attachment URL is not valid.');
  }
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

const selectImage = (index: number) => {
  selectedImageIndex.value = selectedImageIndex.value === index ? -1 : index;
}

const getFileExtension = (filename: string): string | null => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return null;
  }
  const extension = filename.substring(lastDotIndex + 1);
  return extension.toLowerCase();
}

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

const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const times = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(times)) {
    const elapsed = Math.floor(differenceInSeconds / secondsInUnit);
    if (elapsed > 0) {
      return `${elapsed} ${unit}${elapsed > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just Now';
};

onMounted(async () => {
  await fetchRepositoryData(<string>route.params.slug);
  const allUserRepo = await fetchRepositoryIDsByUser();
  if(isSlugInRepoList(repository.value, allUserRepo)) {
    isMember.value = true;
  }
  await setSnackbarMessage()
})

</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="data">
    <div v-if="repository">
      <div class="px-5 py-4">
        <VRow class="ma-0">
          <VCol cols="12" sm="12" md="8" lg="9" xxl="9" xl="9">
            <p class="text-about-heading py-2">About {{entityTitle}}</p>
            <div class="ql-snow">
              <div class="ql-editor" v-html="repository.description"></div>
            </div>
          </VCol>
          <VCol cols="12" sm="12" md="4" lg="3" xxl="3" xl="9">
            <p class="text-subheading">Last Updated</p>
            <p>{{getRelativeTime(repository?.updated_at as string)}}</p>
            <p class="text-subheading mt-3">Tags</p>
            <RouterLink
                v-for="tag in repository.tags"
                :key="tag"
                :to="{
                  name: 'repositories',
                  query: { tag: tag }
                }">
              <VChip
                  class="tag-chips my-1 mr-1 chip"
                  variant="outlined"
                  :value="tag">
                {{tag}}
              </VChip>
            </RouterLink>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">{{entityTitle}} Components</p>
        <VRow class="ma-0">
          <VCol v-if="repository.type" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Project Type</p>
            <p class="text-subtitle pr-3">{{ repository.type}}</p>
          </VCol>
          <VCol v-if="repository.proj_type" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Project Category</p>
            <p class="text-subtitle pr-3">{{ repository.proj_type}}</p>
          </VCol>
          <VCol v-if="repository.lead" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Project Lead</p>
            <p class="text-subtitle pr-3">
              {{
                repository.leadData?.data?.first_name?.length
                    ? repository.leadData.data.first_name
                    : 'N/A'
              }}
              {{
                repository.leadData?.data?.last_name?.length
                    ? repository.leadData.data.last_name
                    : ''
              }}
            </p>
          </VCol>
          <VCol v-if="repository.author" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Author<span v-if="repository.authorsData?.length != 0">(s)</span></p>
            <p class="text-subtitle pr-3">
              <span v-if="repository.authorsData?.length == 0">N/A</span>
              <span v-else v-for="(author, index) in repository.authorsData">
                {{author.data?.first_name}} {{author.data?.last_name}}<span v-if="index != repository.authorsData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>
          <VCol v-if="repository.author" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">{{entityTitle}} Status</p>
            <p class="text-subtitle pr-3">{{ repository.status}}</p>
          </VCol>
          <VCol v-if="repository.org_data" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Organization</p>
            <p class="text-subtitle pr-3">{{ repository.org_data.name}} ({{repository.org_data.acronym}})</p>
          </VCol>
          <VCol v-if="repository.location" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Site of Implementation</p>
            <p class="text-subtitle pr-3">{{ repository.location}}</p>
          </VCol>
          <VRow class="ma-0" v-if="repository.type === 'Project Repository'">
            <VCol v-if="repository.start_date" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Start Date</p>
              <p class="text-subtitle">{{ formatDate(repository.start_date)}}</p>
            </VCol>
            <VCol v-if="repository.end_date" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">End Date</p>
              <p class="text-subtitle">{{formatDate(repository.end_date)}}</p>
            </VCol>
            <VCol v-if="repository.funding_agency" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Funding Agency</p>
              <p class="text-subtitle pr-3">{{arrayToString(repository.funding_agency as string[])}}</p>
            </VCol>
            <VCol v-if="repository.affiliation" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Affiliation</p>
              <p class="text-subtitle pr-3">{{arrayToString(repository.affiliation as string[])}}</p>
            </VCol>
            <VCol v-if="repository.commodity" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Commodity</p>
              <p class="text-subtitle pr-3">{{arrayToString(repository.commodity as string[])}}</p>
            </VCol>
            <VCol v-if="repository.industry" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Industry</p>
              <p class="text-subtitle pr-3">{{arrayToString(repository.industry as string[])}}</p>
            </VCol>
            <VCol v-if="repository.rpt" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Research Project/s Conducted</p>
              <p class="text-subtitle pr-3">{{arrayToString(repository.rpt as string[])}}</p>
            </VCol>
            <VCol v-if="repository.priority_level" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Priority Level</p>
              <p class="text-subtitle">{{repository.priority_level.charAt(0).toUpperCase() + repository.priority_level.slice(1)}}</p>
            </VCol>
          </VRow>
        </VRow>
      </div>
      <VDivider  v-if="repository.type === 'Project Repository'" />
      <div v-if="repository.type === 'Project Repository'" class="px-7 py-5" :class="{'mb-10': repository.transfer_plan != 'Commercialization' && repository.files?.length == 0}" >
        <p class="text-about-heading py-3" >Technology Details</p>
        <VRow class="ma-0">
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Patenting Status</p>
            <p class="text-subtitle pr-3">{{ repository.is_patentable ? 'Applicable for Patenting' : 'Not Applicable'}}</p>
          </VCol>
          <VCol v-if="repository.technology_category" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Category</p>
            <p class="text-subtitle pr-3">{{ repository.technology_category}}</p>
          </VCol>
          <VCol v-if="repository.technology_status" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Status</p>
            <p class="text-subtitle pr-3">{{ repository.technology_status}}</p>
          </VCol>
          <VCol v-if="repository.technology_readiness_level" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Readiness Level</p>
            <p class="text-subtitle pr-3">{{ repository.technology_readiness_level}}</p>
          </VCol>
          <VCol v-if="repository.technology_generator" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Generator<span v-if="repository.techGeneratorData?.length != 0">(s)</span></p>
            <p class="text-subtitle pr-3">
              <span v-if="repository.techGeneratorData?.length == 0">N/A</span>
              <span v-else v-for="(techGen, index) in repository.techGeneratorData">
                {{techGen.data?.first_name}} {{techGen.data?.last_name}}<span v-if="index != repository.techGeneratorData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>
          <VCol v-if="repository.tech_owner" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Owner<span v-if="repository.techOwnerData?.length != 0">(s)</span></p>
            <p class="text-subtitle pr-3">
              <span v-if="repository.techOwnerData?.length == 0">N/A</span>
              <span v-else v-for="(owner, index) in repository.techOwnerData">
                {{owner.data?.first_name}} {{owner.data?.last_name}}<span v-if="index != repository.techOwnerData?.length! - 1">, </span>
              </span>
            </p>
          </VCol>
          <VCol v-if="repository.adaptors" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Existing or Potential Adopters</p>
            <p class="text-subtitle pr-3">{{arrayToString(repository.adaptors as string[])}}</p>
          </VCol>
          <VCol v-if="repository.transfer_plan" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Transfer Plan</p>
            <p class="text-subtitle pr-3">{{ repository.transfer_plan}}</p>
          </VCol>
          <VCol v-if="repository.technology_transfer_status" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Transfer Status</p>
            <p class="text-subtitle pr-3">{{ repository.technology_transfer_status}}</p>
          </VCol>
        </VRow>
      </div>

      <div v-if="repository.transfer_plan == 'Commercialization' && repository.type === 'Project Repository'">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Commercialization</p>
          <VRow class="ma-0">
            <VCol v-if="repository.commercialization?.ipType" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">IP Type</p>
              <p class="text-subtitle">{{ repository.commercialization.ipType}}</p>
            </VCol>
            <VCol v-if="repository.commercialization?.ipStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">IP Status</p>
              <p class="text-subtitle">{{ repository.commercialization.ipStatus}}</p>
            </VCol>
            <VCol v-if="repository.commercialization?.regNo" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">IP Registration Number</p>
              <p class="text-subtitle">{{ repository.commercialization.regNo}}</p>
            </VCol>
          </VRow>
        </div>
        <VDivider/>
        <div class="px-7 py-5 mb-5" :class="{'mb-10': repository.files?.length == 0}">
          <p class="text-about-heading py-3">Commercialization Status</p>
          <VRow class="ma-0">
            <VCol v-if="repository.commercialization?.modeStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Mode Status</p>
              <p class="text-subtitle pr-3">{{ repository.commercialization.modeStatus}}</p>
            </VCol>
            <VCol v-if="repository.commercialization?.currentStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Current Status</p>
              <p class="text-subtitle pr-3">{{ repository.commercialization.currentStatus}}</p>
            </VCol>
            <VCol v-if="repository.commercialization?.adopterStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Adopter Status</p>
              <p class="text-subtitle pr-3">{{ repository.commercialization.adopterStatus}}</p>
            </VCol>
          </VRow>
        </div>
      </div>
      <div v-if="repository.additional_info && repository.additional_info?.trim().length > 0">
        <VDivider/>
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Additional Information</p>
          <VRow class="ma-0">
            <div class="ql-snow">
              <div class="ql-editor" v-html="repository.additional_info"></div>
            </div>
          </VRow>
        </div>
      </div>

      <!-- Images Section -->
      <div v-if="imageFiles.length > 0">
        <VDivider/>
        <div class="px-8 pt-4" :class="{'mb-10': nonImageFiles.length === 0}">
          <p class="text-about-heading py-3">Images</p>
          <VSheet width="100%" class="file-container mb-5">
            <div class="pa-4">
              <VRow justify="space-between" align="center" class="ma-0">
                <p><span class="text-data-heading">Image Gallery</span> ({{imageFiles.length}} Images)</p>
                <VTooltip v-if="isMember" location="bottom">
                  <template v-slot:activator="{ props }">
                    <PhDownload v-bind="props" size="24" class="cursor-pointer download-icon" @click="downloadRepoFiles"/>
                  </template>
                  <span>Download All Images</span>
                </VTooltip>
              </VRow>
            </div>

            <VDivider/>

            <div class="pa-4">
              <VRow>
                <VCol v-for="(image, index) in imageFiles" :key="index" cols="12" sm="6" md="4" lg="3">
                  <VCard class="image-card" @click="selectImage(index)" :class="{'selected-image': selectedImageIndex === index}">
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

            <VDivider v-if="selectedImageIndex !== -1"/>

            <div v-if="selectedImageIndex !== -1" class="px-6 py-4">
              <VRow class="ma-0" justify="space-between">
                <div>
                  <p class="text-data-subheading d-flex align-center">
                    <PhInfo size="20" class="mr-2"/>
                    About the selected image
                  </p>
                  <p class="text-data-description">
                    {{ imageFiles[selectedImageIndex].description || 'No description available' }}
                  </p>
                </div>
                <p v-if="isMember" class="download-icon d-flex align-center cursor-pointer"
                   @click="downloadFile(imageFiles[selectedImageIndex].attachment as string)">
                  <PhDownload size="20" class="mr-2"/>
                  Download Image
                </p>
              </VRow>

              <VRow class="mt-4">
                <VCol cols="12" md="8" class="mx-auto">
                  <VImg
                      :src="imageFiles[selectedImageIndex].attachment as string"
                      max-height="500"
                      contain
                      class="selected-image-preview"
                  ></VImg>
                </VCol>
              </VRow>
            </div>
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
              <VTooltip v-if="isMember" location="bottom">
                <template v-slot:activator="{ props }">
                  <PhDownload v-bind="props" size="24" class="cursor-pointer download-icon" @click="downloadRepoFiles"/>
                </template>
                <span>Download {{entityTitle}} Files</span>
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
              <p v-if="isMember" class="download-icon d-flex align-center cursor-pointer" @click="downloadFile(selectedFileAttachment)">
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
  </RepositoryDetailsLayout>
</template>

<style scoped>
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
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
.text-subheading{
  font-weight: 800;
}
.text-data-heading{
  font-size: 17px;
  font-weight: 750;
}
.text-data-subheading{
  font-weight: 500;
}
.text-data-description{
  font-size: 14px;
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
</style>
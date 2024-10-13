<script setup lang="ts">
  import {onMounted} from "vue";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  // import {
  //   PhFile, PhFileArchive,
  //   PhFileCsv, PhFileDoc, PhFileJpg,
  //   PhFileJs,
  //   PhFilePdf, PhFilePng,
  //   PhFilePpt,
  //   PhFileVideo, PhFileXls,
  // } from "@phosphor-icons/vue";
  import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
  import {useRepositoryStore} from "../stores/repository.store.ts";
  import {useRepositoryServices} from "../services/repository.services.ts";
  import "quill/dist/quill.core.css"
  import "quill/dist/quill.snow.css"
  import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";

  const {route} = useRouting()
  const {repository} = useRepositoryStore();
  const {fetchRepositoryData} = useRepositoryServices();
  const {setSnackbarMessage} = useSnackbarStore()
  // const selectedFileName = ref('');
  // const selectedFileDescription = ref('');

  // const downloadFiles = () => {
  //   let fileContent = '';
  //   if (repository.value) {
  //     fileContent += `Repository Name: ${repository.value?.title}\n\n`;
  //     if (repository.value?.files) {
  //       repository.value?.files.forEach((file, index) => {
  //         fileContent += `File ${index + 1}:\nName: ${file.name}\nDescription: ${file.description}\n\n`;
  //       });
  //     }
  //   }
  //
  //   const blob = new Blob([fileContent], { type: 'text/plain' });
  //
  //   const url = URL.createObjectURL(blob);
  //
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `${repository.value?.slug}.txt`;
  //
  //   link.click();
  //
  //   URL.revokeObjectURL(url);
  // }

  // const downloadFile = (filename: string, description: string): void => {
  //   let fileContent = '';
  //   fileContent += `Name: ${filename}\nDescription: ${description}\n\n`;
  //
  //   const blob = new Blob([fileContent], { type: 'text/plain' });
  //
  //   const url = URL.createObjectURL(blob);
  //
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', `${filename}.txt`);
  //
  //   document.body.appendChild(link);
  //
  //   link.click();
  //
  //   document.body.removeChild(link);
  //
  //   URL.revokeObjectURL(url);
  // }
  //
  // const selectFile = (fileDesc: string, filename: string) => {
  //   if(selectedFileDescription.value === fileDesc){
  //     selectedFileDescription.value = ''
  //     selectedFileName.value = ''
  //   } else {
  //     selectedFileDescription.value = fileDesc
  //     selectedFileName.value = filename
  //   }
  // }
  //
  // const getFileExtension = (filename: string): string | null => {
  //   const lastDotIndex = filename.lastIndexOf('.');
  //   if (lastDotIndex === -1) {
  //     return null;
  //   }
  //   const extension = filename.substring(lastDotIndex + 1);
  //   return extension.toLowerCase();
  // }
  //
  // interface FileIcon {
  //   [key: string]: { icon: any, color: string };
  // }

  // const getIcon = (name: string) => {
  //   const extension = getFileExtension(name);
  //   if (extension) {
  //     const iconMap: FileIcon = {
  //       'json': {icon: PhFileJs, color: '#C43ED0'},
  //       'csv': {icon: PhFileCsv, color: '#3291C7'},
  //       'pdf': {icon: PhFilePdf, color: '#C83246'},
  //       'docx': {icon: PhFileDoc, color: '#3291C7'},
  //       'zip': {icon: PhFileArchive, color: '#3291C7'},
  //       'xlsx': {icon: PhFileXls, color: '#033512'},
  //       'jpg': {icon: PhFileJpg, color: '#97411c'},
  //       'png': {icon: PhFilePng, color: '#1c7e97'},
  //       'ppt': {icon: PhFilePpt, color: '#971c1c'},
  //       'mp4': {icon: PhFileVideo, color: '#591c17'},
  //     };
  //     return iconMap[extension] || {icon: PhFile, color: '#32C8B4'};
  //   } else {
  //     return {icon: PhFile, color: '#32C8B4'};
  //   }
  // }

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
    await setSnackbarMessage()
  })

</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="data">
    <div v-if="repository">
      <div class="px-5 py-4">
        <VRow class="ma-0">
          <VCol cols="12" sm="12" md="8" lg="9" xxl="9" xl="9">
            <p class="text-about-heading py-2">About Repository</p>
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
        <p class="text-about-heading py-3">Project Components</p>
        <VRow class="ma-0">
          <VCol v-if="repository.organizationData" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Organization</p>
            <p class="text-subtitle">{{ repository.organizationData.name}} ({{repository.organizationData.acronym}})</p>
          </VCol>
          <VCol v-if="repository.location" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Location</p>
            <p class="text-subtitle">{{ repository.location}}</p>
          </VCol>
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
            <p class="text-subtitle">{{repository.funding_agency}}</p>
          </VCol>
          <VCol v-if="repository.affiliation" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Affiliation</p>
            <p class="text-subtitle">{{ repository.affiliation}}</p>
          </VCol>
          <VCol v-if="repository.commodity" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Commodity</p>
            <p class="text-subtitle">{{repository.commodity}}</p>
          </VCol>
          <VCol v-if="repository.industry" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Industry</p>
            <p class="text-subtitle">{{repository.industry}}</p>
          </VCol>
          <VCol v-if="repository.rpt" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Research Project/s Conducted</p>
            <p class="text-subtitle">{{repository.rpt}}</p>
          </VCol>
          <VCol v-if="repository.priority_level" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Priority Level</p>
            <p class="text-subtitle">{{repository.priority_level.charAt(0).toUpperCase() + repository.priority_level.slice(1)}}</p>
          </VCol>

        </VRow>
      </div>
      <VDivider/>
      <div class="px-7 py-5" :class="{'mb-10': repository.transfer_plan != 'Commercialization'}">
        <p class="text-about-heading py-3">Technology Details</p>
        <VRow class="ma-0">
          <VCol v-if="repository.technology_category" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Category</p>
            <p class="text-subtitle">{{ repository.technology_category}}</p>
          </VCol>
          <VCol v-if="repository.technology_status" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Status</p>
            <p class="text-subtitle">{{ repository.technology_status}}</p>
          </VCol>
          <VCol v-if="repository.technology_readiness_level" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Readiness Level</p>
            <p class="text-subtitle">{{ repository.technology_readiness_level}}</p>
          </VCol>
          <VCol v-if="repository.technology_generator" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Generator</p>
            <p class="text-subtitle">{{ repository.technology_generator}}</p>
          </VCol>
          <VCol v-if="repository.tech_owner" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Technology Owner</p>
            <p class="text-subtitle">{{repository.tech_owner}}</p>
          </VCol>
          <VCol v-if="repository.adaptors" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Existing or Potential Adopters</p>
            <p class="text-subtitle">{{repository.adaptors}}</p>
          </VCol>
          <VCol v-if="repository.transfer_plan" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Transfer Plan</p>
            <p class="text-subtitle">{{ repository.transfer_plan}}</p>
          </VCol>
          <VCol v-if="repository.technology_transfer_status" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Transfer Status</p>
            <p class="text-subtitle">{{ repository.technology_transfer_status}}</p>
          </VCol>
        </VRow>
      </div>

      <div  v-if="repository.transfer_plan == 'Commercialization'">
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
        <div class="px-7 py-5 mb-10">
          <p class="text-about-heading py-3">Commercialization Status</p>
          <VRow class="ma-0">
            <VCol v-if="repository.commercialization?.modeStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Mode Status</p>
              <p class="text-subtitle">{{ repository.commercialization.modeStatus}}</p>
            </VCol>
            <VCol v-if="repository.commercialization?.currentStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Current Status</p>
              <p class="text-subtitle">{{ repository.commercialization.currentStatus}}</p>
            </VCol>
            <VCol v-if="repository.commercialization?.adopterStatus" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
              <p class="text-subtitle text-gs20">Adopter Status</p>
              <p class="text-subtitle">{{ repository.commercialization.adopterStatus}}</p>
            </VCol>
          </VRow>
        </div>
      </div>

<!--      <div class="px-8 py-4">-->
<!--        <p class="text-about-heading">Files</p>-->
<!--        <VSheet width="100%"  class="file-container">-->
<!--          <div class="pa-4">-->
<!--            <VRow justify="space-between" align="center" class="ma-0">-->
<!--              <p><span class="text-data-heading">Data Explorer</span> ({{repository.files?.length}} Files)</p>-->
<!--              <PhDownload size="24" class="cursor-pointer download-icon" @click="downloadFiles">-->
<!--                <VTooltip-->
<!--                    activator="parent"-->
<!--                    location="bottom"-->
<!--                >Download Repository Files</VTooltip>-->
<!--              </PhDownload>-->
<!--            </VRow>-->
<!--          </div>-->
<!--          <VDivider v-if="selectedFileDescription" />-->
<!--          <div class="px-6 py-4" v-if="selectedFileDescription">-->
<!--            <VRow class="ma-0" justify="space-between">-->
<!--              <div>-->
<!--                <p class="text-data-subheading d-flex align-center">-->
<!--                  <PhInfo size="20" class="mr-2"/>-->
<!--                  About the selected file-->
<!--                </p>-->
<!--                <p class="text-data-description">{{selectedFileDescription}}</p>-->
<!--              </div>-->
<!--              <p class="download-icon d-flex align-center cursor-pointer"  @click="downloadFile(selectedFileName, selectedFileDescription)">-->
<!--                <PhDownload size="20" class="mr-2"/>-->
<!--                Download File-->
<!--              </p>-->
<!--            </VRow>-->
<!--          </div>-->
<!--          <VDivider/>-->
<!--          <div class="pa-2">-->
<!--            <VListItem-->
<!--                v-for="file in repository.files"-->
<!--                @click="selectFile(file.description, file.name)">-->
<!--              <div-->
<!--                  class="my-2 pa-1 d-flex align-center "-->
<!--                  :class="{'selected-file': selectedFileDescription === file.description}"-->
<!--              >-->
<!--                <component-->
<!--                    :is="getIcon(file.name).icon"-->
<!--                    class="mr-2"-->
<!--                    size="24"-->
<!--                    :color="getIcon(file.name).color"-->
<!--                />-->
<!--                {{file.name}}-->
<!--              </div>-->
<!--              <VDivider/>-->
<!--            </VListItem>-->
<!--          </div>-->
<!--        </VSheet>-->
<!--      </div>-->
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



</style>
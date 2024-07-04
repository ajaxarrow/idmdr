<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import {
    PhDownload,
    PhFile, PhFileArchive,
    PhFileCsv, PhFileDoc, PhFileJpg,
    PhFileJs,
    PhFilePdf, PhFilePng,
    PhFilePpt,
    PhFileVideo, PhFileXls, PhInfo,
  } from "@phosphor-icons/vue";
  import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
  import {useRepositoryStore} from "../stores/repository.store.ts";
  const {route} = useRouting()
  const {repository, setRepositoryData} = useRepositoryStore();

  const selectedFileName = ref('');
  const selectedFileDescription = ref('');

  const downloadFiles = () => {
    let fileContent = '';
    if (repository.value) {
      fileContent += `Repository Name: ${repository.value?.title}\n\n`;
      if (repository.value?.files) {
        repository.value?.files.forEach((file, index) => {
          fileContent += `File ${index + 1}:\nName: ${file.name}\nDescription: ${file.description}\n\n`;
        });
      }
    }

    const blob = new Blob([fileContent], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${repository.value?.slug}.txt`;

    link.click();

    URL.revokeObjectURL(url);
  }

  const downloadFile = (filename: string, description: string): void => {
    let fileContent = '';
    fileContent += `Name: ${filename}\nDescription: ${description}\n\n`;

    const blob = new Blob([fileContent], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.txt`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  const selectFile = (fileDesc: string, filename: string) => {
    if(selectedFileDescription.value === fileDesc){
      selectedFileDescription.value = ''
      selectedFileName.value = ''
    } else {
      selectedFileDescription.value = fileDesc
      selectedFileName.value = filename
    }
  }

  const getFileExtension = (filename: String): string | null => {
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

  const getIcon = (name: String) => {
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

  onMounted(() => {
    setRepositoryData(route.params.slug as string);
  })

</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="data">
    <div v-if="repository">
      <div class="px-6 py-2">
        <VRow class="ma-0">
          <VCol cols="12" sm="12" md="8" lg="9" xxl="9" xl="9">
            <p class="text-about-heading">About Repository</p>
            <div v-html="repository.about"></div>
          </VCol>
          <VCol cols="12" sm="12" md="4" lg="3" xxl="3" xl="9">
            <p class="text-subheading">Last Updated</p>
            <p>3 days ago</p>
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
      <div class="px-8 py-4">
        <p class="text-about-heading">Files</p>
        <VSheet width="100%"  class="file-container">
          <div class="pa-4">
            <VRow justify="space-between" align="center" class="ma-0">
              <p><span class="text-data-heading">Data Explorer</span> ({{repository.files?.length}} Files)</p>
              <PhDownload size="24" class="cursor-pointer download-icon" @click="downloadFiles">
                <VTooltip
                    activator="parent"
                    location="bottom"
                >Download Repository Files</VTooltip>
              </PhDownload>
            </VRow>
          </div>
          <VDivider v-if="selectedFileDescription" />
          <div class="px-6 py-4" v-if="selectedFileDescription">
            <VRow class="ma-0" justify="space-between">
              <div>
                <p class="text-data-subheading d-flex align-center">
                  <PhInfo size="20" class="mr-2"/>
                  About the selected file
                </p>
                <p class="text-data-description">{{selectedFileDescription}}</p>
              </div>
              <p class="download-icon d-flex align-center cursor-pointer"  @click="downloadFile(selectedFileName, selectedFileDescription)">
                <PhDownload size="20" class="mr-2"/>
                Download File
              </p>
            </VRow>
          </div>
          <VDivider/>
          <div class="pa-2">
            <VListItem
                v-for="file in repository.files"
                @click="selectFile(file.description, file.name)">
              <div
                  class="my-2 pa-1 d-flex align-center "
                  :class="{'selected-file': selectedFileDescription === file.description}"
              >
                <component
                    :is="getIcon(file.name).icon"
                    class="mr-2"
                    size="24"
                    :color="getIcon(file.name).color"
                />
                {{file.name}}
              </div>
              <VDivider/>
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



</style>
<script setup lang="ts">
  import {onMounted, ref} from "vue";
  import {useRouting} from "../../composables/useRouting.ts";
  import {
    PhDownload,
    PhFile, PhFileArchive,
    PhFileCsv, PhFileDoc, PhFileJpg,
    PhFileJs,
    PhFilePdf, PhFilePng,
    PhFilePpt,
    PhFileVideo, PhFileXls, PhInfo,
  } from "@phosphor-icons/vue";
  import RepositoryDetailsLayout from "../../layouts/RepositoryDetailsLayout.vue";
  import {useRepositoryStore} from "../../stores/repositoryStore.ts";
  const {route} = useRouting()
  const {repository, setRepositoryData} = useRepositoryStore();

  const selectedFileDescription = ref('');

  const selectFile = (fileDesc: string) => {
    if(selectedFileDescription.value === fileDesc){
      selectedFileDescription.value = ''
    } else {
      selectedFileDescription.value = fileDesc
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
          <VCol cols="9" sm="12" md="8">
            <p class="text-about-heading">About Repository</p>
            <div v-html="repository.about"></div>
          </VCol>
          <VCol cols="3" sm="12" md="4">
            <p class="text-subheading">Last Updated</p>
            <p>3 days ago</p>
            <p class="text-subheading mt-3">Tags</p>
            <VChip
                v-for="tag in repository.tags"
                class="tag-chips my-1 mr-1"
                variant="outlined"
                :key="tag"
                :value="tag">
              {{tag}}
            </VChip>
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
              <PhDownload size="24"/>
            </VRow>
          </div>
          <VDivider v-if="selectedFileDescription" />
          <div class="px-6 py-4" v-if="selectedFileDescription">
            <p class="text-data-subheading d-flex align-center">
              <PhInfo size="20" class="mr-2"/>
              About the selected file
            </p>
            <p class="text-data-description">{{selectedFileDescription}}</p>
          </div>
          <VDivider/>
          <div class="pa-2">
            <VListItem
                v-for="file in repository.files"
                @click="selectFile(file.description)">
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


  .tag-chips{
    background-color: #fafafa;
    border: 1px solid #e4e4e4;
  }


</style>
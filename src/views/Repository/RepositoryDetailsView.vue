<script setup lang="ts">
  import MainLayout from "../../layouts/MainLayout.vue";
  import NotFound from "../../assets/images/404.svg"
  import {onMounted, ref} from "vue";
  import {useRouting} from "../../composables/useRouting.ts";
  import {Repository,} from "../../interfaces/repository.interface.ts";
  import {repositories} from "../../data/repository.ts";
  import {
    PhDownload,
    PhFile, PhFileArchive,
    PhFileCsv, PhFileDoc, PhFileJpg,
    PhFileJs,
    PhFilePdf, PhFilePng,
    PhFilePpt,
    PhFileVideo, PhFileXls, PhInfo,
  } from "@phosphor-icons/vue";
  const {route} = useRouting()

  const repository = ref<Repository | null>();

  const tab = ref("about");
  const selectedFileDescription = ref('');

  const selectFile = (fileDesc: string) => {
    if(selectedFileDescription.value === fileDesc){
      selectedFileDescription.value = ''
    } else {
      selectedFileDescription.value = fileDesc
    }
  }


  const fetchRepositoryData = (slug: string): Repository | null => {
    const repository = repositories.find(repo => repo.slug === slug);
    if (repository) {
      return repository;
    } else {
      console.error('no repo')
      return null;
    }
  };

  const getFileExtension = (filename: String): string | null => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return null;
    }
    const extension = filename.substring(lastDotIndex + 1);
    return extension.toLowerCase();
  }

  const getIcon = (name: String) => {
    switch (getFileExtension(name)) {
      case 'json':
        return {icon: PhFileJs, color: '#C43ED0'}
      case 'csv':
        return {icon: PhFileCsv, color: '#3291C7'}
      case 'pdf':
        return {icon: PhFilePdf, color: '#C83246'}
      case 'docx':
        return {icon: PhFileDoc, color: '#3291C7'}
      case 'zip':
        return {icon: PhFileArchive, color: '#3291C7'}
      case 'xlsx':
        return {icon: PhFileXls, color: '#033512'}
      case 'jpg':
        return {icon: PhFileJpg, color: '#97411c'}
      case 'png':
        return {icon: PhFilePng,color: '#1c7e97'}
      case 'ppt':
        return {icon: PhFilePpt, color: '#971c1c'}
      case 'mp4':
        return {icon: PhFileVideo, color: '#591c17'}
      default:
        return {icon: PhFile, color: '#32C8B4'}

    }
  }


  onMounted(() => {
    repository.value = fetchRepositoryData(route.params.slug as string)
  })

</script>

<template>
  <MainLayout title="Repository Details">
    <div v-if="repository" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-repository-heading d-flex align-center">
              {{repository.title}}
            </p>
            <p class="text-subtitle text-gs20">{{repository.subtitle}}</p>
            <p class="text-subtitle">{{ repository.owner }} | {{ repository.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</p>
          </div>
          <VBtnPrimaryFilled width="151px" height="45px" rounded="lg" class="satoshi-md">
            <PhDownload size="20" class="mr-2"/>
            Download
          </VBtnPrimaryFilled>
        </VRow>
      </div>
      <VTabs
          class="mx-6"
          color="primary"
          v-model="tab"
      >
        <VTab value="data" class="tab-title text-none mx-2">Data</VTab>
        <VTab value="discussions" class="tab-title text-none mx-2">Discussions</VTab>
        <VTab value="settings" class="tab-title text-none mx-2">Settings</VTab>
      </VTabs>
      <VDivider/>
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
    <div v-else style="height: 100%">
      <div style="height:60vh" class="d-flex flex-column justify-center align-center">
        <VImg
            :src="NotFound"
            width="400px"
        />
        <p class="text-h4 font-weight-black">Repository Not Found</p>
      </div>
    </div>
  </MainLayout>
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
  .text-repository-heading{
    font-weight: 900;
    font-size: 22px;
  }

  .text-about-heading{
    font-weight: 800;
    font-size: 20px;
    margin-bottom: 5px;
  }

  .circle::after {
    content: '';
    position: absolute;
    left: -209px;
    top: -430px;
    width: 590px;
    height: 561px;
    border-radius: 50%;
    background: #DEF1FB;
    z-index: 1;
    opacity: 75%;
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

  .v-tab.v-tab.v-btn{
    min-width: 40px;
  }

  .v-tab{
    font-size: 16px;
    letter-spacing: .7px;
  }

  .tag-chips{
    background-color: #fafafa;
    border: 1px solid #e4e4e4;
  }


</style>
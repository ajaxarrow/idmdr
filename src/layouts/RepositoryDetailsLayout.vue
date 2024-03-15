<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {PhDownload} from "@phosphor-icons/vue";
import NotFound from "../assets/images/404.svg";
import {PropType} from "vue";
import {Repository} from "../interfaces/repository.interface.ts";
import {onMounted, ref} from "vue";
import {useRouting} from "../composables/useRouting.ts";

const tab = ref("discussions");
const {router} = useRouting()
const props = defineProps({
  repository: {
    type: Object as PropType<Repository> || undefined,
  },
  activeTab: {
    type: String
  }
});

const tabs = [
  {
    name: "Data",
    linkName: "repository-data"
  },
  {
    name: "Discussions",
    linkName: "repository-discussions"
  },
  {
    name: "Settings",
    linkName: "repository-settings"
  }
]

const navigateTo = (linkName: string) => {
  router.push({
    name: linkName,
  });
}

onMounted(()=>{
  if(props.activeTab){
    tab.value = props.activeTab
  }
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
        <VTab
          v-for="tab in tabs"
          class="tab-title text-none mx-2"
          :value="tab.name.toLowerCase()"
          @click="navigateTo(tab.linkName)"
        >
          {{tab.name}}
        </VTab>
      </VTabs>
      <VDivider/>
      <slot/>
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
.text-repository-heading{
  font-weight: 900;
  font-size: 22px;
}
</style>
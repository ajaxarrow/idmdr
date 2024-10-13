<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {PhArrowLeft, PhDownload} from "@phosphor-icons/vue";
import NotFound from "../../assets/images/404.svg";
import {computed, PropType} from "vue";
import {Repository} from "../../interfaces/repository.interface.ts";
import {onMounted, ref} from "vue";
import {useRouting} from "../composables/useRouting.ts";
import {useUserStore} from "../stores/user.store.ts";

const {user} = useUserStore();
const tab = ref("data");
const path = ref('repositories')
const {router, route} = useRouting()
const props = defineProps({
  repository: {
    type: Object as PropType<Repository | null | undefined>,
  },
  activeTab: {
    type: String
  }
});

const downloadFiles = () => {
  let fileContent = '';
    if (props.repository) {
      fileContent += `Repository Name: ${props.repository.title}\n\n`;
      if (props.repository.files) {
        props.repository.files.forEach((file, index) => {
          fileContent += `File ${index + 1}:\nName: ${file.name}\nDescription: ${file.description}\n\n`;
        });
      }
    }

  const blob = new Blob([fileContent], { type: 'text/plain' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${props.repository?.slug}.txt`;

  link.click();

  URL.revokeObjectURL(url);
}


const tabs = [
  {
    name: "Data",
    // linkName: "repository-data"
  },
  {
    name: "Discussions",
    // linkName: "repository-discussions"
  },
  ...(user.value ? [{
    name: "Settings",
    // linkName: "repository-settings"
  }] : [])
]

const computedTabs = computed(() => {
  return tabs.map(tab => {
    let linkName;
    if(tab.name === "Data"){
      linkName = path.value === 'repositories' ? 'repository-data' : 'my-repository-data';
    } else if(tab.name === "Discussions"){
      linkName = path.value === 'repositories' ? 'repository-discussions' : 'my-repository-discussions';
    } else if(tab.name === "Settings" && user.value){
      linkName = path.value === 'repositories' ? 'repository-settings' : 'my-repository-settings';
    }
    return {
      ...tab,
      linkName
    }
  })
})

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


const navigateTo = (linkName: string) => {
  router.push({
    name: linkName,
  });
}

onMounted(()=>{
  if(props.activeTab){
    tab.value = props.activeTab
  }
  path.value = getFirstPath(<string>route.path)
})


</script>

<template>
  <MainLayout title="Repository Details">
    <div v-if="repository" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
       <div class="d-flex">
         <RouterLink
             :to="{
          name: path == 'repositories' ?  'repositories' : 'my-repositories'
        }"
             class="text-decoration-none text-none">
           <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
             <PhArrowLeft size="14" class="mr-1"/>
             Back To {{path == 'repositories' ?  'Repositories' : 'My Repositories'}}
           </p>
         </RouterLink>
       </div>
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-repository-heading d-flex align-center">
              {{repository.title}}
            </p>
<!--            <p class="text-subtitle text-gs20">{{repository.subtitle}}</p>-->
            <p class="text-subtitle">{{ repository?.owner.username }} · {{ repository?.organizationData.name }} ({{ repository?.organizationData.acronym }}) · {{ new Date(repository?.updated_at).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) }}</p>
          </div>
          <VBtnPrimaryFilled width="151px" height="45px" rounded="lg" class="satoshi-md" @click="downloadFiles">
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
          v-for="tab in computedTabs"
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
</style>
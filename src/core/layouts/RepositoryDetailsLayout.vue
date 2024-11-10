<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import {PhArrowLeft, PhDownload, PhFolderSimpleLock} from "@phosphor-icons/vue";
import NotFound from "../../assets/images/404.svg";
import {computed, PropType, watch} from "vue";
import {Repository} from "../../interfaces/repository.interface.ts";
import {onMounted, ref} from "vue";
import {useRouting} from "../composables/useRouting.ts";
import {useUserStore} from "../stores/user.store.ts";
import {useRepositoryServices} from "../../modules/repository/services/repository.services.ts";


const {fetchRepositoriesByUser} = useRepositoryServices();
const {user} = useUserStore();
const {router, route} = useRouting()
const tab = ref("data");
const path = ref('repositories')

const isMember = ref(false)
const buttonLoading = ref(false)
const pageLoading = ref(false);
const isRepoAvailable = ref(false);
const props = defineProps({
  repository: {
    type: Object as PropType<Repository | null | undefined>,
  },
  activeTab: {
    type: String
  }
});

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};


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

const downloadRepoFiles = (): void => {
    window.open(`${import.meta.env.VITE_BASE_API_URL_DJANGO}/v1/repository/attachments/download/${props.repository?.slug}`, '_blank');
};


const navigateTo = (linkName: string) => {
  router.push({
    name: linkName,
  });
}

const initialize = async () => {
  pageLoading.value = true;
  buttonLoading.value = true
  if(props.activeTab){
    tab.value = props.activeTab
  }
  path.value = getFirstPath(<string>route.path)
  const allUserRepo = await fetchRepositoriesByUser();
  if (props.repository?.visibility === 1 || props.repository?.visibility === 4) {
    isRepoAvailable.value = true;
  } else {
    isRepoAvailable.value = isSlugInRepoList(props.repository, allUserRepo)
  }
  if(isSlugInRepoList(props.repository, allUserRepo)) {
    isMember.value = true;
  }
  buttonLoading.value = false
  pageLoading.value = false;
}

onMounted(() => {
  if (props.repository) {
    initialize();
  } else {
    watch(
        () => props.repository,
        (newOrg) => {
          if (newOrg) initialize();
        },
        { immediate: true }
    );
  }
});


</script>

<template>
  <MainLayout title="Repository Details">
    <div v-if="pageLoading" class="loading-state-container" style="height: 85vh;">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="repository && isRepoAvailable" style="height: 100%" class="relative-container circle">
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
          <VRow justify="space-between" align="center" class="ma-0 ga-4">
            <div>
              <p class="text-repository-heading d-flex align-center">
                {{repository.title}}
              </p>
              <!--            <p class="text-subtitle text-gs20">{{repository.subtitle}}</p>-->
              <p class="text-subtitle">{{ repository?.owner_data?.username }} · {{ repository?.org_data?.name }} ({{ repository?.org_data?.acronym }}) · {{ new Date(repository?.updated_at as string).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) }}</p>
            </div>
            <VBtnPrimaryFilled v-if="isMember" :loading="buttonLoading" height="45px" rounded="lg" class="satoshi-md" @click="downloadRepoFiles" style="font-size: 14px !important;">
              <PhDownload size="16" class="mr-2"/>
              Download
            </VBtnPrimaryFilled>
            <VBtnPrimaryFilled :loading="buttonLoading" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
              <PhFolderSimpleLock size="16" class="mr-2"/>
              Request Access
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
              @click="navigateTo(<string>tab.linkName)"
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
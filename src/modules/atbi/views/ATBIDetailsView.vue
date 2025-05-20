<script setup lang="ts">
import NotFound from "../../../assets/images/404.svg";
import {onMounted, ref, watch} from "vue";
import {ATBI} from "../../../interfaces/atbi.interface.ts";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import ATBIOverview from "../components/tabs/ATBIOverview.vue";
import {useAtbiServices} from "../services/atbi.services.ts";
import {PhArrowLeft, PhDotsThreeOutlineVertical, PhPencil, PhTrash} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import ATBISubEntityDataTable from "../components/ATBISubEntityDataTable.vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
const {setSnackbarMessage} = useSnackbarStore()
const {fetchRepositoryIDsByUser} = useRepositoryServices()
const {userData} = useUserStore()
const { route, router } = useRouting()
const {isSmall} = useScreenStore()
const atbiData = ref<ATBI | null | undefined>(null)
const {fetchAtbiData, deleteAtbi} = useAtbiServices()
const pageLoading = ref(false)
const tab = ref("overview")
const tabs = ['Overview', 'Products', 'Facilities', 'Linkages', 'Awards']
const isMember = ref(false)
const {showSnackbarMessage} = useSnackbarStore();
const atbiActionMenu = ref(false)

const deleteAtbiCallback = async () => {
  await deleteAtbi(route.params.slug as string)
  showSnackbarMessage('ATBI deleted successfully', Status.success)
  router.push({name: 'atbi'})
}

const isSlugInTechList = (atbi: ATBI | null | undefined, repoList: Repository[]) => {
  return repoList.some((repo: any) => repo.slug == atbi?.technology);
}

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
    await setSnackbarMessage()
    pageLoading.value = true

    atbiData.value = await fetchAtbiData(route.params.slug as string)
    const userRepo =  await fetchRepositoryIDsByUser(
        10000, true, '', '', '', true, true, 'Project Repository'
    );
    if(isSlugInTechList(atbiData.value, userRepo)) {
      isMember.value = true
    }
    tab.value = getTabFromQuery()

    pageLoading.value = false
  })
</script>

<template>
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
                 <a class="text-decoration-none text-bs50 sub-link" :href="`tel:${atbiData?.mobile}`">{{ atbiData?.mobile }}</a> · <a class="text-decoration-none text-bs50 sub-link" :href="atbiData?.email">Email</a> · <a class="text-decoration-none text-bs50 sub-link" :href="atbiData?.facebook">Facebook</a>
              </p>
              <p class="text-subtitle">
                Associated IP Technology: {{atbiData?.tech_name}}
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
        <VRow class="ma-0 px-6" justify="end" v-if="isMember || userData.is_superuser">
          <VMenu v-model="atbiActionMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                Options
                <PhDotsThreeOutlineVertical weight="fill"/>
              </p>
            </template>
            <VSheet width="200" class="rounded-b-lg py-2">
              <div>
                <RouterLink
                    :to="{ name: 'edit-atbi', params: { slug: atbiData?.uuid } }"
                    class="cursor-pointer action-menu-item text-decoration-none text-black"
                >
                  <PhPencil/>
                  Edit
                </RouterLink>
                <DeleteDialog @callback="deleteAtbiCallback">
                  <p class="cursor-pointer action-menu-item">
                    <PhTrash/>
                    Delete
                  </p>
                </DeleteDialog>
              </div>
            </VSheet>
          </VMenu>
        </VRow>
        <VTabs class="mx-6" color="primary" v-model="tab">
          <VTab v-for="tabItem in tabs" class="tab-title text-none mx-2" :value="tabItem.toLowerCase()">
            {{tabItem}}
          </VTab>
        </VTabs>
        <VDivider/>

        <!-- Show component based on active tab -->
        <ATBIOverview v-if="tab === 'overview'" :atbi="atbiData!"/>
        <ATBISubEntityDataTable v-if="tab === 'products'" :atbi="atbiData!" :isMember="isMember" type="product"/>
        <ATBISubEntityDataTable v-if="tab === 'facilities'" :atbi="atbiData!" :isMember="isMember" type="facility"/>
        <ATBISubEntityDataTable v-if="tab === 'linkages'" :atbi="atbiData!" :isMember="isMember" type="linkage"/>
        <ATBISubEntityDataTable v-if="tab === 'awards'" :atbi="atbiData!" :isMember="isMember" type="award"/>
      </div>
      <div v-else style="height: 100%">
        <div style="height:60vh" class="d-flex flex-column justify-center align-center">
          <VImg :src="NotFound" width="400px" />
          <p class="text-h4 font-weight-black">ATBI Data Not Found</p>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<style scoped>
.sub-link:hover{
  text-decoration: underline !important;
}
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
  left: -190px;
  top: -380px;
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
.action-button {
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover {
  background-color: #F0F5F9;
}

.action-menu-item {
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}
</style>
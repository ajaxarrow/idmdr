<script setup lang="ts">
import NotFound from "../../../assets/images/404.svg";
import { onMounted, ref, watch } from "vue";
import { ATBI } from "../../../interfaces/atbi.interface.ts";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import { useRouting } from "../../../core/composables/useRouting.ts";
import atbi from "../../../data/atbi.ts";
import { useStringArrayHelper } from "../../../core/composables/useStringArrayHelper.ts";
import ATBIFacilities from "../components/ATBIFacilities.vue";
import ATBIProducts from "../components/ATBIProducts.vue";
import ATBIOverview from "../components/ATBIOverview.vue";

const { route, router } = useRouting()
const { arrayToString } = useStringArrayHelper()
const atbiData = ref<ATBI | null | undefined>(null)
const pageLoading = ref(false)
const tab = ref("overview")
const tabs = ['Overview', 'Products', 'Facilities']

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

onMounted(() => {
  pageLoading.value = true

  // Get ATBI data
  atbiData.value = atbi.find((atbi: ATBI) => atbi.uid === route.params.slug as string)

  // Set tab from query or default to "overview"
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
            <div>
              <p class="text-repository-heading d-flex align-center">
                {{atbiData.name}}
              </p>
              <!-- <p class="text-subtitle text-gs20">{{repository.subtitle}}</p>-->
              <p class="text-subtitle">
                Owners: {{ arrayToString(atbiData?.owner as string[]) }}
              </p>
              <p class="text-subtitle">
                {{ atbiData?.mobile }} · <a class="text-decoration-none text-bs50" href="mailto:{{ atbiData?.email }}">Email</a> · <a class="text-decoration-none text-bs50" href="{{ atbiData?.facebook }}">Facebook</a>
              </p>
            </div>
          </VRow>
        </div>
        <VTabs class="mx-6" color="primary" v-model="tab">
          <VTab v-for="tabItem in tabs" class="tab-title text-none mx-2" :value="tabItem.toLowerCase()">
            {{tabItem}}
          </VTab>
        </VTabs>
        <VDivider/>

        <!-- Show component based on active tab -->
        <ATBIFacilities v-if="tab === 'facilities'" :atbi="atbiData!"/>
        <ATBIProducts v-if="tab === 'products'" :atbi="atbiData!"/>
        <ATBIOverview v-if="tab === 'overview'" :atbi="atbiData!"/>
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
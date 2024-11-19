<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {onMounted, ref} from "vue";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useSectorServices} from "../../sector/services/sector.services.ts";
import UserSectorCharts from "../components/Profile/UserSectorCharts.vue";
import UserAccessRequests from "../components/Profile/UserAccessRequestsChart.vue";

const {userData} = useUserStore()
const {fetchRepositoriesByUser} = useRepositoryServices()
const {fetchOrganizationByUser} = useOrganizationServices()
const {fetchSectors} = useSectorServices()

const pageLoading = ref(false)
const sectorsLength = ref(0)
const repoLength = ref (0)
const orgLength = ref(0)

onMounted(async () => {
  pageLoading.value = true
  sectorsLength.value = (await fetchSectors()).filter(sector => sector.owner_id === userData.uid).length
  repoLength.value =  (await fetchRepositoriesByUser()).length
  orgLength.value = (await fetchOrganizationByUser()).filter(org => !org.is_deleted).length
  pageLoading.value = false
  pageLoading.value = false
})


</script>

<template>
  <MainLayout title="My Profile">
    <div v-if="pageLoading" class="loading-state-container" style="height: 85vh">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
          <p class="text-heading d-flex align-center">
            Profile
          </p>
          <p class="text-subtitle">
            Discover your personalized dashboard, with insights and stats on your repositories and organizations.
          </p>
        </div>
<!--        <div class="d-flex align-center ga-2">-->
<!--          <VAvatar-->
<!--              size="50"-->
<!--              class="ml-1 cursor-pointer"-->
<!--          >-->
<!--            <VImg :src="userData.profilePicture"></VImg>-->
<!--          </VAvatar>-->
<!--          <div>-->
<!--            <p class="text-heading d-flex align-center">-->
<!--              {{userData.username}}-->
<!--            </p>-->
<!--            <p class="text-subtitle">-->
<!--              {{userData.email}}-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <VDivider/>
      <div class="pa-6">
        <div class="d-flex align-center ga-2">
          <VAvatar
              size="50"
              class="ml-1 cursor-pointer"
          >
            <VImg :src="userData.profilePicture"></VImg>
          </VAvatar>
          <div>
            <p class="text-heading d-flex align-center">
              {{userData.username}}
            </p>
            <p class="text-subtitle">
              {{userData.email}}
            </p>
          </div>
        </div>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">User Statistics</p>
        <VRow class="ma-0">
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Organizations</p>
            <p class="text-subtitle pr-3">{{orgLength}}</p>
          </VCol>
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Repositories</p>
            <p class="text-subtitle pr-3">{{repoLength}}</p>
          </VCol>
          <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
            <p class="text-subtitle text-gs20">Sectors</p>
            <p class="text-subtitle pr-3">{{sectorsLength}}</p>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">User Sector Statistics</p>
        <UserSectorCharts/>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">User Access Requests Statistics</p>
        <UserAccessRequests/>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">User Repository Actions</p>
        <div class="mt-5">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Add Repository</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Add Repository Related to Your Project</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: 'new-repository'}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              Add Repository
            </VBtnPrimaryFilled>
          </VRow>
        </div>
        <div class="mt-5">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">View Repositories</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">View and browse your created repositories</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: 'my-repositories'}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              View Repositories
            </VBtnPrimaryFilled>
          </VRow>
        </div>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">User Organization Actions</p>
        <div class="mt-5">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Add Organization</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Add Organization to your profile</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: 'new-organization'}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              Add Organization
            </VBtnPrimaryFilled>
          </VRow>
        </div>
        <div class="mt-5">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">View Organizations</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">View and browse your organizations</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: 'my-organizations'}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              View Organizations
            </VBtnPrimaryFilled>
          </VRow>
        </div>
      </div>
      <VDivider/>
      <div class="px-7 py-5">
        <p class="text-about-heading py-3">User Sector Actions</p>
        <div class="mt-5">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Tag Sector</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Tag a Repository or an Organization to Geographic Location in the Map</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: 'new-sector'}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              Tag Sector
            </VBtnPrimaryFilled>
          </VRow>
        </div>
      </div>
      <VDivider/>
    </div>
  </MainLayout>
</template>

<style scoped>
.circle::after {
  content: '';
  position: absolute;
  right: -212px;
  top: -460px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}

.section-title{
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}


</style>
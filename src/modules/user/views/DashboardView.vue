<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhCloud, PhFactory, PhHandWaving, PhInfo, PhUsersThree, PhWarning} from "@phosphor-icons/vue";
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import HeadlineCard from "../../../core/components/Dashboard/HeadlineCard.vue";
import DataCard from "../../../core/components/Dashboard/DataCard.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {onMounted, ref} from "vue";
import {useSectorServices} from "../../sector/services/sector.services.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";

const {fetchRepositoryIDsByUser, fetchRepositories} = useRepositoryServices()
const {fetchOrganizationIDsByUser, fetchOrganizationCount} = useOrganizationServices()
const {fetchSectors, fetchSectorTotalCount} = useSectorServices()
const repositoryData = ref<Repository[]>([]);
const sectorsLength = ref(0)
const repoLength = ref (0)
const orgLength = ref(0)
const pageLoading = ref(false)
const {user, userData} = useUserStore()
const dataCards = [
  {
    name: 'Sectors',
    value: sectorsLength,
    icon: PhFactory
  },
  {
    name: 'Projects',
    value: repoLength,
    icon: PhCloud
  },
  {
    name: 'CMIs',
    value: orgLength,
    icon: PhUsersThree
  }
]

onMounted(async () => {
  pageLoading.value = true
  repositoryData.value = await fetchRepositories(3)
  repoLength.value =  (await fetchRepositoryIDsByUser(10000, !userData.is_superuser)).length
  sectorsLength.value = userData.is_superuser ? (await fetchSectorTotalCount(1, 10000)) : (await fetchSectors()).length
  orgLength.value = userData.is_superuser ? (await fetchOrganizationCount(1, 10000)) : (await fetchOrganizationIDsByUser()).length
  pageLoading.value = false
})
</script>

<template>
  <MainLayout title="Dashboard">
    <div v-if="pageLoading" class="loading-state-container" style="height: 85vh">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div class="pa-6">
        <p class="text-heading d-flex align-center">
          Hello, {{user ? userData.firstName + ' ' + userData.lastName : 'Guest User'}}! <PhHandWaving weight="bold" class="flip-horizontal ml-2"/>
        </p>
        <p class="text-subtitle">Welcome back to your dashboard</p>
      </div>
      <VDivider/>
      <div class="pa-6 mt-3">
        <VAlert
            v-if="!userData.is_approved && user"
            color="#ff9800"
            variant="tonal"
            border="start"
            class="inactive-repo-banner mb-8"
            style="margin: 0;"
        >
          <div class="d-flex align-center">
            <div class="warning-icon-container me-3">
              <PhWarning size="24" weight="fill" class="warning-icon" />
            </div>
            <div class="warning-content">
              <VAlert-title class="warning-title font-weight-bold">
                Account Awaiting Approval
              </VAlert-title>
              <div class="warning-message">
                Your account has not yet been approved, and access is currently restricted. Reach out to the system administrator to request approval and gain full user privileges.
              </div>

            </div>
          </div>
        </VAlert>
        <VRow align="center" class="mx-0" >
          <VCol cols="auto" style="padding: unset;" v-if="user && userData.is_approved">
            <HeadlineCard/>
          </VCol>
          <VCol cols="auto" style="padding: unset;">
            <VRow class="my-0">
              <DataCard v-for="dataCard in dataCards" :data="dataCard"/>
            </VRow>
          </VCol>
        </VRow>
        <VRow justify="space-between" align="center" class="ma-0 my-6">
          <p class="text-title">Browse Latest Projects</p>
          <RouterLink class="link" :to="{name: 'repositories'}">See All</RouterLink>
        </VRow>
        <div>
          <RepositoryItem
              v-if="repositoryData.length > 0"
              v-for="repository in repositoryData"
              :repository="repository" />
          <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Projects Found</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>

  .flip-horizontal{
    transform: scaleX(-1);
  }

  .link{
    text-decoration: none !important;
    color: #191919;
    padding: 4px 10px;
  }

  .link:hover{
    background: #e4e4e4;
    color: black;
    font-weight: 500;
    border-radius: 4px;
  }
</style>

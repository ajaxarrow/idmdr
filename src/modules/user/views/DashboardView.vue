<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhCloud, PhFactory, PhHandWaving, PhInfo, PhUsersThree} from "@phosphor-icons/vue";
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import HeadlineCard from "../../../core/components/Dashboard/HeadlineCard.vue";
import DataCard from "../../../core/components/Dashboard/DataCard.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {onMounted, ref} from "vue";

const {fetchRepositories} = useRepositoryServices()
const repositoryData = ref<Repository[]>([]);
const pageLoading = ref(false)
const {user, userData} = useUserStore()
const dataCards = [
  {
    name: 'Sectors',
    value: 28,
    icon: PhFactory
  },
  {
    name: 'Repositories',
    value: 35,
    icon: PhCloud
  },
  {
    name: 'Members',
    value: 21,
    icon: PhUsersThree
  }
]

onMounted(async () => {
  pageLoading.value = true
  repositoryData.value = await fetchRepositories(3)
  pageLoading.value = false
})
</script>

<template>
  <MainLayout title="Dashboard">
    <div class="pa-6">
      <p class="text-heading d-flex align-center">
        Hello, {{user ? userData.username : 'Guest User'}}! <PhHandWaving weight="bold" class="flip-horizontal ml-2"/>
      </p>
      <p class="text-subtitle">Welcome back to your dashboard</p>
    </div>
    <VDivider/>
    <div class="pa-6 mt-3">
      <VRow align="center" class="mx-0" >
        <VCol cols="auto" style="padding: unset;" v-if="user">
          <HeadlineCard/>
        </VCol>
        <VCol cols="auto" style="padding: unset;">
          <VRow class="my-0">
            <DataCard v-for="dataCard in dataCards" :data="dataCard"/>
          </VRow>
        </VCol>
      </VRow>
      <VRow justify="space-between" align="center" class="ma-0 my-6">
        <p class="text-title">Browse Latest Repositories</p>
        <RouterLink class="link" :to="{name: 'repositories'}">See All</RouterLink>
      </VRow>
      <div v-if="pageLoading" class="loading-state-container">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <div v-else>
        <RepositoryItem
            v-if="repositoryData.length > 0"
            v-for="repository in repositoryData"
            :repository="repository" />
        <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Repositories Found</p>
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

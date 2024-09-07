<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhCloud, PhFactory, PhHandWaving, PhUsersThree} from "@phosphor-icons/vue";
import {repositories} from '../../../data/repository.ts'
import RepositoryItem from "../../../core/components/Dashboard/RepositoryItem.vue";
import HeadlineCard from "../../../core/components/Dashboard/HeadlineCard.vue";
import DataCard from "../../../core/components/Dashboard/DataCard.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {user} = useUserStore()
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
</script>

<template>
  <MainLayout title="Dashboard">
    <div class="pa-6">
      <p class="text-heading d-flex align-center">
        Hello, Jiu Axl! <PhHandWaving weight="bold" class="flip-horizontal ml-2"/>
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
      <RepositoryItem v-for="repository in repositories.slice(0, 4)" :repository="repository" />
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
  }
</style>

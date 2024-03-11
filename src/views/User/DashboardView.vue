<script setup lang="ts">
import MainLayout from "../../layouts/MainLayout.vue";
import {PhCloud, PhFactory, PhHandWaving, PhUsersThree} from "@phosphor-icons/vue";
import {repositories} from '../../data/repository.ts'
import RepositoryItem from "../../components/Dashboard/RepositoryItem.vue";
import HeadlineCard from "../../components/Dashboard/HeadlineCard.vue";
import DataCard from "../../components/Dashboard/DataCard.vue";

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
        <VCol cols="auto" style="padding: unset;">
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
        <p>See All</p>
      </VRow>
      <RepositoryItem v-for="repository in repositories.slice(0, 4)" :repository="repository" />
    </div>
  </MainLayout>
</template>

<style scoped>
  .text-heading{
    font-size: 20px;
    font-weight: 900;
  }

  .text-subtitle{
    font-size: 14px;
  }

  .text-title{
    font-size: 18px;
    font-weight: 600;
  }

  .flip-horizontal{
    transform: scaleX(-1);
  }

</style>

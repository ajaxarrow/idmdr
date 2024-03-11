<script setup lang="ts">
import Sector from '../../assets/images/sector-img.jpg';
import MainLayout from "../../layouts/MainLayout.vue";
import {PhCloud, PhFactory, PhHandWaving, PhUsersThree} from "@phosphor-icons/vue";
import {repositories} from '../../data/repository.ts'

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
          <VSheet width="385px" height="174px" class="card pb-4 pt-6 mr-6 my-1">
            <VRow class="mx-0" justify="space-between" align="center">
              <VImg
                  :src="Sector"
                  height=148px
              />
              <div style="width: 220px">
                <p style="font-weight: 600">Tag a Sector Now</p>
                <p class="text-subtitle">Create a sector and tag it in your existing repository!</p>
                <VBtnPrimaryFilled class="my-2" height="38" width="193" rounded="lg">
                  Tag a Sector Now!
                </VBtnPrimaryFilled>
              </div>
            </VRow>
          </VSheet>
        </VCol>
        <VCol cols="auto" style="padding: unset;">
          <VRow class="my-0">
            <VSheet
                v-for="dataCard in dataCards"
                width="174px"
                height="174px"
                class="pa-4 my-1 card mx-3 circle relative-container">
              <component :is="dataCard.icon" weight="bold" size="32" class="mt-7 mb-4"/>
              <p class="dashboard-card-num">{{dataCard.value}}</p>
              <p class="dashboard-card-subtitle">{{dataCard.name}}</p>
            </VSheet>
          </VRow>
        </VCol>
      </VRow>
      <VRow justify="space-between" align="center" class="ma-0 my-6">
        <p class="text-title">Browse Latest Repositories</p>
        <p>See All</p>
      </VRow>
      <div v-for="repository in repositories.slice(0, 4)" class="mb-2">
        <VRow justify="space-between" align="center" class="ma-0" >
          <div class="d-flex align-center">
            <VImg
                style="border-radius: 8px"
                cover
                height="40px"
                width="40px"
                :src="repository.image ? repository.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
            />
            <div class="ml-2">
              <p class="repository-title">{{repository.title}}</p>
              <p class="repository-subtitle">{{ repository.owner }} · {{repository.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}}</p>
            </div>
          </div>
          <VBtn class="text-none bg-background view-details-btn" height="35px" width="95px" rounded="xl" >
            View Details
          </VBtn>
        </VRow>
        <VDivider class="mt-2"/>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
  .repository-title{
    font-weight: 600;
  }

  .repository-subtitle{
    font-size: 14px;
  }

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

  .view-details-btn{
    font-size: 14px;
    letter-spacing: 0;
  }

  .card{
    border-radius: 10px;
    border: 2px solid #E5ECF6;
  }

  .circle::before{
    top: 0;
    right: 0;
    content: '';
    position: absolute;
    width: 85px;
    height: 70px;
    background: #DEF1FB;
    border-radius: 0 20% 0 300%;
    z-index: 1;
  }

  .relative-container{
    position: relative;
  }

  .dashboard-card-num{
    font-size: 28px;
    font-weight: 900;
    line-height: 1;
  }

  .dashboard-card-subtitle{
    font-size: 20px;
    font-weight: 600;
  }
</style>

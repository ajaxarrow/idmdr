<script setup lang="ts">
import Sector from '../../assets/images/sector-img.jpg';
import MainLayout from "../../layouts/MainLayout.vue";
import {PhCloud, PhFactory, PhHandWaving, PhUsersThree} from "@phosphor-icons/vue";

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

  .flip-horizontal{
    transform: scaleX(-1);
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
    border-radius: 0 20% 0% 300%;
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

<script setup lang="ts">
  import {PhCircle} from "@phosphor-icons/vue";
  import {useFilterStore} from "../../stores/filters.store.ts";

  const {dotDensityLayer} = useFilterStore();
  const legends = [
    {
      commodity: 'Corn',
      color: '#FFBE0B'
    },
    {
      commodity: 'Poultry',
      color: '#FB5607'
    },
    {
      commodity: 'Tropical Fruits',
      color: '#FF006E'
    },
    {
      commodity: 'Grains',
      color: '#8338EC'
    },
    {
      commodity: 'Rice',
      color: '#3A86FF'
    }
  ]
</script>

<template>
  <VSheet class="sheet-container ma-4" v-if="dotDensityLayer">
    <p class="sheet-title pa-4">Legend</p>
    <VDivider/>
    <div class="pa-4">
      <div v-for="legend in legends" class="d-flex align-center">
        <PhCircle weight="fill" size="20" :color="legend.color" class="mr-2"/>
        <p>{{legend.commodity}}</p>
      </div>
<!--      <div class="d-flex align-center justify-space-between">-->
<!--        <p class="d-flex align-center"> <PhDotsSixVertical size="24"/> Sugarcane Height</p>-->
<!--        <div class="mt-2">-->
<!--          <PhInfo weight="fill" size="20" color="#5E5E5E"/>-->
<!--          <PhX weight="bold" size="20" color="#5E5E5E"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="gradient-line mt-5 mb-1"></div>-->
<!--      <div class="d-flex align-center justify-space-between">-->
<!--        <p class="gradient-legend">1m</p>-->
<!--        <p class="gradient-legend">3m</p>-->
<!--        <p class="gradient-legend">5m</p>-->
<!--      </div>-->
    </div>
  </VSheet>
</template>

<style scoped>
  .sheet-container{
    z-index: 2;
    position: fixed;
    top: 0;
    left: 360px;
    right: 0;
    height: 210px;
    width: 266px;
    border-radius: 15px;
    box-shadow: 0px 0px 7px 0px #5d6e87;
  }

  .sheet-title{
    font-weight: 700;
    font-size: 16px;
    color: #000000;
  }

  .gradient-line {
    height: 15px; /* Thickness of the line */
    background: linear-gradient(to right, #CEF8DA, #124717); /* Gradient colors */
  }

  .gradient-legend{
    font-size: 12px;
  }
</style>
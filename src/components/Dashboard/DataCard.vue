<script setup lang="ts">
import {PropType} from "vue";
import {Repository} from "../../interfaces/repository.interface.ts";

const props = defineProps({
  data: {
    type: Object,
  }
});
</script>

<template>
  <VSheet
      width="174px"
      height="174px"
      class="pa-4 my-1 card mx-3 circle relative-container">
    <component :is="props.data?.icon" weight="bold" size="32" class="mt-7 mb-4"/>
    <p class="dashboard-card-num">{{props.data.value}}</p>
    <p class="dashboard-card-subtitle">{{props.data.name}}</p>
  </VSheet>
</template>

<style scoped>
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
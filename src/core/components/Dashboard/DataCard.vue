<script setup lang="ts">
import {useUserStore} from "../../stores/user.store.ts";

const props = defineProps({
  data: {
    type: Object,
  }
});
const {userData} = useUserStore()
</script>

<template>
  <div class="card-wrapper my-1 mx-3">
    <VSheet
        width="174px"
        height="174px"
        class="pa-4 card circle relative-container">
      <component :is="props.data?.icon" weight="bold" size="32" class="mt-7 mb-4"/>
      <p class="dashboard-card-num">{{props.data?.value}}</p>
      <p class="dashboard-card-subtitle"><span v-if="!userData.is_superuser">Managed and Affiliated</span> {{props.data?.name}}</p>
    </VSheet>
  </div>
</template>

<style scoped>
  .card-wrapper{
    position: relative;
    overflow: hidden;
  }
  .card{
    border-radius: 10px;
    border: 2px solid #E5ECF6;
  }

  .circle::before{
    top: -55px;
    right: -34px;
    content: '';
    position: absolute;
    width: 126px;
    height: 126px;
    background: #DEF1FB;
    border-radius: 50%;
    z-index: 1;
  }
  .circle{
    overflow: hidden;
  }

  .dashboard-card-num{
    font-size: 24px;
    font-weight: 900;
    line-height: 1;
  }

  .dashboard-card-subtitle{
    font-size: 14px;
    font-weight: 600;
  }
</style>
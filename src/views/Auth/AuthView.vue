<script setup lang="ts">
import AuthCard from "../../components/Auth/AuthCard.vue";
</script>

<template>
  <VLayout class="circle-top-left circle-bottom-right">
   <AuthCard/>
  </VLayout>
</template>

<style scoped>
.circle-top-left::before {
  content: '';
  position: fixed;
  top: -294px;
  left: -185px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: -2;
}

.circle-bottom-right::after {
  content: '';
  position: fixed;
  bottom: -294px;
  right: -185px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: -1;
}
</style>
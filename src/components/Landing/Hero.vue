<script setup lang="ts">

import {PhMapTrifold} from "@phosphor-icons/vue";
</script>

<template>
  <p class="text-heading font-weight-black text-h1 text-center gradient-text">Interactive Data <br/> Mapping Distribution</p>
  <p class="text-center text-subtitle ">Empowering data interaction through dynamic mapping, and repository solutions.</p>
  <VRow class="mt-4" justify="center">
    <VBtnPrimary width="320px" class="mb-3">
      <PhMapTrifold size="20" class="mr-2"/> Explore our Interactive Map
    </VBtnPrimary>
    <VBtnPrimaryPlain color="gs90" width="200px" :to="{ path: 'auth', query: { tab: 'register' } }">
      <PhMapTrifold size="20" class="mr-2"/> Get Started
    </VBtnPrimaryPlain>
  </VRow>
</template>

<style scoped>
.text-heading{
  font-family: 'Inter', sans-serif !important;
  font-size: 76px !important;
  line-height: 90px;
  margin-top: 70px;
}

.text-subtitle{
  font-size: 24px;
  color: #5F6061;
  margin: 30px 0;
}

@media (max-width: 960px) {
  .text-heading{
    font-size: 62px !important;
    line-height: 80px;
    margin-top: 70px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .text-heading{
    font-size: 46px !important;
    line-height: 52px;
    margin-top: 40px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 20px;
  }
}

@media (max-width: 476px) {
  .text-heading{
    font-size: 40px !important;
    line-height: 42px;
    margin-top: 25px;
  }

  .text-subtitle{
    margin: 15px 0;
    font-size: 16px;
  }
}

.gradient-text {
  background: linear-gradient(to right, #5db6c1, #15284c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
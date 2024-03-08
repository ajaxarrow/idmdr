<script setup lang="ts">

import {PhHardDrives} from "@phosphor-icons/vue";
</script>

<template>
  <RouterLink to="/" class="text-decoration-none ">
  <div class="d-flex align-center text-logo">
    <PhHardDrives size="30" weight="duotone" color="#3291C7"/>
    IDMDR
  </div>
  </RouterLink>
</template>

<style scoped>
.text-logo{
  color: black;
  font-weight: 900 !important;
  font-size: 24px !important;
}
</style>
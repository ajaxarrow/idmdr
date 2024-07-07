<script setup lang="ts">
import {PhHardDrives} from "@phosphor-icons/vue";
</script>

<template>
  <div class="bg-sb20">
    <VContainer>
      <RouterLink to="/" class="text-decoration-none">
        <div class="d-flex align-center text-logo">
          <PhHardDrives :size="24" weight="duotone" color="#3291C7" class="ph-icon" />
          IDMDR
        </div>
      </RouterLink>
      <p class="text-gs30">Dahay • Silvestre • Tabilla</p>
      <VDivider class="my-3"/>
      <VRow class="ma-0" justify="space-between">
        <p class="footer-text">Made with passion and angst in Musuan, Bukidnon</p>
        <p class="footer-text">@2024 IDMDR</p>
      </VRow>
    </VContainer>
  </div>
</template>

<style scoped>
  .footer-text{
    color: #050E14;
    font-size: 14px;
  }

  .text-logo {
    color: black;
    font-weight: 900 !important;
    font-size: 20px !important;
  }
</style>
<script setup lang="ts">
// import {PhHardDrives} from "@phosphor-icons/vue";
import logo from '../../../assets/images/nomcaarrd.png';
</script>

<template>
  <div class="bg-sb20 px-2 px-lg-10">
    <VContainer fluid>
      <RouterLink to="/linnks" class="text-decoration-none">
        <div class="d-flex align-center text-logo">
          <!--          <PhHardDrives :size="24" weight="duotone" color="#3291C7" class="ph-icon" />-->
          <img style="height: 24px; " :src="logo" alt="logo"/>
          LINNKS
        </div>
      </RouterLink>
      <p class="text-gs30">Dahay • Silvestre • Tabilla</p>
      <VDivider class="my-3"/>
      <VRow class="ma-0" justify="space-between">
        <p class="footer-text">Made with passion and angst in Musuan, Bukidnon</p>
        <p class="footer-text">@2025 LINNKS</p>
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
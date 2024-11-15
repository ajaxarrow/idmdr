<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
</script>

<template>
  <MainLayout title="My Profile">
    <div style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
          <p class="text-heading d-flex align-center">
            Profile
          </p>
          <p class="text-subtitle">
            Browse Your Profile and Statistics about your Repositories and Organizations
          </p>
        </div>
      </div>
      <VDivider/>
      <div class="pa-6">
        Hi
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.circle::after {
  content: '';
  position: absolute;
  right: -212px;
  top: -460px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}
</style>
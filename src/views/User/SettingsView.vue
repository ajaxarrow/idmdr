<script setup lang="ts">
import MainLayout from "../../layouts/MainLayout.vue";
import {ref} from "vue";
const tab = ref("account")
</script>

<template>
  <MainLayout title="Settings">
    <div style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
          <p class="text-heading d-flex align-center">
            Settings
          </p>
          <p class="text-subtitle">
            Control all over your account and manage your organization
          </p>
        </div>
      </div>
      <VTabs
          class="mx-6"
          color="primary"
          v-model="tab"
      >
        <VTab value="account" class="tab-title text-none mx-2">Account</VTab>
        <VTab value="organization" class="tab-title text-none mx-2">Organization</VTab>
      </VTabs>
      <VDivider/>
    </div>
  </MainLayout>
</template>

<style scoped>
.v-tab.v-tab.v-btn{
  min-width: 40px;
}

.v-tab{
  font-size: 16px;
  letter-spacing: .7px;
}

.circle::after {
  content: '';
  position: absolute;
  right: -212px;
  top: -430px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}
</style>
<script setup lang="ts">
  import MainLayout from "../../layouts/MainLayout.vue";
  import {PhPlus} from "@phosphor-icons/vue";
  import {useScreenStore} from "../../stores/screenSizeStore.ts";

  const {isSmall, isTablet} = useScreenStore();
</script>

<template>
  <MainLayout title="Repositories">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <div>
            <p class="text-heading d-flex align-center">
              Repositories
            </p>
            <p class="text-subtitle">Create and manage repositories within your organization!</p>
          </div>
          <VBtnPrimaryFilled v-if="isSmall || isTablet" icon >
            <PhPlus size="20"/>
          </VBtnPrimaryFilled>
          <VBtnPrimaryFilled v-else width="201px" height="45px" rounded="lg" class="satoshi-md">
            <PhPlus size="20" class="mr-2"/>
            Add Repository
          </VBtnPrimaryFilled>
        </VRow>
      </div>
      <VDivider/>
      <div class="pa-6 mt-3">

      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -460px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;

}
</style>
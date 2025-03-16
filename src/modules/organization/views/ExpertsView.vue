<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhPlus} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import ExpertListViewContent from "../components/ExpertListViewContent.vue";
const {isSmall, isTablet} = useScreenStore();
</script>

<template>
  <MainLayout title="Experts">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                Experts
              </p>
              <p class="text-subtitle">Discover and connect with experts from a consortium of agencies and institutions engaged in research and development in agriculture, aquatic resources, and natural resources across Northern Mindanao. </p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0">
            <VRow class="ma-0 justify-end">
              <VBtnPrimaryFilled :to="{name: 'new-expert'}" v-if="isSmall || isTablet" icon >
                <PhPlus size="16"/>
              </VBtnPrimaryFilled>
              <VBtnPrimaryFilled :to="{name: 'new-expert'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                <PhPlus size="16" class="mr-2"/>
                New Expert
              </VBtnPrimaryFilled>
            </VRow>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <ExpertListViewContent/>
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
  height: 585px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}
</style>
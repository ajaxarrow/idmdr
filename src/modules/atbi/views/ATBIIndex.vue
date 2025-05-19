<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import ATBIListViewContent from "../components/ATBIListViewContent.vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {PhPlus} from "@phosphor-icons/vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import ATBIDataTable from "../components/ATBIDataTable.vue";

const {userData, user} = useUserStore()
const {isSmall, isTablet} = useScreenStore();
</script>

<template>
  <MainLayout title="ATBI">
    <ATBIDataTable v-if="user && userData.is_approved"/>
    <div v-else style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                ATBI
              </p>
              <p class="text-subtitle">  ATBI means Agri-Aqua Technology Business Incubation (ATBI). It is a program gears to support more incubatees in the Agri-Aqua sector. </p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0">
            <VRow class="ma-0 justify-end">
              <VBtnPrimaryFilled :to="{name: 'new-atbi'}" v-if="isSmall || isTablet" icon >
                <PhPlus size="16"/>
              </VBtnPrimaryFilled>
              <VBtnPrimaryFilled :to="{name: 'new-atbi'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                <PhPlus size="16" class="mr-2"/>
                New ATBI
              </VBtnPrimaryFilled>
            </VRow>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <ATBIListViewContent/>
    </div>
  </MainLayout>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -475px;
  width: 590px;
  height: 585px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}
</style>
<script setup lang="ts">
import "progress-tracker/src/styles/progress-tracker.scss";
import SettingsLayout from "../../../core/layouts/SettingsLayout.vue";
import AddMembersDialog from "../components/Settings/Organization/AddMembersDialog.vue";
import {AccessLevel} from "../../../interfaces/enums/accesslevels.enum.ts";
import {useMemberStore} from "../stores/member.store.ts";


const {members} = useMemberStore();


</script>

<template>
  <SettingsLayout activeTab="organization">
    <div class="px-6 py-2">
      <div class="mt-2 mb-5">
        <p class="section-title">Update Organization Information</p>
        <p class="text-gs20 my-2">Modify your organization details and information</p>
        <VBtnPrimaryFilled :to="{ name: 'new-organization'}" width="235px" height="37px" rounded="lg" class="satoshi-md">
          Update Organization Info
        </VBtnPrimaryFilled>
      </div>
      <VRow class="ma-0 mb-2" justify="space-between" align="center">
        <p class="section-title">Manage Access</p>
        <AddMembersDialog/>
      </VRow>
      <VDivider/>
      <VRow class="ma-0" align="center">
        <VCol cols="6" class="pa-0">
          <VCheckbox
              color="bs50"
            hide-details
          >
            <template v-slot:label>
              <p class="font-weight-bold radio-label">Select All</p>
            </template>
          </VCheckbox>
        </VCol>
        <VCol cols="6" class="pa-0">
          <p class="font-weight-bold">Access Levels</p>
        </VCol>
      </VRow>
      <VDivider/>

      <VRow class="ma-0 my-2" align="center">
        <VCol cols="6" class="pa-0">
        </VCol>
        <VCol cols="6" class="pa-0">
          <VRow class="ma-0" justify="space-between">
            <p>Read Only</p>
            <p>Moderate Access</p>
            <p>Full Control</p>
          </VRow>
        </VCol>
      </VRow>
      <VRow class="ma-0 my-2" align="center" v-for="member in members">
        <VCol cols="6" class="pa-0">
          <VCheckbox
              color="bs50"
              hide-details
          >
            <template v-slot:label>
              <div class="d-flex align-center">
                <VAvatar
                    size="45"
                    class="mr-1 cursor-pointer"
                >
                  <VImg :src="member.avatar"></VImg>
                </VAvatar>
                <div class="mr-2">
                  <p class="text-name text-container">{{member.name}}</p>
                  <p class="text-name-subtitle">{{member.email}}</p>
                </div>
              </div>
            </template>
          </VCheckbox>
        </VCol>
        <VCol cols="6" class="pa-0">
          <ul class="progress-tracker ma-0 mx-4">
            <li class="progress-step" :class="{ 'is-complete': member.access === AccessLevel.readonly || member.access === AccessLevel.moderate || member.access === AccessLevel.full }">
              <div class="progress-marker"></div>
            </li>
            <li class="progress-step" :class="{ 'is-complete': member.access === AccessLevel.full|| member.access === AccessLevel.moderate }">
              <div class="progress-marker"></div>
            </li>
            <li class="progress-step" :class="{ 'is-complete': member.access === AccessLevel.full }">
              <div class="progress-marker"></div>
            </li>
          </ul>
        </VCol>
      </VRow>
    </div>
  </SettingsLayout>
</template>

<style scoped>

  .section-title{
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.5px;
  }

  :deep .v-label{
    opacity: 100% !important;
  }

  .text-name{
    font-size: 16px !important;
    font-weight: 800 !important;
  }

  .text-name-subtitle{
    font-size: 12px !important;
    font-weight: 400 !important;
    line-height: 0.25;
  }

  .progress-step .progress-marker::after {
    z-index: 1 !important;
  }
</style>
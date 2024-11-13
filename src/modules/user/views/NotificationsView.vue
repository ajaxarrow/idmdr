<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhChecks, PhEye} from "@phosphor-icons/vue";


const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const times = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(times)) {
    const elapsed = Math.floor(differenceInSeconds / secondsInUnit);
    if (elapsed > 0) {
      return `${elapsed} ${unit}${elapsed > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just Now';
};
</script>

<template>
  <MainLayout title="Notifications">
    <div style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
          <p class="text-heading d-flex align-center">
            Notifications
          </p>
          <p class="text-subtitle">
            Keep track of important updates and activity within your repositories and organization.
          </p>
        </div>
      </div>
      <VDivider/>
      <div class="pa-6">
        <div>
          <p class="text-date-heading">November 13, 2024</p>
          <div class="my-5">
            <div class="mb-2 comment-container">
              <VImg
                  class="avatar-area"
                  style="border-radius: 50%"
                  cover
                  height="40px"
                  width="40px"
                  :src="'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
              />
              <div class="ml-2 owner-area">
                <div style="line-height: 20px">
                  <p class="topic-subtitle mr-3"><strong>Access Request Pending</strong>: Please review and manage the request.[Name] has requested access to [repo-name]. Please review and manage the request.</p>
                  <p class="text-gs60" style="font-size: 14px">{{getRelativeTime('2024-11-13T13:24:54.823288Z')}} · Repository</p>
                </div>
              </div>
              <VRow class="ma-0 py-2 content-area">
                <VBtnPrimaryAlt
                    variant="outlined"
                    class="button-outline"
                >
                  Decline
                </VBtnPrimaryAlt>
                <VBtnPrimaryAlt
                    class="submit-button"
                >
                  Approve
                </VBtnPrimaryAlt>
              </VRow>
              <div class="ml-2">
                <div class="d-flex align-center justify-space-between ga-2 notif-action-container pa-2">
                  <VTooltip location="bottom" >
                    <template v-slot:activator="{ props }">
                      <PhEye v-bind="props" class="cursor-pointer" />
                    </template>
                    <span>Go to Actual Content</span>
                  </VTooltip>
                  <VTooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <PhChecks v-bind="props" class="cursor-pointer"/>
                    </template>
                    <span>Mark as Read</span>
                  </VTooltip>
                </div>
              </div>
            </div>
            <VDivider class="mt-3"/>
          </div>
        </div>
        <div>
          <p class="text-date-heading">November 13, 2024</p>
          <div class="my-5">
            <div class="mb-2 comment-container">
              <VImg
                  class="avatar-area"
                  style="border-radius: 50%"
                  cover
                  height="40px"
                  width="40px"
                  :src="'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
              />
              <div class="ml-2 owner-area">
                <div style="line-height: 20px">
                  <p class="topic-subtitle mr-3"><strong>Access Request Pending</strong>: Please review and manage the request.[Name] has requested access to [repo-name]. Please review and manage the request.</p>
                  <p class="text-gs60" style="font-size: 14px">{{getRelativeTime('2024-11-13T13:24:54.823288Z')}} · Repository</p>
                </div>
              </div>
              <VRow class="ma-0 py-2 content-area">
                <VBtnPrimaryAlt
                    variant="outlined"
                    class="button-outline"
                >
                  Decline
                </VBtnPrimaryAlt>
                <VBtnPrimaryAlt
                    class="submit-button"
                >
                  Approve
                </VBtnPrimaryAlt>
              </VRow>
              <div class="ml-2">
                <div class="d-flex align-center justify-space-between ga-2 notif-action-container pa-2">
                  <VTooltip location="bottom" >
                    <template v-slot:activator="{ props }">
                      <PhEye v-bind="props" class="cursor-pointer" />
                    </template>
                    <span>Go to Actual Content</span>
                  </VTooltip>
                  <VTooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <PhChecks v-bind="props" class="cursor-pointer"/>
                    </template>
                    <span>Mark as Read</span>
                  </VTooltip>
                </div>
              </div>
            </div>
            <VDivider class="mt-3"/>
          </div>
        </div>
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

.text-date-heading{
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 20px;
}


.comment-container{
  display: grid;
  grid-template-areas:
  "avatar owner action"
  "avatar content action";
  grid-template-columns: min-content 1fr min-content;
}

.avatar-area{
  grid-area: avatar;
}

.content-area{
  grid-area: content;
}

.owner-area{
  grid-area: owner;
}


.topic-subtitle{
  font-size: 16px;
}

.notif-action-container{
  border-radius: 8px;
  border: 1px solid #e4e4e4;
}

.button-outline, .submit-button{
  height: 35px !important;
  padding: 0 15px !important;
  font-size: 14px !important;
}

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 2px;
  border-radius: 8px;
}

.submit-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 8px;
}

</style>
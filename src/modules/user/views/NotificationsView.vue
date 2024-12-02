<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhChecks, PhEye} from "@phosphor-icons/vue";
import {useNotificationsServices} from "../services/notifications.services.ts";
import {GroupedNotification, Notification} from "../../../interfaces/notification.interface.ts";
import {computed, onMounted, ref} from "vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";

const {fetchNotificationsByReceiver, updateNotification} = useNotificationsServices()
const {showSnackbarMessage} = useSnackbarStore()
const {router} = useRouting();
const notifications = ref<Notification[]>([]);
const groupedNotifications = computed(() => {
  return notifications.value.reduce<GroupedNotification[]>(
      (acc, notif) => {
        //@ts-ignore
        const date = <string>notif.created_at?.split("T")[0]; // Extract the date part
        const existingGroup = acc.find(group => group.date === date);

        if (existingGroup) {
          existingGroup.notifications.push(notif);
        } else {
          acc.push({ date: date, notifications: [notif] });
        }

        return acc;
      },
      []
  )
});

const readNotification = async(notification: Notification) => {
  await updateNotification({is_read: true}, notification?.pk!);
  notifications.value = await fetchNotificationsByReceiver();
  showSnackbarMessage("Notification marked as read", Status.success);
}

const goToDetails = async(notification: Notification) => {
  if(notification.type == 'Repository' || notification.type == 'Access Request'){
    await router.push({name: "repository-data", params: {slug: notification.object_id}});
  } else if (notification.type == 'Organization'){
    await router.push({name: "organization-data", params: {slug: notification.object_id}});
  } else if (notification.type == 'Access Request Pending'){
    await router.push({name: "repository-settings", params: {slug: notification.object_id}});
  }
}

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

const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};



onMounted(async () => {
  notifications.value = await fetchNotificationsByReceiver()
})
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
        <div v-for="groupNotif in groupedNotifications">
          <p class="text-date-heading">{{formatDate(groupNotif.date)}}</p>
          <div v-for="notif in groupNotif.notifications" class="my-5">
            <div class="mb-2 comment-container">
              <VImg
                  class="avatar-area"
                  style="border-radius: 50%"
                  cover
                  height="40px"
                  width="40px"
                  :src="'https://cdn-icons-png.flaticon.com/512/10686/10686420.png'"
              />
              <div class="ml-2 owner-area">
                <div style="line-height: 20px">
                  <p class="topic-subtitle mr-3">
                    <strong>{{notif.title}}</strong>:
                    {{notif.message}}</p>
                  <p class="text-gs60" style="font-size: 14px">{{getRelativeTime(notif.created_at)}} · {{notif.type}}</p>
                </div>
              </div>
              <VRow class="ma-0 py-2 content-area">
                <VBtnPrimaryAlt
                    @click="readNotification(notif)"
                    v-if="!notif.is_read"
                    variant="outlined"
                    class="button-outline"
                >
                  Mark as Read
                </VBtnPrimaryAlt>
                <VBtnPrimaryAlt
                    @click="goToDetails(notif)"
                    class="submit-button"
                >
                  View Actual Content
                </VBtnPrimaryAlt>
              </VRow>
<!--              <div class="ml-2">-->
<!--                <div class="d-flex align-center justify-space-between ga-2 notif-action-container pa-2">-->
<!--                  <VTooltip location="bottom" >-->
<!--                    <template v-slot:activator="{ props }">-->
<!--                      <PhEye v-bind="props" class="cursor-pointer" />-->
<!--                    </template>-->
<!--                    <span>Go to Actual Content</span>-->
<!--                  </VTooltip>-->
<!--                  <VTooltip location="bottom">-->
<!--                    <template v-slot:activator="{ props }">-->
<!--                      <PhChecks v-bind="props" class="cursor-pointer"/>-->
<!--                    </template>-->
<!--                    <span>Mark as Read</span>-->
<!--                  </VTooltip>-->
<!--                </div>-->
<!--              </div>-->
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
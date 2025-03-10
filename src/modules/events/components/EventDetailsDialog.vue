<script setup lang="ts">
import {onMounted, PropType, ref, watch} from "vue";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {OrganizationEvent} from "../../../interfaces/organization.interface.ts";
import {PhDotsThreeOutlineVertical, PhPencil, PhTrash} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import EventFormDialog from "./EventFormDialog.vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useEventsServices} from "../services/events.services.ts";

const {showSnackbarMessage} = useSnackbarStore();
const emits = defineEmits(['callback', 'fetchCallback']);
const {fetchEventByID, deleteEvent} = useEventsServices()
const props = defineProps({
  event: {
    type: Object as PropType<OrganizationEvent>,
    required: true
  },
  useOutsideDialogModel: {
    type: Boolean,
    default: false
  },
  value: {
    type: Boolean,
    default: false
  },
})
const eventActionMenu = ref(false);
const eventDetailsDialog = ref(props.useOutsideDialogModel ? props.value : false);
const loading = ref(false);
const forViewing = ref(true);


const event = ref<OrganizationEvent>(props.event!)

const updateEventCallback = async () => {
  forViewing.value = false;
  showSnackbarMessage('Event Updated Successfully', Status.success)
  event.value = (await fetchEventByID(props.event!.uid!))!;
}


const deleteEventCallback = async (id: string) => {
  await deleteEvent(id);
  showSnackbarMessage('Event Updated Successfully', Status.success)
  event.value = (await fetchEventByID(props.event!.uid!))!;
  showSnackbarMessage('Event Deleted Successfully', Status.success)
  eventDetailsDialog.value = false
}

const fetchEvent = () => {
  loading.value = true
  event.value = props.event!
  loading.value = false
}


const formatDate = (dateObj: { date: string, time: string }) => {
  if (!dateObj || !dateObj.date) return 'N/A';

  try {
    const fullDateString = `${dateObj.date}T${dateObj.time}:00`;
    const date = new Date(fullDateString);
    return date.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  } catch {
    return 'Invalid Date';
  }
}

// Helper function to format duration
const calculateDuration = (
    startDateObj: { date: string, time: string },
    endDateObj: { date: string, time: string }
) => {
  if (!startDateObj || !endDateObj) return 'N/A';

  try {
    const startDateString = `${startDateObj.date}T${startDateObj.time}:00`;
    const endDateString = `${endDateObj.date}T${endDateObj.time}:00`;

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours} hours ${diffMinutes} minutes`;
  } catch {
    return 'Invalid Duration';
  }
}
const closeDialog = () => {
  eventDetailsDialog.value = false
  emits('callback')
  if(!forViewing.value){
    emits('fetchCallback')
  }
}
watch(() => eventDetailsDialog.value, async() => {
  if(eventDetailsDialog.value) {
    fetchEvent()
  }
})

watch(() => props.value, async() => {
  if(props.value) {
    eventDetailsDialog.value = true
  }
})

onMounted(() => {
  fetchEvent()
})

</script>

<template>
  <div @click="eventDetailsDialog = true" >
    <slot></slot>
  </div>
  <VDialog v-model="eventDetailsDialog" class="center" :persistent="true">
    <div style="overflow: hidden; border-radius: 15px;" >
      <VSheet class="sector-tagging-dialog-container scrollable-sidebar-container" @click.stop>
        <p class="dialog-title pa-5">Event Details</p>
        <VDivider/>

        <div v-if="loading" class="loading-state-container" style="height: 70vh;">
          <VProgressCircular
              indeterminate
              color="#23668b"
          ></VProgressCircular>
        </div>

        <div v-else class="pa-5">
          <div class="px-6 mb-5">
            <VRow class="ma-0 mt-2 mb-4" justify="space-between" align="center">
              <div>
                <div style="line-height: 20px">
                  <p class="topic-subtitle">{{ event.title }}</p>
                </div>
              </div>

              <VMenu v-model="eventActionMenu" :close-on-content-click="false" :persistent="true">
                <template #activator="{ props }">
                  <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                    Options
                    <PhDotsThreeOutlineVertical weight="fill"/>
                  </p>
                </template>

                <VSheet width="200" class="rounded-b-lg py-2" @click.stop>
                  <div>
                    <EventFormDialog
                        :form-type="FormType.edit"
                        @callback="updateEventCallback"
                        :event="event"
                    >
                      <div class="cursor-pointer action-menu-item text-decoration-none text-black">
                        <PhPencil/>
                        Edit
                      </div>

                    </EventFormDialog>

                    <DeleteDialog :event-id="event.uid" @callback="deleteEventCallback">
                      <p class="cursor-pointer action-menu-item">
                        <PhTrash/>
                        Delete
                      </p>
                    </DeleteDialog>
                  </div>
                </VSheet>
              </VMenu>
            </VRow>

            <p class="text-about-heading py-3">Event Information</p>
            <VRow class="ma-0">
              <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
                <p class="text-subtitle text-gs20">Start Date</p>
                <p class="text-subtitle">{{ formatDate(event.start_date_object) }}</p>
              </VCol>
              <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
                <p class="text-subtitle text-gs20">End Date</p>
                <p class="text-subtitle">{{ formatDate(event.end_date_object) }}</p>
              </VCol>
              <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
                <p class="text-subtitle text-gs20">Duration</p>
                <p class="text-subtitle">{{ calculateDuration(event.start_date_object, event.end_date_object) }}</p>
              </VCol>
              <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
                <p class="text-subtitle text-gs20">Associated CMI</p>
                <p class="text-subtitle">{{ event.organizationData?.name || 'Not specified' }} ({{ event.organizationData?.acronym || 'Not specified' }})</p>
              </VCol>
              <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
                <p class="text-subtitle text-gs20">Associated Project</p>
                <p class="text-subtitle">{{ event.repositoryData?.title || 'Not specified' }}</p>
              </VCol>
            </VRow>
          </div>

          <div v-if="event.description && event.description.trim().length !== 0">
            <VDivider/>
            <div class="px-6 mb-10">
              <p class="text-about-heading py-3">Event Description</p>
              <VRow class="ma-0">
                <div class="ql-snow">
                  <div class="ql-editor" v-html="event.description"></div>
                </div>
              </VRow>
            </div>
          </div>
        </div>

        <VDivider/>
        <VRow class="ma-0 pa-4" justify="end">
          <VBtnPrimaryAlt
              @click="closeDialog()"
              class="button-outline"
          >
            Close
          </VBtnPrimaryAlt>
        </VRow>
      </VSheet>
    </div>
  </VDialog>
</template>

<style scoped>
li{
  margin: 10px
}

.info:hover{
  text-decoration: underline;
}

.sector-tagging-dialog-container{
  width: 663px;
  height: 85vh;
  border-radius: 15px !important;
}

.dialog-title{
  font-size: 20px;
  font-weight: 700;
}

.dialog-label{
  font-size: 16px;
  font-weight: 600;
  color: black;
}


:deep(.v-label){
  opacity: 100% !important;
}

:deep(.v-icon){
  --v-icon-size-multiplier: 1.23
}

:deep(.v-field__outline){
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep(input::placeholder){
  color: #5F6061;
  opacity: 90%;
}

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 10px;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}
.topic-subtitle {
  font-size: 16px;
  font-weight: 700;
}

.action-button {
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover {
  background-color: #F0F5F9;
}

.action-menu-item {
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.text-about-heading {
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
  align-items: center;
}

.action-menu-item:hover {
  background-color: #e0e3e3;
}
</style>
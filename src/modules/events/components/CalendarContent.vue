<script setup lang="ts">
import EventDetailsDialog from "../components/EventDetailsDialog.vue";
import {PhEye, PhPencil, PhTrash} from "@phosphor-icons/vue";
import {computed, onMounted, ref, onUnmounted} from "vue";
import EventFormDialog from "../components/EventFormDialog.vue";
import {useEventsServices} from "../services/events.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {OrganizationEvent} from "../../../interfaces/organization.interface.ts";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {EventInput} from '@fullcalendar/core';
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";

const props = defineProps({
  forOrganization: {
    type: Boolean,
    default: false
  },
})

const {route} = useRouting();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchEvents, deleteEvent, fetchEventsByOrganization} = useEventsServices()
const events = ref<OrganizationEvent[]>([]);
const pageLoading = ref(false)

const selectedEvent = ref<OrganizationEvent | null>(null);
const selectedEventInfo = ref<OrganizationEvent | null>(null);
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  event: null
});

// Method to close context menu
const closeContextMenu = () => {
  contextMenu.value.show = false;
  selectedEvent.value = null;
};

const handleGlobalClick = (event: MouseEvent) => {
  const contextMenuEl = document.querySelector('.v-sheet');
  if (contextMenuEl && !contextMenuEl.contains(event.target as Node)) {
    closeContextMenu();
  }
};

const processEvents = (rawEvents: OrganizationEvent[]): EventInput[] => {
  return rawEvents.map(event => {
    let startDate, endDate;

    try {
      const startDateObj = typeof event.start_date === 'string'
          ? JSON.parse(event.start_date)
          : event.start_date_object;

      const endDateObj = typeof event.end_date === 'string'
          ? JSON.parse(event.end_date)
          : event.end_date_object;

      startDate = `${startDateObj.date}T${startDateObj.time}:00`;
      endDate = `${endDateObj.date}T${endDateObj.time}:00`;
    } catch (error) {
      startDate = event.start_date;
      endDate = event.end_date;
    }

    return {
      id: event.uid,
      title: event.title,
      start: startDate,
      end: endDate,
      allDay: false
    };
  });
};

const processedEvents = computed(() => processEvents(events.value));

const handleEventRightClick = (mouseEvent: MouseEvent, event: EventInput) => {
  mouseEvent.preventDefault();

  // Find the full event details
  const fullEvent = events.value.find(e => e.uid === event.id);

  if (!fullEvent) return;

  // Set the selected event
  selectedEvent.value = fullEvent;
  //@ts-ignore
  contextMenu.value = {
    show: true,
    x: mouseEvent.pageX,
    y: mouseEvent.pageY,
    //@ts-ignore
    event: event!
  };
};

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: processedEvents.value,
  headerToolbar: {
    right: 'prev,next today',
    center: 'title',
    left: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  eventClick: handleEventClick,
  eventDidMount: (info: any) => {
    info.el.addEventListener("contextmenu", (event: any) => {
      handleEventRightClick(event!, info.event!);
    });
  },
}));


const handleEventClick = (clickInfo: any) => {
  const fullEvent = events.value.find(e => e.uid === clickInfo.event.id);
  if (!fullEvent) return;

  selectedEventInfo.value = fullEvent;
  setTimeout(() => {
    selectedEventInfo.value = fullEvent;
  }, 1000);
};


const viewEventCallback = async () => {
  selectedEventInfo.value = null;
  await fetchEventsData();
}

const updateEventCallback = async () => {
  showSnackbarMessage('Event Updated Successfully', Status.success)
  events.value = await fetchEvents();
  closeContextMenu();
}

const deleteEventCallback = async (id: string) => {
  await deleteEvent(id);
  events.value = await fetchEvents();
  showSnackbarMessage('Event Deleted Successfully', Status.success)
  closeContextMenu();
}

const fetchEventsData = async () => {
  pageLoading.value = true;
  if (props.forOrganization) {
    const orgId = route.params.slug as string;
    if (orgId) {
      events.value = await fetchEventsByOrganization(orgId);
    } else {
      console.warn('Organization ID (slug) is missing');
    }
  } else {
    events.value = await fetchEvents();
  }
  pageLoading.value = false;
};

onMounted(async () => {
  document.addEventListener('click', handleGlobalClick);
  await fetchEventsData();
})


onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
});

</script>

<template>
  <EventDetailsDialog
      :use-outside-dialog-model="true"
      :value="selectedEventInfo !== null"
      :event="selectedEventInfo!"
      @callback="viewEventCallback"
  />
    <div class="pa-6">
      <div v-if="pageLoading" class="loading-state-container">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <div v-else>
        <div>
          <FullCalendar
              :options="calendarOptions"
              ref="calendar"
              @eventContextmenu="handleEventRightClick"
          >
            <template v-slot:eventContent="arg">
              <div class="event-content">
                {{ arg.event.title }}
              </div>
            </template>
          </FullCalendar>
          <VMenu
              :close-on-content-click="false"
              v-model="contextMenu.show"
              absolute
              offset-y
              :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
          >
            <VSheet
                width="200" class="rounded-b-lg py-2"
                @click.stop
            >
              <div>
                <EventDetailsDialog
                    :use-outside-dialog-model="false"
                    :event="selectedEvent!"
                    @callback="viewEventCallback"
                >
                  <p class="cursor-pointer action-menu-item">
                    <PhEye/>
                    View Details
                  </p>
                </EventDetailsDialog>
                <EventFormDialog
                    :form-type="FormType.edit"
                    @callback="updateEventCallback"
                    :event="selectedEvent!"
                >
                  <p class="cursor-pointer action-menu-item">
                    <PhPencil/>
                    Edit
                  </p>
                </EventFormDialog>
                <DeleteDialog
                    @callback="deleteEventCallback(selectedEvent?.uid || '')"
                >
                  <p class="cursor-pointer action-menu-item">
                    <PhTrash/>
                    Delete
                  </p>
                </DeleteDialog>
              </div>
            </VSheet>
          </VMenu>

        </div>
      </div>
    </div>
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

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

.action-menu-item{
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.action-menu-item:hover{
  background-color: #e0e3e3;
}

:deep(.fc-event) {
  cursor: pointer;
}


</style>
<script setup lang="ts">
import {useUserStore} from "../../../core/stores/user.store.ts";
import {computed, onMounted, PropType, reactive, ref, watch} from "vue";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {Organization, OrganizationEvent} from "../../../interfaces/organization.interface.ts";
import {useEventsServices} from "../services/events.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";


const {userData} = useUserStore();
const {addEvent, updateEvent} = useEventsServices();
const {fetchOrganizationByUser, fetchAllOrganizations} = useOrganizationServices();
const {fetchRepositoriesByUser, fetchAllRepositories} = useRepositoryServices()
const emits = defineEmits(['callback']);
const organizations = ref<Organization[]>([])
const repositories = ref<Repository[]>([])
const action = computed(() => props.formType === FormType.edit ? 'Update' : 'Add');
const props = defineProps({
  formType: {
    type: String as PropType<FormType>,
  },
  event: {
    type: Object as PropType<OrganizationEvent>
  }
})

const loading = ref(false);
const eventDialog = ref(false);
const dateTimeError = ref('');
const titleError = ref('');
const eventInitialState = reactive<OrganizationEvent>({
  uid: '',
  title: '',
  description: '',
  created_by: '',
  organization: '',
  repository: '',
  end_date: '',
  start_date: '',
  start_date_object: {
    date: new Date().toISOString().split('T')[0],
    time: '00:00'
  },
  end_date_object: {
    date: new Date().toISOString().split('T')[0],
    time: '23:59'
  },
});

const eventData = reactive<OrganizationEvent>({
  ...eventInitialState
})

// Validate date and time inputs
const validateDateTime = (): boolean => {
  const startDate = new Date(`${eventData.start_date_object.date}T${eventData.start_date_object.time}`);
  const endDate = new Date(`${eventData.end_date_object.date}T${eventData.end_date_object.time}`);

  if (startDate >= endDate) {
    dateTimeError.value = 'Start date and time must be before end date and time';
    return false;
  }

  dateTimeError.value = '';
  return true;
}

// Validate title field
const validateTitle = (): boolean => {
  if (!eventData.title || eventData.title.trim() === '') {
    titleError.value = 'Event title is required';
    return false;
  }

  titleError.value = '';
  return true;
}

// Watch for changes in date/time fields and validate
watch([
  () => eventData.start_date_object.date,
  () => eventData.start_date_object.time,
  () => eventData.end_date_object.date,
  () => eventData.end_date_object.time
], () => {
  validateDateTime();
});

// Watch for changes in title field
watch(() => eventData.title, () => {
  validateTitle();
});

const addEventData = async () => {
  const isDateTimeValid = validateDateTime();
  const isTitleValid = validateTitle();

  if (!isDateTimeValid || !isTitleValid) return;

  eventData.start_date = JSON.stringify(eventData.start_date_object)
  eventData.end_date = JSON.stringify(eventData.end_date_object)
  eventData.created_by = userData.uid;
  await addEvent(eventData);
  clearEventData();
  emits('callback')
  eventDialog.value = false;
}

const updateEventData = async () => {
  const isDateTimeValid = validateDateTime();
  const isTitleValid = validateTitle();

  if (!isDateTimeValid || !isTitleValid) return;

  eventData.start_date = JSON.stringify(eventData.start_date_object)
  eventData.end_date = JSON.stringify(eventData.end_date_object)
  eventData.created_by = userData.uid;
  await updateEvent(eventData);
  clearEventData();
  emits('callback')
  eventDialog.value = false;
}

const clearEventData = () => {
  Object.assign(eventData, {...eventInitialState})
  dateTimeError.value = '';
  titleError.value = '';
}

const fetchData = async () => {
  organizations.value = userData.is_superuser ? await fetchAllOrganizations(1, 1000) :(await fetchOrganizationByUser()).filter(org => !org.is_deleted)
  repositories.value = userData.is_superuser ? await fetchAllRepositories(1, 1000) :(await fetchRepositoriesByUser()).filter(repo => !repo.is_deleted);
  eventData.organization = organizations.value[0].uid;
  eventData.repository = repositories.value[0].uid;
  if(props.formType === FormType.edit) {
    if(props.event){
      Object.assign(eventData, {...props.event})
    }
  }
}

watch(() => eventDialog.value, async() => {
  if(eventDialog.value) {
    loading.value = true;
    await fetchData();
    loading.value = false;
  }
})

onMounted(async()=> {
  await fetchData();
})
</script>

<template>
  <div @click="eventDialog = true">
    <slot></slot>
  </div>
  <VDialog v-model="eventDialog" class="center" :persistent="true">
    <div style="overflow: hidden; border-radius: 15px;" >
      <VSheet class="sector-tagging-dialog-container scrollable-sidebar-container" @click.stop>
        <p class="dialog-title pa-5">{{action}} Event Schedule</p>
        <VDivider/>
        <div v-if="loading" class="loading-state-container" style="height: 70vh;">
          <VProgressCircular
              indeterminate
              color="#23668b"
          ></VProgressCircular>
        </div>
        <div v-else class="px-5 py-2">

          <VRow class="ma-0">
            <VCol class="pa-0 pr-2" cols="6">
              <p class="dialog-label mb-2">Start Date</p>
              <VTextField
                  v-model="eventData.start_date_object.date"
                  type="date"
                  label="Start Date"
                  required
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :error="!!dateTimeError"
              />
            </VCol>
            <VCol class="pa-0" cols="6">
              <p class="dialog-label mb-2">Start Time</p>
              <VTextField
                  v-model="eventData.start_date_object.time"
                  type="time"
                  label="Start Time"
                  required
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :error="!!dateTimeError"
              />
            </VCol>
          </VRow>
          <VRow class="ma-0">
            <VCol class="pa-0 pr-2" cols="6">
              <p class="dialog-label mb-2">End Date</p>
              <VTextField
                  v-model="eventData.end_date_object.date"
                  type="date"
                  label="End Date"
                  required
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :error="!!dateTimeError"
              />
            </VCol>
            <VCol class="pa-0" cols="6">
              <p class="dialog-label mb-2">End Time</p>
              <VTextField
                  v-model="eventData.end_date_object.time"
                  type="time"
                  label="End Time"
                  required
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :error="!!dateTimeError"
              />
            </VCol>
          </VRow>
          <!-- Error message display -->
          <div v-if="dateTimeError" class="error-message mb-2">
            {{ dateTimeError }}
          </div>
          <div class="mb-2">
            <p class="dialog-label mb-2">Event Title<span class="text-pink">*</span></p>
            <VTextField
                autofocus
                v-model="eventData.title"
                placeholder="Enter Event Title"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                required
                :error="!!titleError"
            />
            <div v-if="titleError" class="error-message">
              {{ titleError }}
            </div>
          </div>
          <div class="mb-2">
            <label class="dialog-label">Associated Consortium Member Institution<span class="text-pink">*</span></label>
            <VAutocomplete
                v-model="eventData.organization"
                placeholder="Select Organization"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="organizations"
                :item-value="organization => `${organization.uid}`"
                :item-title="organization => `${organization.name} (${organization.acronym})`"
            >
              <template v-slot:item="{ props, item }">
                <VListItem
                    @click.stop
                    v-bind="props"
                    :prepend-avatar="item.raw.image"
                    :subtitle="item.raw.email"
                    :title="`${item.raw.name} (${item.raw.acronym})`"
                ></VListItem>
              </template>
            </VAutocomplete>
          </div>
          <div class="mb-3">
            <label class="dialog-label">Associated Project<span class="text-pink">*</span></label>
            <VAutocomplete
                v-model="eventData.repository"
                placeholder="Select Repository"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="repositories"
                :item-value="repository => `${repository.uid}`"
                :item-title="repository => `${repository.title}`"
            >
              <template v-slot:item="{ props, item }">
                <VListItem
                    @click.stop
                    v-bind="props"
                    :prepend-avatar="item.raw.image as string"
                    :subtitle="item.raw.owner_data?.username!"
                    :title="`${item.raw.title}`"
                ></VListItem>
              </template>
            </VAutocomplete>
          </div>
          <div class="mb-5">
            <label class="dialog-label mb-2">Event Description</label>
            <QuillRichTextEditor
                :modelValue="eventData.description"
                placeholder="Enter event description here"
                @update:modelValue="$event => (eventData.description= $event)"
            />
          </div>

        </div>
        <VDivider/>

        <VRow class="ma-0 pa-4" justify="end">
          <VBtnPrimaryAlt
              @click="eventDialog = false"
              width="86"
              variant="outlined"
              class="button-outline"
          >
            Close
          </VBtnPrimaryAlt>
          <VBtnPrimaryAlt
              @click="props.formType === FormType.edit ? updateEventData() : addEventData()"
              width="86"
              class="submit-button"
              :disabled="!!dateTimeError || !!titleError"
          >
            {{action}}
          </VBtnPrimaryAlt>
        </VRow>
      </VSheet>
    </div>
  </VDialog>
</template>

<style scoped>
:deep(.ql-toolbar){
  margin-top: 8px;
  border: 1.75px solid rgba(140, 140, 140, 0.2) !important;
  border-radius: 10px 10px 0 0 !important;
}

:deep(.ql-editor.ql-blank::before){
  content: none;
}
:deep(.ql-editor.ql-blank::after){
  color: #5F6061;
  opacity: 90%;
  content: attr(data-placeholder);
  font-style: normal;
  pointer-events: none;
  display: block;
  margin-top: -1.42rem;
}

.sector-tagging-dialog-container{
  height: 90vh;
  width: 663px;
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

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 3px;
  border-radius: 8px;
}

.submit-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 8px;
}

.error-message {
  color: #ff5252;
  font-size: 14px;
  margin-top: -5px;
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

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}

</style>
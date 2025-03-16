<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhPlus} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import { ref} from "vue";
import EventFormDialog from "../components/EventFormDialog.vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import CalendarContent from "../components/CalendarContent.vue";

const {showSnackbarMessage} = useSnackbarStore();
const {isSmall, isTablet} = useScreenStore();
const calendarKey = ref(0);

const addEventCallback = async () => {
  showSnackbarMessage('Event Added Successfully', Status.success);
  calendarKey.value += 1;
};

</script>

<template>
  <MainLayout title="Calendar">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                Calendar
              </p>
              <p class="text-subtitle">Browse the saved and scheduled events by your organizations related to your projects</p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0">
            <VRow class="ma-0 justify-end">
              <EventFormDialog :form-type="FormType.create" @callback="addEventCallback">
                <VBtnPrimaryFilled v-if="isSmall || isTablet" icon >
                  <PhPlus size="16"/>
                </VBtnPrimaryFilled>
                <VBtnPrimaryFilled  v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                  <PhPlus size="16" class="mr-2"/>
                  New Event
                </VBtnPrimaryFilled>
              </EventFormDialog>
            </VRow>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
      <CalendarContent :key="calendarKey" :for-organization="false"/>
    </div>
  </MainLayout>
</template>


<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -480px;
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
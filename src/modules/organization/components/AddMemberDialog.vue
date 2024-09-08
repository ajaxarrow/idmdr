<script setup lang="ts">
import {ref} from "vue";
import {membersData} from "../../../data/members.ts";
import AccessLeveLInfoDialog from "./AccessLeveLInfoDialog.vue";


const addMembersDialog = ref(false);
const selectedMember = ref<string | null>(null);
const selectedAccessLevel = ref(null);

const accessLevels = ['Admin', 'Moderator', 'Team Member', 'Viewer']
</script>

<template>
  <VBtnPrimaryFilled  @click="addMembersDialog = true"  height="41px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
    Add Member
  </VBtnPrimaryFilled>
  <VDialog v-model="addMembersDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Add Members</p>
      <VDivider/>
      <div class="px-5 py-5">
        <div>
          <p class="dialog-label mb-2">Member</p>
          <VAutocomplete
              placeholder="Choose Member"
              :item-value="member => `${member.email}`"
              v-model="selectedMember"
              :items="membersData"
              :item-title="member => `${member.name}`"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div>
          <p class="dialog-label mb-2 d-flex justify-space-between">Access Control <AccessLeveLInfoDialog/></p>
          <VAutocomplete
              v-model="selectedAccessLevel"
              placeholder="Choose Appropriate Access Level"
              :items="accessLevels"
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
      </div>
      <VDivider/>

      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="addMembersDialog = false"
            width="86"
            variant="outlined"
            class="button-outline"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            width="86"
            class="button-outline"
        >
          Save
        </VBtnPrimaryAlt>
      </VRow>
    </VSheet>
  </VDialog>
</template>

<style scoped>

.sector-tagging-dialog-container{
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
  border-width: 3px;
  border-radius: 10px;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}

</style>
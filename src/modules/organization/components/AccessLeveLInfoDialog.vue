<script setup lang="ts">
import {ref} from "vue";

const accessLevelInfoDialog = ref(false);
</script>
()
<template>
  <span @click="accessLevelInfoDialog = true" class="text-bs50 cursor-pointer info">
    Know more about access level here
  </span>
  <VDialog v-model="accessLevelInfoDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Access Levels Information</p>
      <VDivider/>
      <div class="pa-5">
        <p>Below are the access levels that can be assigned to members of your organization:</p>
        <ul class="py-3">
          <li>
            <strong>Owner:</strong> The Owner holds the highest access level within the organization. They have full control over all aspects, including the ability to delete and edit content, manage users, and make high-level decisions such as deleting the entire organization. This role is exclusive to the creator of the organization.
          </li>
          <li>
            <strong>Admin:</strong> The Admin holds a high level of access, second only to the Owner. While they can delete and edit content, manage users, and perform most administrative functions, they do not have the authority to delete the organization.
          </li>

          <li>
            <strong>Manager:</strong> Moderators can update organization details and manage users by adding or removing them, but they cannot delete the organization or modify access levels.
          </li>
          <li>
            <strong>Member:</strong> Members can add new users but can only assign them the "Viewer" role. They can also create repositories but do not have the ability to edit organization content.
          </li>
          <li>
            <strong>Viewer:</strong> The Viewer role is the lowest level of access. Viewers can see the list of organization members and download content, but they cannot make any changes.
          </li>
        </ul>
      </div>

      <VDivider/>
      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="accessLevelInfoDialog = false"
            class="button-outline"
        >
          Understood!
        </VBtnPrimaryAlt>
      </VRow>
    </VSheet>
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
</style>
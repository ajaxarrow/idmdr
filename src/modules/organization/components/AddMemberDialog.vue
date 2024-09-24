<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import AccessLeveLInfoDialog from "./AccessLeveLInfoDialog.vue";
import {OrgMember, User} from "../../../interfaces/member.interface.ts";
import {useOrganizationMembersServices} from "../services/organization-members.services.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";

const {fetchUsers, fetchOrgMembers} = useOrganizationMembersServices();
const {route} = useRouting();
const users = ref<User[]>([]);
const orgMembers = ref<OrgMember[]>([]);
const addMembersDialog = ref(false);
const selectedMember = ref<User | null>(null);
const selectedAccessLevel = ref<string | null>(null);
const accessLevels = ['admin', 'moderator', 'member', 'viewer']

watch(() => selectedAccessLevel.value, () => {
  console.log(selectedAccessLevel.value)
})

const checkIfMember = (uid: string): OrgMember => {
  return <OrgMember>orgMembers.value.find(member => member.user.uid === uid);
}

onMounted(async () => {
  orgMembers.value = await fetchOrgMembers(<string>route.params.slug);
  users.value = await fetchUsers();
  console.log(users.value)
})

</script>

<template>
  <div @click="addMembersDialog = true">
    <slot></slot>
  </div>

  <VDialog v-model="addMembersDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Add Members</p>
      <VDivider/>
      <div class="pa-5">
        <div>
          <p class="dialog-label mb-2">Member</p>
          <VAutocomplete
              placeholder="Choose Member"
              :item-value="user => user"
              v-model="selectedMember"
              :items="users"
              :item-title="user => `${user.username}`"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          >
            <template v-slot:item="{ props, item }">
              <VListItem
                  :disabled="!!checkIfMember(item.raw.uid as string)"
                  v-bind="props"
                  :prepend-avatar="item.raw.profile_picture"
                  :subtitle="checkIfMember(item.raw.uid) ? checkIfMember(item.raw.uid).access_level : item.raw.email"
                  :title="item.raw.username"
              ></VListItem>
            </template>
          </VAutocomplete>
        </div>
        <div>
          <p class="dialog-label mb-2 d-flex justify-space-between">
            Access Control
            <span style="font-size: 14px; font-weight: 400;">
              <AccessLeveLInfoDialog/>
            </span>
          </p>
          <VAutocomplete
              v-model="selectedAccessLevel"
              placeholder="Choose Appropriate Access Level"
              :item-value="accessLevel => `${accessLevel}`"
              :items="accessLevels"
              :item-title="accessLevel => `${accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}`"
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
            class="button-outline action-button"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            width="86"
            class="action-button"
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
  border-width: 3px;
}
.action-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 10px;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}

</style>
<script setup lang="ts">
import {computed, onMounted, onUpdated, reactive, ref, PropType} from "vue";
import AccessLeveLInfoDialog from "./AccessLeveLInfoDialog.vue";
import {OrgMember, User} from "../../../interfaces/member.interface.ts";
import {useOrganizationMembersServices} from "../services/organization-members.services.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";

const emits = defineEmits(['callback'])
const props = defineProps({
  formType: {
    type: String as PropType<FormType>,
  },
  member: {
    type: Object as PropType<OrgMember>,
  },
  userAccessLevel: {
    type: String,
    default: ''
  }
})
const {fetchUsers, fetchOrgMembers, addOrgMember, updateOrgMember} = useOrganizationMembersServices();
const {route} = useRouting();
const users = ref<User[]>([]);
const orgMembers = ref<OrgMember[]>([]);
const addMembersDialog = ref(false);
const selectedMember = ref<User | null>(null);
const selectedAccessLevel = ref<string | null>(null);
const accessLevels = computed(() => {
  if (props.userAccessLevel === 'manager') {
    return ['manager', 'member', 'viewer'];
  } else {
    return ['admin', 'manager', 'member', 'viewer'];
  }
});

const errorMessageInitialState = reactive({
  name: "",
  access_level: "",
});
const loading = ref(false);
const errorMessage = reactive({ ...errorMessageInitialState });

// Utility functions
const clearErrorMessage = () => {
  Object.assign(errorMessage, { ...errorMessageInitialState });
};

const addMember = async () => {
  clearErrorMessage()
  if (!selectedMember.value) {
    errorMessage.name = "Please select a member";
    return;
  }

  if (!selectedAccessLevel.value) {
    errorMessage.access_level = "Please select an access level";
    return;
  }

  try{
    //@ts-ignore
    const newMember: OrgMember = {
      user: selectedMember?.value,
      access_level: selectedAccessLevel.value,
      membership_uid: '',
      is_deleted: false
    }
    loading.value = true;
    await addOrgMember(<string>route.params.slug, newMember);
    orgMembers.value = await fetchOrgMembers(<string>route.params.slug);
    closeDialog();
    emits('callback')
  } catch (e: any) {

  }
}

const updateMember = async () => {
  clearErrorMessage()
  if (!selectedMember.value) {
    errorMessage.name = "Please select a member";
    return;
  }

  if (!selectedAccessLevel.value) {
    errorMessage.access_level = "Please select an access level";
    return;
  }

  try{
    //@ts-ignore
    const updatedMember: OrgMember = {
      user: props.member?.user as User,
      access_level: selectedAccessLevel.value,
      membership_uid: props.member?.membership_uid as string,
      is_deleted: false
    }
    loading.value = true;
    await updateOrgMember(<string>route.params.slug, updatedMember);
    orgMembers.value = await fetchOrgMembers(<string>route.params.slug);
    closeDialog();
    emits('callback')
  } catch (e: any) {

  }
}

const clearMemberData = () => {
  selectedMember.value = null;
  selectedAccessLevel.value = null;
}
const closeDialog = () => {
  clearErrorMessage()
  clearMemberData()
  addMembersDialog.value = false
}

// watch(() => selectedAccessLevel.value, () => {
//   console.log(selectedAccessLevel.value)
// })

const checkIfMember = (uid: string): OrgMember => {
  return <OrgMember>orgMembers.value.find(member => member.user.uid === uid);
}

onMounted(async () => {
  orgMembers.value = await fetchOrgMembers(<string>route.params.slug);
  users.value = await fetchUsers();

  if(props.formType === FormType.edit){
    if(props.member){
      selectedMember.value = props.member.user
      selectedAccessLevel.value = props.member.access_level
    }
  }
})

onUpdated(async () => {
  orgMembers.value = await fetchOrgMembers(<string>route.params.slug);
  users.value = await fetchUsers();
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
              :disabled="props.formType == FormType.edit"
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
              :error-messages="errorMessage.name"
          >
            <template v-slot:item="{ props, item }">
              <VListItem
                  :disabled="!!checkIfMember(item.raw.uid as string) && !checkIfMember(item.raw.uid as string).is_deleted"
                  v-bind="props"
                  :prepend-avatar="item.raw.profile_picture"
                  :subtitle="checkIfMember(item.raw.uid) && !checkIfMember(item.raw.uid as string).is_deleted ? checkIfMember(item.raw.uid).access_level : item.raw.email"
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
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.access_level"
          />
        </div>
      </div>
      <VDivider/>

      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="closeDialog"
            width="86"
            variant="outlined"
            class="button-outline action-button"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            width="86"
            class="action-button"
            @click="formType === FormType.edit ? updateMember() : addMember()"
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
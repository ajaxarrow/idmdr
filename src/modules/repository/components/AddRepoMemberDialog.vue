<script setup lang="ts">
import {computed, onMounted, onUpdated, reactive, ref, PropType} from "vue";
import {OrgMember, User} from "../../../interfaces/member.interface.ts";

import {useRouting} from "../../../core/composables/useRouting.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {useOrganizationMembersServices} from "../../organization/services/organization-members.services.ts";
import {useRepositoryMemberServices} from "../services/repository-member.services.ts";
import RepoAccessLevelInfoDialog from "./RepoAccessLevelInfoDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

const emits = defineEmits(['callback', 'accessRequestCallback'])
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
  },
  selectedMember: {
    type: Object as PropType<User>
  },
  isMemberIncluded: {
    type: Boolean,
    default: false
  }
})
const {userData} = useUserStore()
const {fetchUsers} = useOrganizationMembersServices();
const {addRepoMember, updateRepoMember, fetchRepoMembers} = useRepositoryMemberServices();
const {route} = useRouting();
const users = ref<User[]>([]);
const orgMembers = ref<OrgMember[]>([]);
const addMembersDialog = ref(false);
const selectedMember = ref<User | null>(null);
const selectedAccessLevel = ref<string | null>(null);
const pageLoading = ref(false);
const accessLevels = computed(() => {
  if (userData.is_superuser) {
    return ['owner','admin', 'manager', 'member', 'viewer'];
  } else if (props.userAccessLevel === 'manager') {
    return ['manager', 'member', 'viewer'];
  }  else {
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
  pageLoading.value = true
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
    await addRepoMember(<string>route.params.slug, newMember);
    orgMembers.value = await fetchRepoMembers(<string>route.params.slug);
    closeDialog();
    if(props.isMemberIncluded){
      emits('accessRequestCallback')
    } else {
      emits('callback')
    }
  } catch (e: any) {

  }
  pageLoading.value = false
}

const updateMember = async () => {
  pageLoading.value = true
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
    await updateRepoMember(<string>route.params.slug, updatedMember);
    orgMembers.value = await fetchRepoMembers(<string>route.params.slug);
    closeDialog();
    emits('callback')
  } catch (e: any) {
    // console.error(e)
  }
  pageLoading.value = false
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


const checkIfMember = (uid: string): OrgMember => {
  return <OrgMember>orgMembers.value.find(member => member.user.uid === uid);
}

onMounted(async () => {
  pageLoading.value = true
  orgMembers.value = await fetchRepoMembers(<string>route.params.slug);
  users.value = await fetchUsers();

  if(props.formType === FormType.edit){
    if(props.member){
      selectedMember.value = props.member.user
      selectedAccessLevel.value = props.member.access_level
    }
  }

  if(props.isMemberIncluded){
    if(props.selectedMember){
      selectedMember.value = props.selectedMember
    }
  }
  pageLoading.value = false
})

onUpdated(async () => {
  pageLoading.value = true
  orgMembers.value = await fetchRepoMembers(<string>route.params.slug);
  users.value = await fetchUsers();
  pageLoading.value = false
})

</script>

<template>
  <div @click="addMembersDialog = true">
    <slot></slot>
  </div>

  <VDialog v-model="addMembersDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">{{props.formType == FormType.edit ? 'Edit Member' : 'Add Member'}}</p>
      <VDivider/>
      <div v-if="pageLoading" class="loading-state-container" style="min-height: 150px;">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <div v-else class="pa-5">
        <div>
          <p class="dialog-label mb-2">Member</p>
          <VAutocomplete
              :disabled="(props.formType == FormType.edit) || props.isMemberIncluded!"
              placeholder="Choose Member"
              :item-value="user => user"
              v-model="selectedMember"
              :items="users"
              :item-title="user => `${user.first_name} ${user.last_name}`"
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
                  :prepend-avatar="item.raw.profile_picture as string || 'https://mighty.tools/mockmind-api/content/abstract/46.jpg'"
                  :subtitle="checkIfMember(item.raw.uid as string) && !checkIfMember(item.raw.uid as string).is_deleted ? checkIfMember(item.raw.uid as string).access_level : item.raw.email as string"
                  :title="`${item.raw.first_name} ${item.raw.last_name}`"
              ></VListItem>
            </template>
          </VAutocomplete>
        </div>
        <div>
          <p class="dialog-label mb-2 d-flex justify-space-between">
            Access Control
            <span style="font-size: 14px; font-weight: 400;">
              <RepoAccessLevelInfoDialog/>
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
            :disabled="pageLoading"
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
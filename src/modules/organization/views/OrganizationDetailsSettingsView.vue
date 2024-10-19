<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import AddMemberDialog from "../components/AddMemberDialog.vue";
import AccessLeveLInfoDialog from "../components/AccessLeveLInfoDialog.vue";
import {PhDotsThreeOutlineVertical, PhInfo, PhMagnifyingGlass, PhPencil, PhTrash} from "@phosphor-icons/vue";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {useOrganizationMembersServices} from "../services/organization-members.services.ts";
import {watch} from "vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";

const {route} = useRouting()
const {organization} = useOrganizationStore();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const {fetchOrgMembers, removeOrgMember} = useOrganizationMembersServices()
const {userData} = useUserStore();
const searchQuery = ref('')
const memberActionMenu = ref(false)
const path = ref('organizations')
const orgMemberData = ref<OrgMember[]>([])
const orgMembers = ref<OrgMember[]>([])
const userOrgInfo = ref<OrgMember | null | undefined>(null)

const filterOrganizationMembersBySearchQuery = () => {
  if(searchQuery.value) {
    orgMembers.value = orgMemberData.value.filter(member => member.user.username.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
  } else {
    orgMembers.value = orgMemberData.value
  }
}

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

watch(() => searchQuery.value, () => {
  filterOrganizationMembersBySearchQuery()
});


const fetchMembersCallback = async () => {
  await fetchMembers()
  showSnackbarMessage('Member Added Successfully', Status.success)
}

const updateMembersCallback = async () => {
  await fetchMembers()
  showSnackbarMessage('Member Updated Successfully', Status.success)
  memberActionMenu.value = false
}

const deleteMemberCallback = async (member: OrgMember) => {
  await removeOrgMember(<string>route.params.slug, member)
  await fetchMembers()
  showSnackbarMessage('Member Removed Successfully', Status.success)
  memberActionMenu.value = false
}


const fetchMembers = async () => {
  const data = await fetchOrgMembers(<string>route.params.slug)
  orgMembers.value = data
  orgMemberData.value = data
}

onMounted(async () => {
  const alluserOrg = await fetchOrganizationByUser();
  path.value = getFirstPath(<string>route.path)
  await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if( isSlugInOrgList(organization.value, alluserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }
  await fetchMembers()
  userOrgInfo.value = orgMembers.value.find(member => member.user.uid === userData.uid);
})
</script>

<template>
  <OrganizationDetailsLayout :organization="organization" activeTab="settings">
    <div v-if="organization" class="py-6 px-7">
      <div v-if="organization.is_member">
        <div v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'moderator'" class="mt-2">
          <VRow  class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Update Organization Information</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your organization details and information</p>
            </div>
            <VBtnPrimaryFilled
                :to="{ name: path == 'organizations' ? 'edit-organization' : 'edit-organization-my', params: {slug: organization.slug}}"
                height="41px"
                rounded="lg"
                class="satoshi-md"
                style="font-size: 14px !important;">
              Update Organization Info
            </VBtnPrimaryFilled>
          </VRow>
        </div>
        <VDivider v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'moderator'" class="my-5"/>
        <div class="mt-2">
          <VRow v-if="organization.is_member" class="ma-0" justify="space-between" align="center">
            <div>
              <p class="section-title">Organization Members</p>
              <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage organization members and their roles. <AccessLeveLInfoDialog/></p>
            </div>
            <AddMemberDialog :form-type="FormType.create" v-if="userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level == 'moderator'" @callback="fetchMembersCallback">
              <VBtnPrimaryFilled  height="41px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                Add Member
              </VBtnPrimaryFilled>
            </AddMemberDialog>
          </VRow>
          <VTextField
              class="my-3"
              v-model="searchQuery"
              hide-details
              variant="outlined"
              rounded="xl"
              density="comfortable"
              color="primary"
              base-color="gs60"
          >
            <template v-slot:prepend-inner>
              <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
            </template>
            <template v-slot:label>
              <p class="text-gs20">Find members</p>
            </template>
          </VTextField>
          <div class="my-5 mx-1" v-if="orgMembers.length > 0">
            <div
                v-for="member in orgMembers"
                :key="member.membership_uid"
            >
              <VRow v-if="!member.is_deleted" class="ma-0 my-3" justify="space-between" align="center">
                <div class="d-flex align-center">
                  <VAvatar
                      size="40"
                      class="mr-1 cursor-pointer"
                  >
                    <VImg :src="member.user.profile_picture ?? 'https://dummyimage.com/400x400/023768/fff.png&text=N/A'"></VImg>
                  </VAvatar>
                  <div class="mr-2">
                    <p class="text-name text-container">{{member.user.username}}</p>
                    <p class="text-name-subtitle">{{member.user.email}} · {{member.access_level}}</p>
                  </div>
                </div>
                <VMenu
                    v-if="member.user.uid != userData.uid || (userOrgInfo?.access_level == 'owner' ||userOrgInfo?.access_level == 'admin' || userOrgInfo?.access_level) == 'moderator'"
                    location="bottom"
                    v-model="memberActionMenu"
                    :close-on-content-click="false"
                >
                  <template #activator="{ props }">
                    <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                      Options
                      <PhDotsThreeOutlineVertical weight="fill"/>
                    </p>
                  </template>
                  <VSheet width="200" class="rounded-b-lg py-2">
                    <AddMemberDialog
                      :form-type="FormType.edit"
                      :member="member"
                      :user-access-level="userOrgInfo?.access_level"
                      @callback="updateMembersCallback"
                    >
                      <p class="cursor-pointer action-menu-item">
                        <PhPencil/>
                        Edit Access
                      </p>
                    </AddMemberDialog>
                    <DeleteDialog @callback="deleteMemberCallback(member)">
                      <p class="cursor-pointer action-menu-item">
                        <PhTrash/>
                        Remove User
                      </p>
                    </DeleteDialog>
                  </VSheet>
                </VMenu>
              </VRow>
              <VDivider v-if="!member.is_deleted" class="mt-3"/>
            </div>
          </div>
          <div class="my-5 mx-1" v-else>
            <p class="d-flex align-center justify-center">
              <PhInfo class="mr-1"/>No Organization Members Found
            </p>
          </div>
        </div>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.action-button{
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover{
  background-color: #F0F5F9;
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

.section-title{
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

.text-name{
  font-size: 16px !important;
  font-weight: 700 !important;
}

.text-name-subtitle{
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 0.75;
}

</style>
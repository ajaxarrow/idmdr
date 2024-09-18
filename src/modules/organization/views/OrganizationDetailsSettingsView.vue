<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import AddMemberDialog from "../components/AddMemberDialog.vue";
import AccessLeveLInfoDialog from "../components/AccessLeveLInfoDialog.vue";
import {PhDotsThreeOutlineVertical, PhMagnifyingGlass, PhPencil, PhTrash} from "@phosphor-icons/vue";
import {OrgMember} from "../../../interfaces/member.interface.ts";
import {useOrganizationMembersServices} from "../services/organization-members.services.ts";
const {route} = useRouting()
const {organization} = useOrganizationStore();
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const {fetchOrgMembers} = useOrganizationMembersServices()
const searchQuery = ref('')
const memberActionMenu = ref(false)
const path = ref('organizations')
const orgMembers = ref<OrgMember[]>([])

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

onMounted(async () => {
  const alluserOrg = await fetchOrganizationByUser();
  path.value = getFirstPath(<string>route.path)
  await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if(isSlugInOrgList(organization.value, alluserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }

  orgMembers.value = await fetchOrgMembers(<string>route.params.slug)
  console.log(orgMembers.value)
})
</script>

<template>
  <OrganizationDetailsLayout :organization="organization" activeTab="settings">
    <div v-if="organization" class="py-6 px-7">
      <div class="mt-2">
        <VRow v-if="organization.is_member" class="ma-0" justify="space-between" align="center">
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
      <VDivider class="my-5"/>
      <div class="mt-2">
        <VRow v-if="organization.is_member" class="ma-0" justify="space-between" align="center">
          <div>
            <p class="section-title">Organization Members</p>
            <p class="text-gs20 mb-2" style="font-size: 14px;">Browse and manage organization members and their roles. <AccessLeveLInfoDialog/></p>
          </div>
          <AddMemberDialog>
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
        <div class="my-5 mx-1" v-if="orgMembers.length !== 0">
          <div
            v-for="member in orgMembers"
            :key="member.membership_uid"
          >
            <VRow v-if="!member.is_deleted" class="ma-0" justify="space-between" align="center">
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
                  <AddMemberDialog>
                    <p class="cursor-pointer action-menu-item">
                      <PhPencil/>
                      Edit Access
                    </p>
                  </AddMemberDialog>
                  <p class="cursor-pointer action-menu-item">
                    <PhTrash/>
                    Remove User
                  </p>
                </VSheet>
              </VMenu>
            </VRow>
            <VDivider class="mt-3"/>
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
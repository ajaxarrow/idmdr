<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import AddMemberDialog from "../components/AddMemberDialog.vue";
import AccessLeveLInfoDialog from "../components/AccessLeveLInfoDialog.vue";
const {route} = useRouting()
const {organization} = useOrganizationStore();
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

onMounted(async () => {
  const alluserOrg = await fetchOrganizationByUser();
  await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if(isSlugInOrgList(organization.value, alluserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }
})
</script>

<template>
  <OrganizationDetailsLayout :organization="organization" activeTab="settings">
    <div v-if="organization" class="pa-6">
      <div class="mt-2">
        <VRow v-if="organization.is_member" class="ma-0" justify="space-between" align="center">
          <div>
            <p class="section-title">Update Organization Information</p>
            <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your organization details and information</p>
          </div>
          <VBtnPrimaryFilled :to="{ name: 'edit-organization', params: {slug: organization.slug}}" height="41px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
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
          <AddMemberDialog/>
        </VRow>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.section-title{
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.5px;
}

</style>
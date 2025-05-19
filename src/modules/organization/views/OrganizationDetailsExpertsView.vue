<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, ref} from "vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import ExpertListViewContent from "../components/ExpertListViewContent.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import ExpertDataTable from "../components/ExpertDataTable.vue";


const {setSnackbarMessage} = useSnackbarStore()
const {route} = useRouting()
const {fetchOrganizationData, fetchOrganizationIDsByUser} = useOrganizationServices();
const path = ref('organizations')
const organization = ref<Organization | null>();

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};



const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

onMounted(async () => {
  path.value = getFirstPath(<string>route.path)
  const allUserOrg = await fetchOrganizationIDsByUser();
  organization.value = await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }
  await setSnackbarMessage()
})
</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="experts">
    <ExpertListViewContent
      v-if="!organization.is_member! as boolean"
      :forOrganization="true"
    />
    <ExpertDataTable v-else/>
  </OrganizationDetailsLayout>
</template>

<style scoped>


</style>
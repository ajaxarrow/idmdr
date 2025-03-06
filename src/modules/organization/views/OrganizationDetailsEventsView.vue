<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import CalendarContent from "../../events/components/CalendarContent.vue";

const {setSnackbarMessage} = useSnackbarStore()
const {route, router} = useRouting()
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const organization = ref<Organization | null>();

const path = ref('organizations')


const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

onMounted(async () => {
  path.value = getFirstPath(<string>route.path)
  const allUserOrg = await fetchOrganizationByUser();
  organization.value = await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    } else {
      await router.push({
        name: "organization-data",
        params: {
          slug: <string> route.params.slug
        }
      })
    }
  }
})

</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="posts">
    <div v-if="organization" class="pa-6">
      <CalendarContent :for-organization="true"/>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>


</style>
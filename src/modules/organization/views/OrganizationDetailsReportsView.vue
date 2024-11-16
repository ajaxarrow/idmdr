<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import OrgRepoCharts from "../components/Reports/OrgRepoCharts.vue";


const {route, router} = useRouting()
const {organization} = useOrganizationStore();
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const loading = ref(false)
const path = ref('organizations')


const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};


onMounted(async () => {
  loading.value = true
  const allUserOrg = await fetchOrganizationByUser();
  path.value = getFirstPath(<string>route.path)
  await fetchOrganizationData(route.params.slug as string);

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
  loading.value = false
})
</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="reports">
    <div v-if="loading" class="loading-state-container mt-15">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="organization">
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Created Repositories</p>
          <OrgRepoCharts/>
        </div>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>

.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}


:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

</style>
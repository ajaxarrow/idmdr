<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted, ref} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";


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
      <div v-if="organization" class="py-6 px-7">
        Reports
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
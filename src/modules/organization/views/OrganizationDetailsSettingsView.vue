<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {onMounted} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
const {route} = useRouting()
const {organization, setOrganizationData, allOrganizations} = useOrganizationStore();
const {fetchOrganizationData} = useOrganizationServices();
onMounted(async () => {
  await fetchOrganizationData(route.params.slug as string);
})


</script>

<template>
  <OrganizationDetailsLayout :organization="organization" activeTab="settings">
    <div v-if="organization" class="pa-6">
      <div class="mt-2 mb-5">
        <p class="section-title">Update Organization Information</p>
        <p class="text-gs20 my-2">Modify your organization details and information</p>
        <VBtnPrimaryFilled :to="{ name: 'edit-organization', params: {slug: organization.slug}}" width="235px" height="37px" rounded="lg" class="satoshi-md">
          Update Organization Info
        </VBtnPrimaryFilled>
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>
.section-title{
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.5px;
}

</style>
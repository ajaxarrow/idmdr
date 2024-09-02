<script setup lang="ts">
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import {useOrganizationStore} from "../stores/organization.store.ts";
  import {onMounted} from "vue";
  import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
  import {useOrganizationServices} from "../services/organization.services.ts";
  import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";

  const {route} = useRouting()
  const {setSnackbarMessage} = useSnackbarStore()
  const {organization, setOrganizationData, allOrganizations} = useOrganizationStore();
  const {fetchOrganizations} = useOrganizationServices();

  onMounted(async () => {
    await fetchOrganizations()
    setOrganizationData(route.params.slug as string, allOrganizations.value);
    await setSnackbarMessage()
  })
</script>

<template>
  <OrganizationDetailsLayout :organization="organization" :activeTab="'about'">
   <div v-if="organization">
     <div class="px-6 py-2">
       <div>
         <p class="text-about-heading py-3">About Organization</p>
         <div v-html="organization.description"></div>
<!--         <p class="organization-description">{{organization.description} }</p>-->
       </div>
       <VRow class="ma-0 my-7">
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Address</p>
           <p class="text-subtitle">{{ organization.address }}</p>
         </VCol>
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Consortium Type</p>
           <p class="text-subtitle">hello</p>
         </VCol>
       </VRow>
     </div>
     <VDivider/>
     <div class="px-6 py-2 mb-10">
       <p class="text-about-heading py-3">Cluster Representatives</p>
       <VRow class="ma-0">
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Research & Development</p>
           <p class="text-subtitle">
             {{ organization.rd_rep.full_name ? organization.rd_rep.full_name : 'N/A' }}
             <span v-if="organization.rd_rep.email">|</span>
             {{ organization.rd_rep.email ? organization.rd_rep.email : 'N/A' }}
           </p>
         </VCol>

         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Technology Transfer</p>
           <p class="text-subtitle">
             {{ organization.tt_rep.full_name ? organization.tt_rep.full_name : 'N/A' }}
             <span v-if="organization.tt_rep.email">|</span>
             {{ organization.tt_rep.email ? organization.tt_rep.email : 'N/A' }}
           </p>
         </VCol>

         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Information Communication</p>
           <p class="text-subtitle">
             {{ organization.ic_rep.full_name ? organization.ic_rep.full_name : 'N/A' }}
             <span v-if="organization.ic_rep.email">|</span>
             {{ organization.ic_rep.email ? organization.ic_rep.email : 'N/A' }}
           </p>
         </VCol>

         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Science Communication</p>
           <p class="text-subtitle">
             {{ organization.sc_rep.full_name ? organization.sc_rep.full_name : 'N/A' }}
             <span v-if="organization.sc_rep.email">|</span>
             {{ organization.sc_rep.email ? organization.sc_rep.email : 'N/A' }}
           </p>
         </VCol>

       </VRow>
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

.organization-description{
  text-align: justify;
  text-indent: 20px;
}

</style>
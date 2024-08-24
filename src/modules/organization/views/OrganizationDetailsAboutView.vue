<script setup lang="ts">
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import {useOrganizationStore} from "../stores/organization.store.ts";
  import {onMounted} from "vue";
  import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
  import {useOrganizationServices} from "../services/organization.services.ts";

  const {route} = useRouting()
  const {organization, setOrganizationData, myOrganizations} = useOrganizationStore();
  const {fetchOrganizationByUser} = useOrganizationServices();

  onMounted(async () => {
    await fetchOrganizationByUser()
    setOrganizationData(route.params.slug as string, myOrganizations.value);
  })
</script>

<template>
  <OrganizationDetailsLayout :organization="organization" :activeTab="'about'">
   <div v-if="organization">
     <div class="px-6 py-2">
       <div>
         <p class="text-about-heading py-3">About Organization</p>
         <p class="organization-description">{{organization.description}}</p>
       </div>
       <VRow class="ma-0 my-7">
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Address</p>
           <p class="text-subtitle">{{ organization.address }}</p>
         </VCol>
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Consortium Type</p>
           <p class="text-subtitle">{{ organization.type }}</p>
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
             {{ organization.rd_rep.name ? organization.rd_rep.name : 'N/A' }}
             <span v-if="organization.rd_rep.email">|</span>
             {{ organization.rd_rep.email ? organization.rd_rep.email : 'N/A' }}
           </p>
         </VCol>

         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Technology Transfer</p>
           <p class="text-subtitle">
             {{ organization.tt_rep.name ? organization.tt_rep.name : 'N/A' }}
             <span v-if="organization.tt_rep.email">|</span>
             {{ organization.tt_rep.email ? organization.tt_rep.email : 'N/A' }}
           </p>
         </VCol>

         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Information Communication</p>
           <p class="text-subtitle">
             {{ organization.ic_rep.name ? organization.ic_rep.name : 'N/A' }}
             <span v-if="organization.ic_rep.email">|</span>
             {{ organization.ic_rep.email ? organization.ic_rep.email : 'N/A' }}
           </p>
         </VCol>

         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Science Communication</p>
           <p class="text-subtitle">
             {{ organization.sc_rep.name ? organization.sc_rep.name : 'N/A' }}
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
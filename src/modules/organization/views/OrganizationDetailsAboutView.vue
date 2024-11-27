<script setup lang="ts">
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import {useOrganizationStore} from "../stores/organization.store.ts";
  import {onMounted} from "vue";
  import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
  import {useOrganizationServices} from "../services/organization.services.ts";
  import {useOrgType} from "../composables/useOrgType.ts";
  import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
  import "quill/dist/quill.core.css"
  import "quill/dist/quill.snow.css"
  const {route} = useRouting()
  const {setSnackbarMessage} = useSnackbarStore()
  const {organization} = useOrganizationStore();
  const {fetchOrganizationData} = useOrganizationServices();
  const {getOrganizationType, getOrganizationSubType} = useOrgType()


  onMounted(async () => {
    await fetchOrganizationData(route.params.slug as string);
    await setSnackbarMessage()
  })
</script>

<template>
  <OrganizationDetailsLayout
    :organization="organization"
    :activeTab="'about'">
   <div v-if="organization">
     <div class="px-7 py-5">
       <div>
         <p class="text-about-heading py-3">About Organization</p>
         <div class="ql-snow">
           <div class="ql-editor" v-html="organization.description"></div>
         </div>
       </div>
     </div>
     <VDivider/>
     <div class="px-7 py-5">
       <p class="text-about-heading py-3">Consortium Type</p>
       <VRow class="ma-0">
         <VCol v-if="organization.org_type" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Organization Type</p>
           <p class="text-subtitle">{{ getOrganizationType(organization.org_type) }}</p>
         </VCol>
         <VCol v-if="organization.sub_org_type" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Organization Sub Type</p>
           <p class="text-subtitle">{{ getOrganizationSubType(organization.sub_org_type) }}</p>
         </VCol>
       </VRow>
     </div>
     <VDivider/>
     <div class="px-7 py-5">
       <p class="text-about-heading py-3">Contact Information</p>
       <VRow class="ma-0">
         <VCol v-if="organization.president" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">President</p>
           <p class="text-subtitle">{{ organization.president }}</p>
         </VCol>
         <VCol v-if="organization.address" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Address</p>
           <p class="text-subtitle">{{ organization.address }}</p>
         </VCol>
         <VCol v-if="organization.tel_phone" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Telephone</p>
           <p class="text-subtitle">{{ organization.tel_phone }}</p>
         </VCol>
         <VCol v-if="organization.phone" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Cell Number</p>
           <p class="text-subtitle">{{ organization.phone }}</p>
         </VCol>
         <VCol v-if="organization.email" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Email</p>
           <p class="text-subtitle">{{ organization.email }}</p>
         </VCol>
         <VCol v-if="organization.website" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">Website</p>
           <p class="text-subtitle">{{ organization.website }}</p>
         </VCol>
       </VRow>
     </div>
     <VDivider/>
     <div class="px-7 py-5 mb-10">
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
     <div v-if="organization.additional_info && organization.additional_info?.trim().length != 0">
       <VDivider/>
       <div class="px-7 py-5">
         <p class="text-about-heading py-3">Additional Information</p>
         <VRow class="ma-0">
           <div class="ql-snow">
             <div class="ql-editor" v-html="organization.additional_info"></div>
           </div>
         </VRow>
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

.organization-description{
  text-align: justify;
  text-indent: 20px;
}

</style>
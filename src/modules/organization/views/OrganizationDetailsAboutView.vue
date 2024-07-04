<script setup lang="ts">
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import {useOrganizationStore} from "../stores/organization.store.ts";
  import {onMounted} from "vue";
  import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";

  const {route} = useRouting()
  const {organization, setOrganizationData} = useOrganizationStore();

  onMounted(() => {
    setOrganizationData(route.params.slug as string);
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
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0">
           <p class="text-subtitle text-gs20">Address</p>
           <p class="text-subtitle">{{ organization.address }}</p>
         </VCol>
         <VCol sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0">
           <p class="text-subtitle text-gs20">Consortium Type</p>
           <p class="text-subtitle">{{ organization.type }}</p>
         </VCol>
       </VRow>
     </div>
     <VDivider/>
     <div class="px-6 py-2 mb-10">
       <p class="text-about-heading py-3">Cluster Representatives</p>
       <VRow class="ma-0">
         <VCol v-for="rep in organization.clusterRepresentatives" sm="12" md="6" xxl="6" xl="6" lg="6" class="pa-0 my-2">
           <p class="text-subtitle text-gs20">{{rep.type}}</p>
           <p class="text-subtitle">{{ rep.name }} <span v-if="rep.email">|</span> {{rep.email}}</p>
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
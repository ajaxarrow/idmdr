<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import { PhHardDrives, PhMagnifyingGlass} from "@phosphor-icons/vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Expert, Organization} from "../../../interfaces/organization.interface.ts";
import {useScroll} from "../../../core/composables/useScroll.ts";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";
import OrganizationExpertItem from "../components/OrganizationExpertItem.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const {setSnackbarMessage} = useSnackbarStore()
const {scrollTop} = useScroll()
const {route, router} = useRouting()
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const {fetchExpertsByOrganization} = useOrganizationExpertsServices()

const path = ref('organizations')
const searchQuery = ref('');
const expertData = ref<Expert[]>([]);
const searchedExperts = ref<Expert[]>([]);
const organization = ref<Organization | null>();
const pageLoading = ref(false)

const filterExpertsBySearch = async (searchQuery: string, expertData: Expert[]) => {
  if(searchQuery) {
    return expertData.filter((expert: Expert) => {
      //@ts-ignore
      return expert.name?.first_name.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) || expert.name?.last_name.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) || expert.name?.middle_name.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()) || expert.name?.extension.toLowerCase().trim().includes(searchQuery.toLowerCase().trim())
    })
  } else {
    return expertData
  }
}

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};



const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

watch(() => searchQuery.value, async () => {
  searchedExperts.value = await filterExpertsBySearch(searchQuery.value, expertData.value);
});


onMounted(async () => {
  pageLoading.value = true
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
  expertData.value = await fetchExpertsByOrganization(route.params.slug as string);
  searchedExperts.value = expertData.value
  await setSnackbarMessage()
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
})

</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="experts">
    <div v-if="organization" class="pa-6">
      <VTextField
          v-model="searchQuery"
          hide-details
          variant="outlined"
          rounded="xl"
          density="comfortable"
          color="primary"
          base-color="gs60"
      >
        <template v-slot:prepend-inner>
          <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
        </template>
        <template v-slot:label>
          <p class="text-gs20">Search experts by name</p>
        </template>
      </VTextField>
      <VRow justify="space-between" align="center" class="ma-0 my-6">
        <p class="text-title d-flex align-center">
          <PhHardDrives size="24" class="mr-1"/>
          Browse Experts by {{organization.name}} ({{organization.acronym}})
        </p>
        <p class="d-flex align-center">
          <VBtnPrimaryFilled
              :to="{name: 'new-expert'}"
              rounded="lg"
              class="satoshi-md"
              width="130px"
              height="40px"
              style="font-size: 14px !important;"
          >
            Add Expert
          </VBtnPrimaryFilled>
        </p>
      </VRow>
      <div v-if="pageLoading" class="loading-state-container">
        <VProgressCircular
            indeterminate
            color="#23668b"
        ></VProgressCircular>
      </div>
      <div v-else>
        <div v-if="searchedExperts.length > 0">
            <OrganizationExpertItem
                v-for="expert in searchedExperts"
                :key="expert.uid"
                :expert="expert"
            />
            <p class="text-center mt-5">
              All {{organization.acronym}}'s experts are loaded!
              <span
                  @click="scrollTop"
                  class="text-bs50 cursor-pointer scroll-top-link"
              >
                  Jump back to the top?
                </span>
            </p>
        </div>
        <EmptyStateInfo
            v-else
            header="No Experts Found"
            description="We couldn't find any experts. Please try again later."
            :isCallbackNeeded="searchQuery !== ''"
            @callback="searchQuery = ''"
        />
      </div>
    </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>


</style>
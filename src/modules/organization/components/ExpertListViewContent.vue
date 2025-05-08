<script setup lang="ts">
import {PhHardDrives, PhInfo, PhMagnifyingGlass} from "@phosphor-icons/vue";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import OrganizationExpertItem from "./OrganizationExpertItem.vue";
import {useScroll} from "../../../core/composables/useScroll.ts";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {Expert} from "../../../interfaces/organization.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";

const props = defineProps({
  forOrganization: {
    type: Boolean,
    default: false
  },
})
const {route} = useRouting()
const {scrollTop} = useScroll()
const {fetchAllExperts, fetchExpertsByOrganization} = useOrganizationExpertsServices()
const searchQuery = ref('');
const expertData = ref<Expert[]>([]);
const searchedExperts = ref<Expert[]>([]);
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

watch(() => searchQuery.value, async () => {
  searchedExperts.value = await filterExpertsBySearch(searchQuery.value, expertData.value);
});

onMounted(async () => {
  pageLoading.value = true
  if(props.forOrganization) {
    expertData.value = await fetchExpertsByOrganization(route.params.slug as string);
  } else {
    expertData.value = await fetchAllExperts();
  }
  searchedExperts.value = expertData.value
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
})
</script>

<template>
  <div class="pa-6">
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
        Browse Experts
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
          All experts are loaded!
          <span
              @click="scrollTop"
              class="text-bs50 cursor-pointer scroll-top-link"
          >
                  Jump back to the top?
                </span>
        </p>
      </div>
      <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Experts Found</p>
      <EmptyStateInfo
          v-else
          header="No Experts Found"
          description="We couldn't find any experts. Please try again later."
          :isCallbackNeeded="searchQuery !== ''"
          @callback="searchQuery = ''"
      />
    </div>
  </div>
</template>

<style scoped>

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}
</style>
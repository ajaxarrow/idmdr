<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhHardDrives, PhInfo, PhMagnifyingGlass, PhPlus} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {onMounted, ref, watch} from "vue";
import {Expert} from "../../../interfaces/organization.interface.ts";
import {useScroll} from "../../../core/composables/useScroll.ts";
import OrganizationExpertItem from "../components/OrganizationExpertItem.vue";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";

const {scrollTop} = useScroll()
const {fetchAllExperts} = useOrganizationExpertsServices()
const {isSmall, isTablet} = useScreenStore();
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
  expertData.value = await fetchAllExperts();
  searchedExperts.value = expertData.value
  pageLoading.value = false
})


</script>

<template>
  <MainLayout title="My Consortium Member Institutions">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                Experts
              </p>
              <p class="text-subtitle">Discover and connect with experts from a consortium of agencies and institutions engaged in research and development in agriculture, aquatic resources, and natural resources across Northern Mindanao. </p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0">
            <VRow class="ma-0 justify-end">
              <VBtnPrimaryFilled :to="{name: 'new-expert'}" v-if="isSmall || isTablet" icon >
                <PhPlus size="16"/>
              </VBtnPrimaryFilled>
              <VBtnPrimaryFilled :to="{name: 'new-expert'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
                <PhPlus size="16" class="mr-2"/>
                New CMI
              </VBtnPrimaryFilled>
            </VRow>
          </VCol>
        </VRow>
      </div>
      <VDivider/>
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
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  left: -209px;
  top: -460px;
  width: 590px;
  height: 585px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

</style>
<script setup lang="ts">
import OrganizationItem from "../components/OrganizationItem.vue";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhMagnifyingGlass, PhPlus, PhUsersThree} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {onMounted, ref, watch, onUnmounted} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import Observer from "../../../core/components/Observer.vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useScroll} from "../../../core/composables/useScroll.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const {scrollTop} = useScroll()
const {user} = useUserStore();
const {fetchOrganizationsWithPagination} = useOrganizationServices();
const {isSmall, isTablet} = useScreenStore();
const searchQuery = ref('');
const organizationData = ref<Organization[]>([]);
const organizationItems = ref<Organization[]>([]);
const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)
const pageLoading = ref(false)


const filterOrganizationsBySearchQuery = () => {
  if(searchQuery.value) {
    organizationData.value = organizationItems.value.filter(organization => organization.name.toLowerCase().includes(searchQuery.value.toLowerCase().trim()) || organization.acronym?.toLowerCase().includes(searchQuery.value.toLowerCase().trim()));
  } else {
    organizationData.value = organizationItems.value
  }
}

const fetchMoreOrganizations = async () => {
  const data = await fetchOrganizationsWithPagination(lastItemValue.value);
  organizationData.value = [...organizationData.value, ...data];
  lastItemValue.value = lastItemValue.value + 1
  if (data.length === 0) {
    reachEnd.value = true
  }
}

watch(() => searchQuery.value, () => {
  filterOrganizationsBySearchQuery()
});

onMounted(async () => {
  pageLoading.value = true
  const fetchedData = await fetchOrganizationsWithPagination(lastItemValue.value);
  organizationData.value = [...fetchedData];
  organizationItems.value = organizationData.value;
  lastItemValue.value = lastItemValue.value + 1
  observerReady.value = true
  pageLoading.value = false
})

onUnmounted(() => {
  observerReady.value = false
})
</script>

<template>
  <MainLayout title="Consortium Member Institutions">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                Consortium Member Institutions
              </p>
              <p class="text-subtitle">Browse and explore the consortium of agencies and institutions undertaking research and development
                in agriculture, aquatic, and natural resources in Northern Mindanao. </p>
            </div>
          </VCol>
         <VCol md="3" class="pa-0">
           <VRow class="ma-0 justify-end" v-if="user">
             <VBtnPrimaryFilled :to="{ name: 'new-organization'}" v-if="isSmall || isTablet" icon >
               <PhPlus size="16"/>
             </VBtnPrimaryFilled>
             <VBtnPrimaryFilled :to="{ name: 'new-organization'}" v-else height="45px" rounded="lg" class="satoshi-md" style="font-size: 14px !important;">
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
            <p class="text-gs20">Search CMIs by title</p>
          </template>
        </VTextField>
        <VRow justify="space-between" align="center" class="ma-0 my-6">
          <p class="text-title d-flex align-center">
            <PhUsersThree size="24" class="mr-1"/>
            <p>{{organizationData.length}} Consortium Member Institution<span v-if="organizationData.length > 1">s</span> Available</p>
          </p>
        </VRow>
        <div v-if="pageLoading" class="loading-state-container">
          <VProgressCircular
              indeterminate
              color="#23668b"
          ></VProgressCircular>
        </div>
        <div v-else>
          <div v-if="organizationData.length > 0">
            <OrganizationItem v-for="organization in organizationData" :organization="organization"/>
            <div class="pa-3" v-if="reachEnd">
              <p class="text-center">
                All CMIs are loaded!
                <span
                    @click="scrollTop"
                    class="text-bs50 cursor-pointer scroll-top-link"
                >
                  Jump back to the top?
                </span>
              </p>
            </div>
            <div class="pa-3" v-else>
              <Observer @intersect="fetchMoreOrganizations" v-if="observerReady"/>
            </div>
          </div>
          <EmptyStateInfo
              v-else
              header="No Consortium Member Institutions Found"
              description="We couldn't find any consortium member institutions at the moment."
              :isCallbackNeeded="searchQuery !== ''"
              @callback="searchQuery = ''"
          />
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
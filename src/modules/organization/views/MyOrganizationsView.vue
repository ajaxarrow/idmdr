<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {PhMagnifyingGlass, PhPlus, PhUsersThree} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import OrganizationItem from "../components/OrganizationItem.vue";
import {onMounted, ref, watch} from "vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {useOrganizationStore} from "../stores/organization.store.ts";
import Observer from "../../../core/components/Observer.vue";

const reachEnd = ref(false)
const lastItemValue = ref(1);
const {myOrganizations} = useOrganizationStore();
const {fetchOrganizationByUserWithPagination} = useOrganizationServices();
const {isSmall, isTablet} = useScreenStore();
const searchQuery = ref('');
const organizationData = ref(myOrganizations);

const filterOrganizationsBySearchQuery = () => {
  if(searchQuery.value) {
    organizationData.value = myOrganizations.value.filter(organization => organization.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  } else {
    organizationData.value = myOrganizations.value
  }
}

const fetchMoreOrganizations = async () => {
  const data = await fetchOrganizationByUserWithPagination(lastItemValue.value);
  lastItemValue.value = lastItemValue.value + 1
  if (data.length === 0) {
    reachEnd.value = true
  }
}

watch(() => searchQuery.value, () => {
  filterOrganizationsBySearchQuery()
});

onMounted(async () => {
  organizationData.value = await fetchOrganizationByUserWithPagination(lastItemValue.value);
  lastItemValue.value = lastItemValue.value + 1
})
</script>

<template>
  <MainLayout title="My Organizations">
    <div style="height: 100%" class="relative-container circle-quarter">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <VRow justify="space-between" align="center" class="ma-0">
          <VCol md="9" class="pa-0">
            <div>
              <p class="text-heading d-flex align-center">
                My Organizations
              </p>
              <p class="text-subtitle">Browse and explore the consortium of agencies and institutions undertaking research and development
                in agriculture, aquatic, and natural resources in Northern Mindanao. </p>
            </div>
          </VCol>
          <VCol md="3" class="pa-0">
            <VRow class="ma-0 justify-end">
              <VBtnPrimaryFilled :to="{ name: 'new-organization'}" v-if="isSmall || isTablet" icon >
                <PhPlus size="20"/>
              </VBtnPrimaryFilled>
              <VBtnPrimaryFilled :to="{ name: 'new-organization'}" v-else width="201px" height="45px" rounded="lg" class="satoshi-md" style="font-size: 15px !important;">
                <PhPlus size="20" class="mr-2"/>
                New Organization
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
            <p class="text-gs20">Search organizations by title</p>
          </template>
        </VTextField>
        <VRow justify="space-between" align="center" class="ma-0 my-6">
          <p class="text-title d-flex align-center">
            <PhUsersThree size="24" class="mr-1"/>
            <p>{{organizationData.length}} Organization<span v-if="organizationData.length > 1">s</span> Available</p>
          </p>
        </VRow>
        <OrganizationItem v-for="organization in organizationData" :organization="organization"/>
        <div class="pa-3" v-if="reachEnd">
          <p class="text-center">No more organizations to fetch!</p>
        </div>
        <div class="pa-3" v-else>
          <Observer  @intersect="fetchMoreOrganizations"/>
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
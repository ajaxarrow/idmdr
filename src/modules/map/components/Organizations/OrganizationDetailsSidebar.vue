<script setup lang="ts">
import {Repository} from "../../../../interfaces/repository.interface.ts";
import {PhInfo, PhX} from "@phosphor-icons/vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useOrganizationStore} from "../../../organization/stores/organization.store.ts";
import {useMapStore} from "../../stores/map.store.ts";
import {useRepositoryServices} from "../../../repository/services/repository.services.ts";
// import Observer from "../../../../core/components/Observer.vue";
import OrgRepoCharts from "../../../organization/components/Reports/OrgRepoCharts.vue";
import {useOrganizationServices} from "../../../organization/services/organization.services.ts";
import {Organization} from "../../../../interfaces/organization.interface.ts";
import {useUserStore} from "../../../../core/stores/user.store.ts";
const {selectedOrganization, removeSelectedOrganization} = useOrganizationStore();
const {fetchOrganizationByUser} = useOrganizationServices()
const {resetToDefault} = useMapStore();
const {fetchAllRepositories} = useRepositoryServices()
const {userData, user} = useUserStore()

const pageLoading = ref(false);
const repositoryData = ref<Repository[]>([]);
const allUserOrg = ref<Organization[]>([])
const isMember = ref(false)
const reachEnd = ref(false)
const lastItemValue = ref(1);
const observerReady = ref(false)
const scrollableContainer = ref<HTMLElement | null>(null);
const scrollToTop = () => {
  if (scrollableContainer.value) {
    if ("scrollTo" in scrollableContainer.value) {
      scrollableContainer.value.scrollTo({top: 0, behavior: 'smooth'});
    }
  }
};

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.uid === organization?.uid);
};

// const fetchMoreRepositories = async () => {
//   const data = await fetchRepositoriesByOrganization(
//       selectedOrganization.value?.slug as string,
//       false,
//       5,
//       lastItemValue.value
//   );
//   repositoryData.value = [...repositoryData.value, ...data];
//   lastItemValue.value = lastItemValue.value + 1;
//   if(data.length === 0){
//     reachEnd.value = true
//   }
// }

watch(() => selectedOrganization.value, async () => {
  observerReady.value = false
  pageLoading.value = true;
  if(isSlugInOrgList(selectedOrganization.value, allUserOrg.value)){
    isMember.value = true
  } else {
    isMember.value = false
  }
  repositoryData.value = [];
  lastItemValue.value = 1;
  reachEnd.value = false
  // await fetchMoreRepositories()
  repositoryData.value = await fetchAllRepositories(1, 1000, '', '', selectedOrganization.value?.slug as string, userData.is_superuser ? '' : true, userData.is_superuser ? '' : true, '', '', '', '', '', '', '', '', userData.is_superuser ? '' : user.value ? '1,4' : '1', !userData.is_superuser, false, 'or');
  observerReady.value = true
  pageLoading.value = false;
})



onMounted(async () => {
  removeSelectedOrganization()
  allUserOrg.value = await fetchOrganizationByUser();
})

onUnmounted(() => {
  removeSelectedOrganization()
  observerReady.value = false
})

</script>

<template>
  <VSheet class="sector-details-sidebar ma-4" v-if="selectedOrganization">
    <VRow justify="space-between" align="center" class="ma-0 pa-4" style="flex: none;">
      <p class="sidebar-title">CMI</p>
      <PhX color="#C83246" size="24" weight="bold" class="cursor-pointer" @click="resetToDefault('Organization')"/>
    </VRow>
    <div class="sidebar-content-wrapper">
      <VImg
          rounded="lg"
          class="mx-auto"
          :cover="true"
          height="174"
          width="328"
          :src="selectedOrganization.image ? selectedOrganization.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
          style="flex: none;"
      />
      <div ref="scrollableContainer" class="pa-4 scrollable-container">
        <VTooltip location="bottom">
          <template v-slot:activator="{ props }">
            <RouterLink v-bind="props" :to="{name: 'organization-data', params: { slug: selectedOrganization.slug  }}" class="text-decoration-none ">
              <p class="sector-title">{{selectedOrganization.name}}</p>
            </RouterLink>
          </template>
          <span>Visit CMI</span>
        </VTooltip>
        <p class="sector-description ">{{selectedOrganization.address}}</p>
        <div class="my-3" v-if="isMember">
          <VTooltip location="bottom">
            <template v-slot:activator="{ props }">
              <RouterLink v-bind="props" :to="{name: 'my-organization-reports', params: { slug: selectedOrganization.slug  }}" class="text-decoration-none text-black ">
                <p class="section-title mb-2">Created Projects Statistics</p>
              </RouterLink>
            </template>
            <span>View Reports in CMI Details View</span>
          </VTooltip>

          <OrgRepoCharts
            :useInCharts="false"
            :useInMap="true"
            :organization="selectedOrganization.uid"
          />
        </div>
        <div class="my-3">
          <VTooltip location="bottom">
            <template v-slot:activator="{ props }">
              <RouterLink v-bind="props" :to="{name: 'my-organization-repositories', params: { slug: selectedOrganization.slug  }}" class="text-decoration-none text-black ">
                <p class="section-title mb-2">Projects</p>
              </RouterLink>
            </template>
            <span>View All in CMI Details View</span>
          </VTooltip>

          <div v-if="pageLoading" class="loading-state-container">
            <VProgressCircular
                indeterminate
                color="#23668b"
            ></VProgressCircular>
          </div>
          <div v-else>
            <div v-if="repositoryData.length > 0">
              <RouterLink
                  v-if="repositoryData.length > 0"
                  class="text-decoration-none "
                  v-for="repository in repositoryData"
                  :to="{name: 'repository-data', params: { slug: repository.slug  }}">
                <div
                    class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
                >
                  <VImg
                      style="border-radius: 8px; flex: none;"
                      cover
                      height="40px"
                      width="40px"
                      :src="repository.image ? <string>repository.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
                  />
                  <div class="ml-2">
                    <p class="default" style="font-size: 15px; font-weight: 600;">{{ repository.title }}</p>
                    <p class="default" style="font-size: 13px; ">{{ repository.owner_data?.first_name}} {{ repository.owner_data?.last_name}}</p>
                  </div>
                </div>
              </RouterLink>
              <div class="pa-3" v-if="reachEnd">
                <p class="text-center">
                  All {{selectedOrganization.acronym}}'s projects are loaded!
                  <span
                      @click="scrollToTop"
                      class="text-bs50 cursor-pointer scroll-top-link"
                  >
                  Jump back to the top?
                </span>
                </p>
              </div>
<!--              <div class="pa-3" v-else>-->
<!--                <Observer @intersect="fetchMoreRepositories" v-if="observerReady"/>-->
<!--              </div>-->
            </div>
            <p v-else class="my-1 d-flex justify-center align-center mb-10">
              <PhInfo size="19" class="mr-1 mb-1"/>  No projects found
            </p>
          </div>
        </div>
      </div>


    </div>
  </VSheet>
</template>

<style scoped>
.repo-item{
  border-radius: 8px;
}
.repo-item:hover{
  background-color: #F0F5F9;
  transition: background-color 0.3s ease;
}
.sector-details-sidebar{
  border-radius: 24px;
  z-index: 5;
  position: fixed;
  top: 0;
  right: 0;
  height: 95vh !important;
  width: 355px !important;
  box-shadow: 0px 0px 7px 0px #5d6e87;
  transition: opacity 1s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-title{
  font-size: 20px;
  font-weight: 600;
}

.section-title{
  font-size: 17px;
  font-weight: 600;
}

.sector-title{
  color: #000 !important;
  font-size: 20px;
  font-weight: 700;
}

.sector-title:hover, .section-title:hover{
  text-decoration: underline;
}

.sector-description{
  color: #5F6061;
}

.tag-chips{
  background-color: #fafafa;
  border: 1px solid #e4e4e4;
}

.default{
  font-size: 14px;
  color: #000000;
}

.sidebar-content-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100% - 174px); /* Subtract VImg height */
}

.scrollable-container {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>
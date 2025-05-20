<script setup lang="ts">
  import {useSectorsStore} from "../stores/sectors.store.ts";
  import {Repository} from "../../../interfaces/repository.interface.ts";
  import {PhDotsThreeOutlineVertical, PhInfo, PhPencil, PhTrash, PhX} from "@phosphor-icons/vue";
  import {onMounted, onUnmounted, ref, watch} from "vue";
  import {useMapStore} from "../../map/stores/map.store.ts";
  import DeleteDialog from "../../../core/components/DeleteDialog.vue";
  import {useUserStore} from "../../../core/stores/user.store.ts";
  import "quill/dist/quill.core.css"
  import "quill/dist/quill.snow.css"
  import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
  import {Status} from "../../../interfaces/enums/status.enum.ts";
  import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
  import {useSectorServices} from "../services/sector.services.ts";
  import {useRepositoryServices} from "../../repository/services/repository.services.ts";
  import {useOrganizationServices} from "../../organization/services/organization.services.ts";
  import {Organization} from "../../../interfaces/organization.interface.ts";
  //@ts-ignore
  import * as turf from "@turf/turf";
  import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";


  const baseURL = import.meta.env.VITE_BASE_API_URL_DJANGO;
  const {isEmptyObject} = useObjectChecker()
  const {user, userData} = useUserStore()
  const {selectedSector, removeSelectedSector, title, allSectors} = useSectorsStore();
  const {deleteSector, fetchSectors} = useSectorServices()
  const {fetchRepositoriesByUser} = useRepositoryServices()
  const {fetchOrganizationByUser, fetchOrganizations} = useOrganizationServices()
  const {showSnackbarMessage} = useSnackbarStore();
  const {resetToDefault, setupBoundaries, removeBoundaries} = useMapStore();


  const sectorActionMenu = ref(false);
  const isRepoAvailable = ref(false);
  const isOrgAvailable = ref(false);
  const loading = ref(false);
  const pageLoading = ref(false);
  const publicOrgs = ref<Organization[]>([]);
  const selectedOrgs = ref<Organization[]>([]);

  const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
    return repoList.some(org => org.slug === repository?.uid);
  };


  const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
    return orgList.some(org => org.slug === organization?.uid);
  };


  const deleteCallback = async (id: string) => {
    loading.value = true
    await removeBoundaries(allSectors.value);
    await deleteSector(id);
    await fetchSectors();
    await setupBoundaries(allSectors.value, 'Sector');
    await resetToDefault('Sector');
    loading.value = false
    showSnackbarMessage('Sector Deleted Successfully', Status.success)
  }

  watch(()=> selectedSector.value, async () => {
    if (selectedSector.value?.parent === 'Repository' && selectedSector.value) {
      pageLoading.value = true
      const allUserRepo = await fetchRepositoriesByUser();
      // @ts-ignore
      selectedSector.value.repoData = selectedSector.value?.parent_obj
      if(isSlugInRepoList(selectedSector.value?.repoData!, allUserRepo) && !selectedSector.value?.repoData?.is_deleted) {
        isRepoAvailable.value = true;
      } else {
        isRepoAvailable.value = false;
      }
      pageLoading.value = false

    } else if (selectedSector.value?.parent === 'Organization' && selectedSector.value) {
      pageLoading.value = true
      const allUserOrg = await fetchOrganizationByUser();
      // @ts-ignore
      selectedSector.value.orgData = selectedSector.value?.parent_obj
      if(isSlugInOrgList(selectedSector.value?.orgData!, allUserOrg) && !selectedSector.value?.orgData?.is_deleted) {
        isOrgAvailable.value = true;
      } else {
        isOrgAvailable.value = false;
      }
      pageLoading.value = false
    } else if(selectedSector.value && selectedSector.value?.parent === 'Province') {
      selectedOrgs.value = []
      pageLoading.value = true
      const multiPolygon = turf.multiPolygon(
          selectedSector.value?.geojson.features.map((feature: any) => feature.geometry.coordinates)
      );

      publicOrgs.value.forEach(org => {
        if(!isEmptyObject(org.geojson)) {
          const point = turf.centroid(org.geojson)
          if(turf.booleanPointInPolygon(point, multiPolygon.geometry)) {
            selectedOrgs.value.push(org)
          }
        }
      })

      pageLoading.value = false
    }
  })

  onMounted(async () => {
    removeSelectedSector();
    publicOrgs.value = await fetchOrganizations();
  })

  onUnmounted(() => {
    removeSelectedSector();
  })



</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <VSheet class="sector-details-sidebar ma-4" v-if="selectedSector">
    <VRow justify="space-between" align="center" class="ma-0 pa-4">
      <p class="sidebar-title">{{title}}</p>
      <PhX color="#C83246" size="24" weight="bold" class="cursor-pointer" @click="resetToDefault"/>
    </VRow>
    <div v-if="pageLoading" class="loading-state-container h-100">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else class="sidebar-content-wrapper">
      <VImg
          style="flex: none;"
          rounded="lg"
          class="mx-auto"
          :cover="true"
          height="174"
          width="328"
          :src="selectedSector.image ? selectedSector.image as string : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
      />
      <div class="pa-4 scrollable-container">
        <VRow v-if="selectedSector.parent != 'Province'" class="ma-0 mt-2 mb-4" justify="space-between" align="center">
          <div>
            <div class="d-flex align-center">
              <VImg
                  style="border-radius: 50%; flex: none !important;"
                  cover
                  height="40px"
                  width="40px"
                  :src="selectedSector.owner ? selectedSector.owner ?.profile_picture!  : 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'"
              />
              <div class="ml-2" style="line-height: 20px">
                <p class="topic-subtitle">{{ selectedSector.owner  ? selectedSector.owner ?.username : ''}}</p>
                <p class="text-gs60" style="font-size: 14px"> {{ new Date(selectedSector?.updated_at as string).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) }}</p>
              </div>
            </div>
          </div>
          <VMenu v-if="(user && userData?.uid === selectedSector?.owner_id) || userData.is_superuser" v-model="sectorActionMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <p class="action-button cursor-pointer d-flex align-center ga-2" v-bind="props">
                Options
                <PhDotsThreeOutlineVertical weight="fill"/>
              </p>
            </template>
            <VSheet width="200" class="rounded-b-lg py-2">
              <RouterLink :to="{name: 'edit-sector', params: {slug: selectedSector?.uid}}" class="cursor-pointer text-black action-menu-item text-decoration-none">
                <PhPencil/>
                Edit
              </RouterLink>
              <DeleteDialog @callback="deleteCallback(selectedSector?.uid! as string)">
                <p class="cursor-pointer action-menu-item">
                  <PhTrash/>
                  Delete
                </p>
              </DeleteDialog>
            </VSheet>
          </VMenu>
        </VRow>
        <p class="sector-title">{{selectedSector.name}}</p>
        <div class="sector-description">{{selectedSector.address}}</div>
        <div v-if="selectedSector.parent == 'Province'" class="sector-description">{{selectedSector.description}}</div>
        <div v-else class="ql-snow">
          <div v-html="selectedSector.description" class="ql-editor"></div>
        </div>
        <div class="my-3">
          <p class="section-title mb-2">{{selectedSector.parent == 'Province' ? 'Consortium Member Institutions' : 'Tagged Entity'}}</p>
          <div v-if="selectedSector.repoData && selectedSector.parent === 'Repository'">

            <RouterLink
                v-if="((selectedSector.repoData?.visibility == 1 || selectedSector.repoData?.visibility == 4) || isRepoAvailable) || userData.is_superuser"
                class="text-decoration-none "
                :to="{name: 'repository-data', params: { slug: selectedSector.repoData?.uid }}">
              <div
                  class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
              >
                <VImg
                    style="border-radius: 8px; flex: none;"
                    cover
                    height="40px"
                    width="40px"
                    :src="selectedSector.repoData.image ? `${baseURL}${<string>selectedSector.repoData?.image}` : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
                />
                <div class="ml-2">
                  <p class="default" style="font-size: 15px; font-weight: 600;">{{ selectedSector.repoData?.title }}</p>
                  <p class="default" style="font-size: 13px; ">{{ selectedSector.repoData?.owner_data?.email }}</p>
                </div>
              </div>
            </RouterLink>
            <div
                v-else
                class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
            >
              <VImg
                  style="border-radius: 8px; flex: none;"
                  cover
                  height="40px"
                  width="40px"
                  :src="'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
              />
              <div class="ml-2">
                <p class="default" style="font-size: 15px; font-weight: 600;">Private Entity</p>
                <p class="default" style="font-size: 13px; ">This entity is private</p>
              </div>
            </div>
          </div>
         <div v-else-if="selectedSector.orgData && selectedSector.parent === 'Organization'">
           <RouterLink
               v-if="((selectedSector.orgData?.visibility == 1 || selectedSector.orgData?.visibility == 4) || isOrgAvailable) || userData.is_superuser"
               class="text-decoration-none "
               :to="{name: 'organization-data', params: { slug: selectedSector.orgData?.uid }}">
             <div
                 class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
             >
               <VImg
                   style="border-radius: 8px; flex: none;"
                   cover
                   height="40px"
                   width="40px"
                   :src="selectedSector.orgData.image ? `${baseURL}${<string>selectedSector.orgData?.image}` : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
               />
               <div class="ml-2">
                 <p class="default" style="font-size: 15px; font-weight: 600;">{{ selectedSector.orgData?.name }} ({{ selectedSector.orgData?.acronym }})</p>
                 <p class="default" style="font-size: 13px; ">{{ selectedSector.orgData?.president }}</p>
               </div>
             </div>
           </RouterLink>
           <div
               v-else
               class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
           >
             <VImg
                 style="border-radius: 8px; flex: none;"
                 cover
                 height="40px"
                 width="40px"
                 :src="'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
             />
             <div class="ml-2">
               <p class="default" style="font-size: 15px; font-weight: 600;">Private Entity</p>
               <p class="default" style="font-size: 13px; ">This entity is private</p>
             </div>
           </div>
         </div>
          <div v-else>
            <RouterLink
                v-for="org in selectedOrgs"
                v-if="selectedOrgs.length > 0"
                class="text-decoration-none "
                :to="{name: 'organization-data', params: { slug: org.uid }}">
              <div
                  class="d-flex align-center my-1 pa-1 cursor-pointer repo-item"
              >
                <VImg
                    style="border-radius: 8px; flex: none;"
                    cover
                    height="40px"
                    width="40px"
                    :src="org.image ? `${<string>org.image}` : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
                />
                <div class="ml-2">
                  <p class="default" style="font-size: 15px; font-weight: 600;">{{ org.name }} ({{ org.acronym }})</p>
                  <p class="default" style="font-size: 13px; ">{{ org.president }}</p>
                </div>
              </div>
            </RouterLink>
            <p v-else class="my-1  d-flex align-center justify-center">
              <PhInfo size="19" class="mr-1 mb-1"/>  No organizations found
            </p>
          </div>
        </div>
        <div class="my-3">
          <p class="section-title mb-2">Tags</p>
          <VChip
              v-for="tag in selectedSector.tags"
              class="tag-chips my-1 mr-1"
              variant="outlined"
              :key="tag"
              :value="tag">
            {{tag}}
          </VChip>
        </div>
        <div v-if="selectedSector.parent != 'Province' && selectedSector.additional_info && selectedSector.additional_info.trim().length > 0" class="my-3">
          <p class="section-title mb-2">Additional Info</p>
          <div class="ql-snow">
            <div v-html="selectedSector.additional_info" class="ql-editor"></div>
          </div>
        </div>
      </div>
    </div>
  </VSheet>
</template>

<style scoped>
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
  }

  .repo-item{
    border-radius: 8px;
  }
  .repo-item:hover{
    background-color: #F0F5F9;
    transition: background-color 0.3s ease;
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
    font-size: 20px;
    font-weight: 700;
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

  .action-button{
    font-size: 14px;
    border-radius: 8px;
    padding: 10px;
    border: 2px solid #e6e6e6 !important;
  }

  .action-button:hover{
    background-color: #F0F5F9;
  }

  .action-menu-item{
    padding: 10px 15px !important;
    font-size: 14px;
    display: flex;
    align-items: center !important;
    gap: 10px !important;
  }

  .action-menu-item:hover{
    background-color: #e0e3e3;
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
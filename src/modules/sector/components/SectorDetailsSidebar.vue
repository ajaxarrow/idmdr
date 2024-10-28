<script setup lang="ts">
  import {repositories} from "../../../data/repository.ts";
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

  const {user, userData} = useUserStore()
  const {selectedSector, removeSelectedSector, title, allSectors} = useSectorsStore();
  const {deleteSector, fetchSectors} = useSectorServices()
  const {showSnackbarMessage} = useSnackbarStore();
  const {resetToDefault, setupBoundaries, removeBoundaries} = useMapStore();

  const sectorActionMenu = ref(false);
  const loading = ref(false)
  const getRepositoriesBySector = (sector: string): Repository[] | null => {
    const foundRepositories = repositories.filter(repository => repository.sectors?.includes(sector));
    return foundRepositories.length > 0 ? foundRepositories : null;
  }

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

  watch(()=> selectedSector.value, () => {
    if (selectedSector.value?.parent === 'Repository' && selectedSector.value) {
      // @ts-ignore
      selectedSector.value.repoData = selectedSector.value?.parent_obj
    } else if (selectedSector.value?.parent === 'Organization' && selectedSector.value) {
      // @ts-ignore
      selectedSector.value.orgData = selectedSector.value?.parent_obj
    }
  })

  onMounted(() => {
    removeSelectedSector();
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
    <div class="">
      <VImg
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
          <VMenu v-if="user && userData?.uid === selectedSector?.owner_id" v-model="sectorActionMenu" :close-on-content-click="false">
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
        </VRow>        <p class="sector-title">{{selectedSector.name}}</p>
        <div class="ql-snow">
          <div v-html="selectedSector.description" class="ql-editor sector-description"></div>
        </div>
        <div class="my-3">
          <p class="section-title mb-2">Tagged Entity</p>
          <RouterLink
              v-if="selectedSector.repoData && selectedSector.parent === 'Repository'"
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
                  :src="selectedSector.repoData.image ? <string>selectedSector.repoData?.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
              />
              <div class="ml-2">
                <p class="default" style="font-size: 15px; font-weight: 600;">{{ selectedSector.repoData?.title }}</p>
                <p class="default" style="font-size: 13px; ">{{ selectedSector.repoData?.owner_data?.email }}</p>
              </div>
            </div>
          </RouterLink>
          <RouterLink
              v-if="selectedSector.orgData && selectedSector.parent === 'Organization'"
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
                  :src="selectedSector.orgData.image ? <string>selectedSector.orgData?.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
              />
              <div class="ml-2">
                <p class="default" style="font-size: 15px; font-weight: 600;">{{ selectedSector.orgData?.name }} ({{ selectedSector.orgData?.acronym }})</p>
                <p class="default" style="font-size: 13px; ">{{ selectedSector.orgData?.president }}</p>
              </div>
            </div>
          </RouterLink>
<!--          <RouterLink-->
<!--              class="text-decoration-none"-->
<!--              v-if="getRepositoriesBySector(selectedSector.slug as string)"-->
<!--              v-for="repository in getRepositoriesBySector(selectedSector.slug as string)"-->
<!--              :to="{name: 'repository-data', params: { slug: repository.slug  }}">-->
<!--            <div-->
<!--                class="d-flex align-center my-1 cursor-pointer"-->
<!--            >-->
<!--              <VImg-->
<!--                  style="border-radius: 8px"-->
<!--                  cover-->
<!--                  height="40px"-->
<!--                  width="40px"-->
<!--                  :src="repository.image ? <string>repository.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"-->
<!--              />-->
<!--              <div class="ml-2">-->
<!--                <p class="default">{{ repository.title }}</p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </RouterLink>-->
<!--          <p v-else class="my-1  d-flex align-center">-->
<!--            <PhInfo size="19" class="mr-1 mb-1"/>  No repositories found-->
<!--          </p>-->
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

  .scrollable-container{
    overflow-y: auto;
    height: 450px;
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
</style>
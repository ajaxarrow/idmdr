<script setup lang="ts">
import {
  PhFactory, PhFileArrowUp,
  PhGlobe, PhHouse, PhPlusCircle, PhSliders, PhUsersThree,
} from "@phosphor-icons/vue";

  import Logo from "../../../core/components/Logo.vue";
import {ref, computed, defineComponent, markRaw, onMounted, watch} from 'vue';
  import MapProvincesHeader from "./Provinces/MapProvincesHeader.vue";
  import MapSectorsHeader from "./Sectors/MapSectorsHeader.vue";
  import MapProvincesMainContent from "./Provinces/MapProvincesMainContent.vue";
  import MapSectorsMainContent from "./Sectors/MapSectorsMainContent.vue";
import MapFiltersHeader from "./Filters/MapFiltersHeader.vue";
import MapFiltersMainContent from "./Filters/MapFiltersMainContent.vue";
import MapOrganizationsHeader from "./Organizations/MapOrganizationsHeader.vue";
import MapOrganizationsMainContent from "./Organizations/MapOrganizationsMainContent.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import SectorTaggingGuideDialog from "../../sector/components/SectorTaggingGuideDialog.vue";
import {useSectorMapStore} from "../../../core/stores/sector-map.store.ts";
import ConfirmGeoJSONDialog from "../../../core/components/ConfirmGeoJSONDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

  type CustomComponent = ReturnType<typeof defineComponent>;


  const {user} = useUserStore()
  const {router} = useRouting();
  const {storedGeoJSON, handleGeoJSON, confirmDialog, fileName} = useSectorMapStore();
  const addSectorDialogMenu = ref(false);
  const showAdditionalContent = ref(false);
  const header = ref<CustomComponent | null>(null);
  const mainContent = ref<CustomComponent | null>(null);
  const activeNav = ref('');

  const sidebarStyle = computed(() => {
    if(showAdditionalContent.value){
      return{width: '350px !important'}
    } else {
      return{width: '85px !important'}
    }
  })
  const navLinks = [
    {
      name: 'Provinces',
      icon: markRaw(PhGlobe),
      header: markRaw(MapProvincesHeader),
      mainContent: markRaw(MapProvincesMainContent)
    },
    {
      name: 'Sectors',
      icon: markRaw(PhFactory),
      header: markRaw(MapSectorsHeader),
      mainContent: markRaw(MapSectorsMainContent)
    },
    {
      name: 'CMIs',
      icon: markRaw(PhUsersThree),
      header: markRaw(MapOrganizationsHeader),
      mainContent: markRaw(MapOrganizationsMainContent)
    },
    {
      name: 'Filters',
      icon: markRaw(PhSliders),
      header: markRaw(MapFiltersHeader),
      mainContent: markRaw(MapFiltersMainContent)
    },
  ];


  const assignContent = (headerComponent: CustomComponent, mainContentComponent: CustomComponent, activeNavTitle: string) => {
    if (activeNav.value === activeNavTitle) {
      showAdditionalContent.value = false;
      activeNav.value = '';
      header.value = null;
      mainContent.value = null;
      return;
    }
    showAdditionalContent.value = true;
    activeNav.value = activeNavTitle;
    header.value = headerComponent;
    mainContent.value = mainContentComponent;
  };


  const confirmCallback = () => {
    router.push({name: 'new-sector'});
  }

  const cancelCallback = () => {
    storedGeoJSON.value = {};
    fileName.value = '';
    setTimeout(() => {
      confirmDialog.value = false
    }, 100);
  }

  watch(()=> storedGeoJSON.value, () => {
    if(Object.keys(storedGeoJSON.value).length !== 0){
      confirmDialog.value = true
    }
  })

  onMounted(() => {
    confirmDialog.value = false
  })



</script>

<template>
  <ConfirmGeoJSONDialog
    @cancelCallback="cancelCallback"
    @confirmCallback="confirmCallback"
  />
  <VSheet class="sidebar ma-4 d-flex flex-column justify-start" rounded="xl" v-bind:style="sidebarStyle">
   <div class="d-flex">
     <div class="sidebar-main-container d-flex flex-column">
       <div class="sidebar-header">
         <VRow justify="center" align="center" class="mt-5 mb-4">
           <Logo :useAltDesign="true"/>
         </VRow>
       </div>
       <VDivider/>
       <div class="mt-2">
         <VList>
           <VRow v-if="user" class="ma-0 justify-center mt-2 mb-4">
             <VMenu v-model="addSectorDialogMenu" :close-on-content-click="false">
               <template #activator="{ props }">
                 <PhPlusCircle
                     class="cursor-pointer add-sector-button"
                     v-bind="props"
                     weight="fill"
                     size="62"
                 />
               </template>

               <VSheet width="220" height="140" class="add-sector-menu">
                 <p class="text-center font-weight-bold pa-2 add-sector-menu-title">Add New Sector</p>
                 <VDivider />
                 <div class="pa-2">
                   <label for="dropzoneFileGeoJSON" class="add-sector-menu-item cursor-pointer d-flex align-center my-2">
                     <PhFileArrowUp
                         class="mb-1 mr-1"
                         color="#3291C7"
                         weight="fill"
                         size="14"
                     />
                     Import GeoJson
                   </label>
                   <VFileInput id="dropzoneFileGeoJSON" style="display: none" @change="handleGeoJSON" accept="application/json" />
                   <SectorTaggingGuideDialog />
                 </div>
               </VSheet>
             </VMenu>


           </VRow>
           <VListItem
               :class="{'active-nav': activeNav === navLink.name}"
               v-for="navLink in navLinks"
               variant="plain"
               class="nav-item cursor-pointer navigation-item "
               @click="assignContent(navLink.header, navLink.mainContent, navLink.name)"
           >
             <div class="d-flex flex-column justify-center align-center">
               <component :is="navLink.icon" size="24" class="icon"  />
               {{navLink.name}}
             </div>
           </VListItem>
         </VList>
       </div>
       <VSpacer/>
       <VDivider/>
       <div class="">
         <VList class="bottom-nav">
           <VListItem
               to="/dashboard"
               link
               class="nav-item navigation-item"
           >
             <div class="d-flex flex-column align-center">
               <PhHouse size="24" class="icon" />
               Dashboard
             </div>
           </VListItem>
         </VList>
       </div>
     </div>
     <VDivider v-if="showAdditionalContent" :vertical="true" />
     <div v-if="showAdditionalContent" class="sidebar-additional-content overflow-hidden">
       <div class="sidebar-header pa-5">
         <component :is="header"/>
       </div>
       <VDivider/>
       <div class="pa-5 scrollable-container">
         <component :is="mainContent"/>
       </div>
     </div>
   </div>
  </VSheet>
</template>

<style scoped>
.scrollable-container{
  overflow-y: auto;
  height: 80vh;
}
.add-sector-menu{
  border-radius: 15px !important;
  box-shadow: 0px 4px 10px 0px #5d6e87;
}
.add-sector-button{
  color: #3291C7;
}
.add-sector-button:hover{
  border-radius: 50% !important;
  color: #28749F;
}

.add-sector-menu-title{
  font-size: 14px;
  font-weight: 700;
}

.add-sector-menu-item{
  border-radius: 8px;
  padding: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
}

.add-sector-menu-item:hover{
  background-color: #e0e3e3;
}

.v-row{
  flex: unset;
}
.sidebar{
  overflow: hidden;
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 95vh;
  transition: width 0.2s;
  box-shadow: 0px 0px 7px 0px #5d6e87;
}

.sidebar-main-container{
  height: 95vh;
  width: 85px !important;
}

.sidebar-additional-content{
  height: 95vh;
  width: 275px !important;
}

.sidebar-header{
  height: 87px;
}

.nav-item{
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  height: 70px;
}

.active-nav{
  background-color: #F0F5F9;
  border-right: 3px solid #3291C7;
}

.bottom-nav{
  border-bottom-right-radius: 25px;
  border-bottom-left-radius: 25px;
}
.v-list-item--active{
  background-color: #F0F5F9 !important;
  border-right: 3px solid #3291C7;
}

:deep(.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line){
  padding: unset;
}

.v-list-item--variant-plain {
  opacity: 1;
}


.icon{
  color: #191919 !important;
}
</style>
<script setup lang="ts">
import {
  PhFactory, PhFileArrowUp,
  PhGlobe, PhGrains, PhHouse, PhPlusCircle, PhPolygon, PhSliders,
} from "@phosphor-icons/vue";

  import Logo from "../Global/Logo.vue";
  import {ref, computed, defineComponent, markRaw} from 'vue';
  import MapProvincesHeader from "./Provinces/MapProvincesHeader.vue";
  import MapSectorsHeader from "./Sectors/MapSectorsHeader.vue";
  import MapProvincesMainContent from "./Provinces/MapProvincesMainContent.vue";
  import MapSectorsMainContent from "./Sectors/MapSectorsMainContent.vue";

  type CustomComponent = ReturnType<typeof defineComponent>;

  const props = defineProps({
    useSectorDesign: {
      type: Boolean,
      default: false,
    },
  });

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
      name: 'Production',
      icon: markRaw(PhGrains),
      header: markRaw(PhGrains),
      mainContent: markRaw(PhGrains)
    },
    {
      name: 'Filters',
      icon: markRaw(PhSliders),
      header: markRaw(PhSliders),
      mainContent: markRaw(PhSliders)
    },
  ];

  const filteredNavLinks = computed(() => {
    if (props.useSectorDesign) {
      return navLinks.filter(link => link.name !== 'Provinces');
    } else {
      return navLinks;
    }
  });


  const assignContent = (headerComponent: CustomComponent, mainContentComponent: CustomComponent, activeNavTitle: string) => {
    if (activeNav.value === activeNavTitle) {
      console.log('same')
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

</script>

<template>
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
           <VRow v-if="props.useSectorDesign" class="ma-0 justify-center mt-2 mb-4">
             <VMenu v-model="addSectorDialogMenu">
               <template #activator="{ props }">
                 <PhPlusCircle
                     class="cursor-pointer"
                     v-bind="props" weight="fill" size="62" color="#3291C7" />
               </template>
               <VSheet width="175" height="120" class="add-sector-menu">
                 <p class="text-center font-weight-bold pa-2 add-sector-menu-title">Add New Sector</p>
                 <VDivider/>
                 <div class="pa-2">
                   <p class="add-sector-menu-item cursor-pointer d-flex align-center my-2">
                     <PhFileArrowUp
                       class="mb-1 mr-1"
                       color="#3291C7"
                       weight="fill"
                       size="14"
                     />
                     Import GeoJson
                   </p>
                   <p class="add-sector-menu-item cursor-pointer d-flex align-center my-2">
                   <PhPolygon
                       class="mr-1"
                       color="#3291C7"
                       weight="fill"
                       size="14"
                     />
                     Draw Boundary from Map
                   </p>
                 </div>
               </VSheet>
             </VMenu>

           </VRow>
           <VListItem
               :class="{'active-nav': activeNav === navLink.name}"
               v-for="navLink in filteredNavLinks"
               variant="plain"
               class="nav-item cursor-pointer"
               @click="assignContent(navLink.header, navLink.mainContent, navLink.name)"
           >
             <div class="d-flex flex-column justify-center align-center">
               <component :is="navLink.icon" size="24" class="icon" />
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
               class="nav-item"
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
     <div v-if="showAdditionalContent" class="sidebar-additional-content">
       <div class="sidebar-header pa-5">
         <component :is="header"/>
       </div>
       <VDivider/>
       <div class="pa-5">
         <component :is="mainContent"/>
       </div>
     </div>
   </div>
  </VSheet>
</template>

<style scoped>

.add-sector-menu{
  border-radius: 15px !important;
  box-shadow: 0px 4px 10px 0px #5d6e87;
}

.add-sector-menu-title{
  font-size: 14px;
  font-weight: 700;
}

.add-sector-menu-item{
  font-size: 12px;
  font-weight: 500;
  color: #000000;
}

.v-row{
  flex: unset;
}
.sidebar{
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 95vh;
  transition: width 0.2s;
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
<script setup lang="ts">
  import {
    PhFactory,
    PhGlobe, PhGrains,
    PhQuestion,PhSliders,
  } from "@phosphor-icons/vue";

  import Logo from "../Global/Logo.vue";
  import {ref, computed, defineComponent, markRaw} from 'vue';
  import MapProvincesHeader from "./Provinces/MapProvincesHeader.vue";
  import MapSectorsHeader from "./Sectors/MapSectorsHeader.vue";

  type HeaderComponent = ReturnType<typeof defineComponent>;
  type MainContentComponent = ReturnType<typeof defineComponent>;

  const showAdditionalContent = ref(false);
  const header = ref<HeaderComponent | null>(null);
  const mainContent = ref<MainContentComponent | null>(null);
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
      mainContent: markRaw(PhGlobe)
    },
    {
      name: 'Sectors',
      icon: markRaw(PhFactory),
      header: markRaw(MapSectorsHeader),
      mainContent: markRaw(PhFactory)
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

  const assignContent = (headerComponent: HeaderComponent, mainContentComponent: MainContentComponent, activeNavTitle: string) => {
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
           <VListItem
               :class="{'active-nav': activeNav === navLink.name}"
               v-for="navLink in navLinks"
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
               to="/help"
               link
               class="nav-item"
           >
             <div class="d-flex flex-column align-center">
               <PhQuestion size="24" class="icon" />
               Help Center
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
       <div>
         <component :is="mainContent"/>
       </div>
     </div>
   </div>
  </VSheet>
</template>

<style scoped>
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
  box-shadow: 0px 0px 7px 0px #5d6e87;
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
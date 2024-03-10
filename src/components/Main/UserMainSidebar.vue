<script setup lang="ts">
  import Logo from "../Global/Logo.vue";
  import {
    PhCloud,
    PhGearSix,
    PhHouse,
    PhMapPinLine,
    PhQuestion,
    PhSignOut,
    PhTag
  } from "@phosphor-icons/vue";
  import {useToggleMainSidebar} from "../../composables/useToggleMainSidebar.ts";
  import UserMainSidebarCollapsed from "./UserMainSidebarCollapsed.vue";

  const {isCollapsed} = useToggleMainSidebar();


  const navLinks = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      icon: PhHouse
    },
    {
      name: 'Repositories',
      link: '/repositories',
      icon: PhCloud
    },
    {
      name: 'Sector Tagging',
      link: '/sectors',
      icon: PhTag
    },
    {
      name: 'Map',
      link: '/map',
      icon: PhMapPinLine
    },
    {
      name: 'Settings',
      link: '/settings',
      icon: PhGearSix
    },
    {
      name: 'Signout',
      link: '/signout',
      icon: PhSignOut
    }
  ]
</script>

<template>
  <VExpandXTransition>
    <UserMainSidebarCollapsed v-if="isCollapsed"/>
    <VSheet v-else class="sidebar d-flex flex-column justify-start ma-4" rounded="xl">
      <VRow justify="center" class="mt-5 mb-4">
        <Logo/>
      </VRow>
      <VDivider/>
      <div class="px-6 pt-2">
        <VList>
          <VListItem
              v-for="navLink in navLinks"
              :to="navLink.link"
              link
              class="my-2 nav-border nav-item"
          >
            <div class="d-flex align-center">
              <component :is="navLink.icon" size="20" weight="fill" class="mr-2 icon" />
              {{navLink.name}}
            </div>
          </VListItem>
        </VList>
      </div>
      <VSpacer/>
      <VDivider/>
      <div class="px-6 pt-2">
        <VList>
          <VListItem
              to="/help"
              link
              class="my-1 nav-border nav-item"
          >
            <div class="d-flex align-center">
              <PhQuestion size="20" weight="fill" class="mr-2 icon" />
              Help Center
            </div>
          </VListItem>
        </VList>
      </div>
    </VSheet>
  </VExpandXTransition>

</template>

<style scoped>
  .v-row{
    flex: unset;
  }
  .sidebar{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 300px;
    box-shadow: 0px 0px 7px 0px #5d6e87;
    height: 95vh;
  }


  .nav-border{
    border-radius: 15px;
    border: 2px solid #EBF4F9;
  }

  .nav-item{
    font-size: 14px;
    font-weight: 500;
  }

  .v-list-item--active{
    background-color: #23668B;
    color: #F0FAFF;
  }

  .v-list-item--active >>> .icon {
    color: #F0FAFF !important;
  }

  .icon{
    color: #8C8C8C !important;
  }
</style>
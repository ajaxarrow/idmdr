<script setup lang="ts">
import Logo from "../Global/Logo.vue";
import {PhCloud, PhGearSix, PhHouse, PhMapPinLine, PhSignOut, PhTag} from "@phosphor-icons/vue";

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
  <VSheet class="sidebar ma-4" border="2" rounded="xl">
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
        >
          <div class="d-flex align-center">
            <component :is="navLink.icon" size="20" weight="fill" class="mr-2" color="#8C8C8C"/>
            {{navLink.name}}
          </div>
        </VListItem>
      </VList>
    </div>
  </VSheet>
</template>

<style scoped>
  .sidebar{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 300px;
    height: 95vh;
  }
</style>
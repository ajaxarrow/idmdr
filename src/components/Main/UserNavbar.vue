<script setup lang="ts">
import {PhBell, PhList, PhMagnifyingGlass} from "@phosphor-icons/vue";
import {useScreenStore} from "../../stores/screenSizeStore.ts";
import {useToggleMenu} from "../../composables/useToggleMenu.ts";
import {useToggleMainSidebar} from "../../composables/useToggleMainSidebar.ts";
const {isSmall} = useScreenStore();
const {activeIcon, toggleMenu} = useToggleMenu();
const {toggleMainSidebar} = useToggleMainSidebar();


</script>

<template>
  <VAppBar elevation="0" rounded="xl" class="ma-4 user-nav" style="left: unset !important;">
    <VContainer fluid class="mx-3">
      <VRow align="center">
        <VCol cols="auto">
          <VAppBarTitle >
            <div class="d-flex align-center">
              <PhList size="24" weight="bold" class="mr-2 cursor-pointer" @click="toggleMainSidebar" />
              <p class="text-nav-title">Dashboard</p>
            </div>
          </VAppBarTitle>
        </VCol>
        <VSpacer/>
        <VCol cols="auto">
          <transition name="flip" mode="out-in" v-if="isSmall">
            <component :is="activeIcon" @click="toggleMenu" class="cursor-pointer" />
          </transition>
          <VRow align="center" v-else>
            <p class="text-org d-flex align-center mx-2">
              My Organization
              <PhCaretDown size="18" class="ml-2"/>
            </p>
            <PhMagnifyingGlass size="24" class="mx-4"/>
            <PhBell size="24"/>
            <VDivider class="mx-4 my-1" vertical/>
            <div class="mr-2">
              <p class="text-name text-container">Jiu Axl Tabilla</p>
              <p class="text-right text-name-subtitle">Coordinator</p>
            </div>
            <VAvatar
                size="45"
                class="ml-1 cursor-pointer"
            >
              <VImg src="https://mighty.tools/mockmind-api/content/abstract/46.jpg"></VImg>
              <VTooltip
                  activator="parent"
                  location="bottom"
              >Account</VTooltip>
            </VAvatar>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VAppBar>
</template>

<style scoped>
  .text-nav-title{
    font-size: 18px !important;
    font-weight: 800 !important;
  }

  .text-name{
    font-size: 16px !important;
    font-weight: 800 !important;
  }

  .text-name-subtitle{
    font-size: 12px !important;
    font-weight: 500 !important;
    line-height: 0.25;
  }

  .text-org{
    font-weight: 600;
  }

  .user-nav{
    width: 76vw !important;
    right: 0 !important;
    box-shadow: 0px 0px 5px 0px #5d6e87 !important;
  }

  @keyframes flip {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .flip-enter-active,
  .flip-leave-active {
    animation: flip 0.15s;
  }

  .flip-enter-from,
  .flip-leave-to {
    transform: rotate(0deg);
  }

  .flip-enter-to,
  .flip-leave-from {
    transform: rotate(360deg);
  }


</style>
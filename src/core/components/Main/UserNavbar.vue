<script setup lang="ts">
import {PhBell, PhCaretDown, PhList, PhMagnifyingGlass} from "@phosphor-icons/vue";
import {useScreenStore} from "../../stores/screen-size.store.ts";
import {IconMenuDeep} from "@tabler/icons-vue";
import {useToggleSidebar} from "../../composables/useToggleSidebar.ts";
import {computed} from "vue";
import {useUserStore} from "../../stores/user.store.ts";
const {isSmall, isMobile, isLargePhone} = useScreenStore();
const {toggleSidebar, isCollapsed, toggleProfileSidebar} = useToggleSidebar();
const {userData} = useUserStore();
const props = defineProps({
  title: {
    type: String,
    default: 'IDMDR',
  },
});

const appBarWidthStyle = computed(() => {
  if(isMobile.value || isLargePhone.value){
    return {width: '95%', }
  } else {
    return isCollapsed.value ? { width: `calc(100vw - 140px)` } : { width: `calc(100vw - 360px)` };
  }
});


</script>

<template>
  <VAppBar elevation="0" rounded="xl" class="ma-4 user-nav" style="left: unset !important; z-index: 30 !important;" v-bind:style="appBarWidthStyle">
    <VContainer fluid class="mx-3">
      <VRow align="center">
        <VCol cols="auto">
          <VAppBarTitle >
            <div class="d-flex align-center">
              <PhList size="24" weight="bold" class="mr-2 cursor-pointer" @click="toggleSidebar" />
              <p class="text-nav-title">{{props.title}}</p>
            </div>
          </VAppBarTitle>
        </VCol>
        <VSpacer/>
        <VCol cols="auto">
          <transition name="flip" mode="out-in" v-if="isSmall">
            <IconMenuDeep @click="toggleProfileSidebar" class="cursor-pointer" />
          </transition>
          <VRow align="center" v-else>
<!--            <p class="text-org d-flex align-center mx-2">-->
<!--              My Organization-->
<!--              <PhCaretDown size="18" class="ml-2"/>-->
<!--            </p>-->
<!--            <PhMagnifyingGlass size="24" class="mx-4"/>-->
            <RouterLink :to="{name: 'notifications'}" class="text-decoration-none">
              <VBadge color="#b00020" dot><PhBell size="24" class="icon-bell"/></VBadge>
            </RouterLink>
            <VDivider class="mx-4 my-1" vertical/>
            <div class="mr-2">
              <p class="text-name text-container mb-1">{{userData.username}}</p>
              <p class="text-right text-name-subtitle">{{ userData.email }}</p>
            </div>
            <VAvatar
                size="45"
                class="ml-1 cursor-pointer"
            >
              <VImg :src="userData.profilePicture"></VImg>
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
  .icon-bell{
    border-radius: 50%;
  }
  .icon-bell:hover{
    background-color: #e4e4e4;
  }
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
    right: 0 !important;
    box-shadow: 0px 0px 5px 0px #d5ddec !important;
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
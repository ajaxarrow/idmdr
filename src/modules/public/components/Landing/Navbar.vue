<script setup lang="ts">
  import {useScreenStore} from "../../../../core/stores/screen-size.store.ts";
  import Logo from "../../../../core/components/Logo.vue";
  import {useToggleMenu} from "../../../../core/composables/useToggleMenu.ts";
  import {useRouting} from "../../../../core/composables/useRouting.ts";
  import {useUserStore} from "../../../../core/stores/user.store.ts";

  const {activeIcon, isMenuToggled, toggleMenu} = useToggleMenu();
  const {isSmall} = useScreenStore();
  const {route} = useRouting();
  const {user} = useUserStore();

  const baseNavLinks = [
    {
      title: 'About',
      link: '/about'
    },
    {
      title: 'Stakeholders',
      link: '/stakeholders'
    },
    // {
    //   title: 'News & Updates',
    //   link: '/news-updates',
    // },
    {
      title: 'Help Center',
      link: '/help'
    },
    {
      title: 'Contact',
      link: '/contact'
    },
  ];

  // const navLinks = computed(() => {
  //   if (!isSmall.value) return baseNavLinks;
  //   return [
  //     ...baseNavLinks,
  //
  //   ];
  // });
  //
  // const authLinks = [
  //   {
  //     title: 'Login',
  //     link: '/auth?tab=login'
  //   },
  //   {
  //     title: 'Register',
  //     link: '/auth?tab=register'
  //   }
  // ]




</script>

<template>
    <VAppBar class="app-bar-blur px-2 px-lg-10" elevation="0">
      <VContainer fluid>
        <VRow align="center" class="ma-0">
          <VRow align="center" class="ma-0">
            <Logo/>
            <VRow class="ma-0 mx-5"  v-if="!isSmall">
              <VListItem
                  v-for="(navLink, index) in baseNavLinks" :key="index"
                  class="nav-item"
                  active-class="active-nav active-text"
                  :to="navLink.link"
                  :title="navLink.title"
                  color="primary"
                  link
                  rounded="lg"
              />
            </VRow>
          </VRow>
          <VSpacer v-if="isSmall"/>
          <VCol cols="auto" v-if="isSmall">
            <transition name="flip" mode="out-in">
              <component :is="activeIcon" @click="toggleMenu" class="cursor-pointer" />
            </transition>
          </VCol>
          <VRow v-else class="ma-0" justify="end">
            <div v-if="user">
              <VBtn
                  variant="text"
                  class="text-none mx-1 font-weight-medium"
                  :to="{ name: 'signout'}"
              >
                Signout
              </VBtn>
              <VBtn
                  variant="elevated"
                  color="bs50"
                  class="text-none mx-1 font-weight-medium"
                  :to="{ name: 'dashboard' }"
              >
                Dashboard
              </VBtn>
            </div>
            <div v-else>
              <VBtn
                  variant="text"
                  class="text-none mx-1 font-weight-medium"
                  :to="{ path: 'auth', query: { tab: 'login' } }"
              >
                Login
              </VBtn>
              <VBtn
                  variant="elevated"
                  color="bs50"
                  class="text-none mx-1 font-weight-medium"
                  :to="{ path: 'auth', query: { tab: 'register' } }"
              >
                Register
              </VBtn>
            </div>
          </VRow>
        </VRow>
      </VContainer>
    </VAppBar>
    <VMain>
      <VExpandTransition>
        <div v-if="isMenuToggled" class="px-lg-10 px-xl-10 mx-5 pt-5">
          <RouterLink
            :to="baseNavLink.link"
            class="text-decoration-none"
            v-for="baseNavLink in baseNavLinks"
            :key="baseNavLink.title">
            <div class="mx-1 my-3">
              <p :class="{'menu-link-active': route.path === baseNavLink.link}" class="menu-link">{{ baseNavLink.title }}</p>
              <VDivider class="my-2"/>
            </div>
          </RouterLink>
         <div v-if="user">
           <VBtnPrimaryAlt
               color="bs50"
               width="98%"
               class="submit-button my-1 mt-5"
               :to="{ path: 'dashboard' }"
           >
             Dashboard
           </VBtnPrimaryAlt>
           <VBtnPrimaryAlt
               color="bs50"
               width="98%"
               variant="outlined"
               class="button-outline my-1"
               :to="{ name: 'signout'}"
           >
             Signout
           </VBtnPrimaryAlt>
         </div>
          <div v-else>
            <VBtnPrimaryAlt
                color="bs50"
                width="98%"
                class="submit-button my-1 mt-5"
                :to="{ path: 'auth', query: { tab: 'register' } }"
            >
              Register
            </VBtnPrimaryAlt>
            <VBtnPrimaryAlt
                color="bs50"
                width="98%"
                variant="outlined"
                class="button-outline my-1"
                :to="{ path: 'auth', query: { tab: 'login' } }"
            >
              Login
            </VBtnPrimaryAlt>
          </div>
        </div>
        <div v-else>
          <slot/>
        </div>
      </VExpandTransition>
    </VMain>
</template>

<style scoped>
  .menu-link{
    color: black;
    font-size: 18px;
    font-weight: 500;
  }

  .menu-link-active{
    color: #23668b;
  }

  .app-bar-blur {
    backdrop-filter: blur(100px);
    border-bottom: 1px solid #E4E4E4;
  }

  .nav-item:hover{
    color: black !important;
  }

  .button-outline{
    border-width: 2px;
  }

  .active-nav {
    background-color: transparent;
    color: transparent !important;
  }

  .active-text{
    color: black !important;
  }

  .v-list-item{
    color: #5F6061;
  }

  .v-list-item--variant-text{
    background: none !important;
  }

  .v-btn--variant-outlined{
    background: #fff !important;
  }

  :deep(.v-list-item__overlay){
    background-color: transparent !important;
    font-weight: 900 !important;
  }

  :deep(.v-list-item-title){
    font-size: 14px;
  }

  .v-list-item--variant-text .v-list-item__overlay{
    background: none !important;
  }


  :deep(.v-list-item--active .v-list-item-title) {
    font-weight: 400 !important;
  }

  :deep(.v-list-item-title):hover {
    font-weight: 400 !important;
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
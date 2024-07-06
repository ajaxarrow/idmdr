<script setup lang="ts">
  import {computed} from "vue";
  import {useScreenStore} from "../../../../core/stores/screen-size.store.ts";
  import Logo from "../../../../core/components/Logo.vue";
  import {useToggleMenu} from "../../../../core/composables/useToggleMenu.ts";

  const {activeIcon, isMenuToggled, toggleMenu} = useToggleMenu();
  const {isSmall} = useScreenStore();


  const baseNavLinks = [
    // {
    //   title: 'Home',
    //   link: '/'
    // },
    {
      title: 'About',
      link: '/about'
    },
    {
      title: 'Stakeholders',
      link: '/about'
    },
    {
      title: 'News & Updates',
      link: '/news-updates',
    },
    {
      title: 'Help Center',
      link: '/contact'
    },
    {
      title: 'Contact',
      link: '/contact'
    },
  ];

  const navLinks = computed(() => {
    if (!isSmall.value) return baseNavLinks;

    return [
      ...baseNavLinks,
      {
        title: 'Login',
        link: '/auth?tab=login'
      },
      {
        title: 'Register',
        link: '/auth?tab=register'
      }
    ];
  });




</script>

<template>
    <VAppBar class="bg-transparent landing-container app-bar-blur px-2 px-lg-10" elevation="0">
      <VContainer fluid>
        <VRow align="center" class="ma-0">
          <VRow align="center" class="ma-0">
            <Logo/>
            <VRow class="ma-0 mx-5"  v-if="!isSmall">
              <VListItem
                  v-for="(navLink, index) in navLinks" :key="index"
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
<!--            <VBtnPrimary-->
<!--                style="background: none !important;"-->
<!--                variant="outlined"-->
<!--                class="button-outline"-->
<!--                :to="{ path: 'auth', query: { tab: 'login' } }"-->
<!--            >-->
<!--              Login-->
<!--            </VBtnPrimary>-->
<!--            <VBtnPrimary :to="{ path: 'auth', query: { tab: 'register' } }" >Register</VBtnPrimary>-->
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
          </VRow>
        </VRow>
      </VContainer>
    </VAppBar>
    <VMain class="mx-lg-10 mx-xl-10">
      <VExpandTransition>
        <div v-if="isMenuToggled">
          <VList rounded="lg" class="bg-background border">
            <VListItem
                class="nav-item"
                v-for="(navLink, index) in navLinks" :key="index"
                active-class="active-nav active-text"
                :to="navLink.link"
                :title="navLink.title"
                color="primary"
                link
            />
          </VList>
        </div>
        <div v-else>
          <slot/>
        </div>
      </VExpandTransition>
    </VMain>


</template>

<style scoped>
  .app-bar-blur {
    backdrop-filter: blur(1000px);
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
    text-decoration: underline;
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
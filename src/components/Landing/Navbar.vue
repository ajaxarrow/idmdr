<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {IconMenuDeep, IconX} from "@tabler/icons-vue";
import {useScreenStore} from "../../stores/screenSizeStore.ts";
import Logo from "../Global/Logo.vue";

  const currentElevation = ref(0);
  const isMenuToggled = ref(false);

  const activeIcon = computed(() => (isMenuToggled.value ? IconX : IconMenuDeep));


  const toggleMenu = () => {
    isMenuToggled.value = !isMenuToggled.value
  }

  const {isSmall} = useScreenStore();

  const handleScroll = () => {
    currentElevation.value = window.scrollY > 0 ? 5 : 0;
  };

  const baseNavLinks = [
    {
      title: 'Home',
      link: '/'
    },
    {
      title: 'About',
      link: '/about'
    },
    {
      title: 'Contact',
      link: '/contact'
    }
  ];

  const navLinks = computed(() => {
    if (!isSmall.value) return baseNavLinks;

    return [
      ...baseNavLinks,
      {
        title: 'Login',
        link: '/auth'
      },
      {
        title: 'Register',
        link: '/auth'
      }
    ];
  });

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });


</script>

<template>
    <VAppBar class="bg-transparent px-lg-10 pt-2 app-bar-blur" :elevation="currentElevation">
      <VContainer fluid>
        <VRow align="center">
          <VCol cols="4">
            <VAppBarTitle >
              <Logo/>
            </VAppBarTitle>
          </VCol>
          <VSpacer v-if="isSmall"/>
          <VCol cols="4" class="mx-auto" v-if="!isSmall">
            <VRow justify="space-around">
              <VCol v-for="(navLink, index) in navLinks" :key="index" cols="auto">
                <VListItem
                    active-class="active-nav active-text"
                    :to="navLink.link"
                    :title="navLink.title"
                    color="primary"
                    link
                    rounded="lg"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="auto" v-if="isSmall">
            <transition name="flip" mode="out-in">
              <component :is="activeIcon" @click="toggleMenu" class="cursor-pointer" />
            </transition>

          </VCol>
          <VCol cols="4" v-else>
            <VRow justify="end">
              <VBtnPrimary
                variant="outlined"
                class="button-outline"
                :to="{ path: 'auth', query: { tab: 'signin' } }"
              >
                Login
              </VBtnPrimary>
              <VBtnPrimary :to="{ path: 'auth', query: { tab: 'register' } }" >Register</VBtnPrimary>
            </VRow>
          </VCol>
        </VRow>
      </VContainer>
    </VAppBar>
    <VMain class="mx-lg-10 mx-xl-10">
      <VExpandTransition>
        <div v-if="isMenuToggled">
          <VList rounded="lg" class="bg-background border">
            <VListItem
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
    backdrop-filter: blur(5px); /* Adjust the blur value as needed */
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

  :deep(.v-list-item__overlay){
    background-color: transparent !important;
    font-weight: 900 !important;
  }

  .v-list-item--variant-text .v-list-item__overlay{
    background: none !important;
  }

  .v-list-item--active >>> .v-list-item-title {
    font-weight: 500 !important;
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
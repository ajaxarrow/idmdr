<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {PhHardDrives} from "@phosphor-icons/vue";

  const currentElevation = ref(0);

  const handleScroll = () => {
    currentElevation.value = window.scrollY > 0 ? 5 : 0;
  };

  const navLinks = [
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
  ]

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });


</script>

<template>
  <VAppBar class="bg-transparent px-lg-10 pt-3" :elevation="currentElevation" >
    <VContainer fluid >
      <VRow align="center">
        <VCol cols="4">
          <VAppBarTitle class="text-logo">
            <div class="d-flex">
              <PhHardDrives size="30" weight="duotone" color="#3291C7"/>
              IDMDR
            </div>
          </VAppBarTitle>
        </VCol>
        <VCol cols="4" class="mx-auto">
          <VRow justify="space-around">
            <VCol
                v-for="(navLink, index) in navLinks" :key="index"
                cols="auto"
            >
              <VListItem
                  active-color="#000"
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
        <VCol cols="4">
          <VRow justify="end">
            <VBtnPrimary variant="outlined" class="button-outline">
              Login
            </VBtnPrimary>
            <VBtnPrimary>
              Register
            </VBtnPrimary>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VAppBar>
</template>

<style scoped>
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

  ::v-deep .v-list-item__overlay{
    background-color: transparent !important;
    font-weight: 900 !important;
  }

  .v-list-item--variant-text .v-list-item__overlay{
    background: none !important;
  }

  .v-list-item--active >>> .v-list-item-title {
    font-weight: 500 !important;
  }
</style>
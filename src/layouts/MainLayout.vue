<script setup lang="ts">
  import UserNavbar from "../components/Main/UserNavbar.vue";
  import UserMainSidebar from "../components/Main/UserMainSidebar.vue";
  import {useScreenStore} from "../stores/screenSizeStore.ts";
  import {computed, onMounted, watch} from "vue";
  import {useToggleSidebar} from "../composables/useToggleSidebar.ts";
  import UserProfileSidebar from "../components/Main/UserProfileSidebar.vue";
  import {useTitle} from '@vueuse/core'
  const props = defineProps({
    title: {
      type: String,
      default: 'IDMDR',
    },
  });

  const {isMobile, isLargePhone, isTablet} = useScreenStore();
  const {isCollapsed, toggleMainSidebar} = useToggleSidebar();
  const mainContentWidthStyle = computed(() => {
    if(isMobile.value || isLargePhone.value){
      return {width: '95%', }
    } else {
      return isCollapsed.value ? { width: `calc(100vw - 140px)` } : { width: `calc(100vw - 360px)` };
    }
  });

  watch(() => isTablet.value, () => {
    if(isTablet.value){
      toggleMainSidebar()
    }
  })

  onMounted(()=>{
    useTitle(props.title)
    if(isTablet.value){
      toggleMainSidebar()
    }
  })
</script>

<template>
  <VLayout>
    <VContainer fluid class="px-10">
      <UserNavbar :title="props.title"/>
      <UserProfileSidebar/>
      <UserMainSidebar v-if="isMobile || isLargePhone" :useMobileDesign="true"/>
      <UserMainSidebar v-else/>
      <VMain v-bind:style="mainContentWidthStyle" class="main-content-container ma-4" style="--v-layout-top: 0;">
        <slot/>
      </VMain>
    </VContainer>
  </VLayout>
</template>

<style scoped>
  .main-content-container{
    background: #fff;
    position: absolute;
    right: 0;
    top: 73px;
    min-height: 85vh;
    border-radius: 24px;
    box-shadow: 0px 0px 7px 0px #D5DDECFF;
    overflow: hidden;
  }
</style>
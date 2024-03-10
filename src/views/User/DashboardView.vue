<script setup lang="ts">

import UserNavbar from "../../components/Main/UserNavbar.vue";
import UserMainSidebar from "../../components/Main/UserMainSidebar.vue";
import {useScreenStore} from "../../stores/screenSizeStore.ts";

const {isMobile, isLargePhone} = useScreenStore();
</script>

<template>
  <VLayout>
    <VContainer fluid class="px-10">
      <UserNavbar title="Dashboard"/>
      <UserMainSidebar v-if="isMobile || isLargePhone" :useMobileDesign="true"/>
      <UserMainSidebar v-else/>
      <VMain style="margin-left: 25vw">
        hi
      </VMain>
    </VContainer>
  </VLayout>
</template>

<style scoped>

</style>
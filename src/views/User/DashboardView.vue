<script setup lang="ts">

import UserNavbar from "../../components/Main/UserNavbar.vue";
import UserMainSidebar from "../../components/Main/UserMainSidebar.vue";
</script>

<template>
  <VLayout>
    <VContainer fluid class="px-10">
      <UserNavbar/>
      <UserMainSidebar/>
      <VMain style="margin-left: 25vw">
        Hi
      </VMain>
    </VContainer>
  </VLayout>
</template>

<style scoped>

</style>
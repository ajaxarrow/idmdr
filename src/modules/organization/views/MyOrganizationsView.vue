<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import OrganizationListViewContent from "../components/OrganizationListViewContent.vue";
</script>

<template>
  <MainLayout title="My Consortium Member Institutions">
    <OrganizationListViewContent :forUser="true"/>
  </MainLayout>
</template>


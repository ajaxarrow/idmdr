<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import RepositoryListViewContent from "../components/RepositoryListViewContent.vue";
</script>

<template>s
  <MainLayout title="My Projects">
    <RepositoryListViewContent :forUser="true"/>
  </MainLayout>
</template>


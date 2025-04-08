<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import OrganizationListViewContent from "../components/OrganizationListViewContent.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import OrganizationDataTable from "../components/OrganizationDataTable.vue";

const {userData} = useUserStore()
</script>

<template>
  <MainLayout title="Consortium Member Institutions">
    <OrganizationDataTable v-if="userData.is_superuser"/>
    <OrganizationListViewContent v-else/>
  </MainLayout>
</template>


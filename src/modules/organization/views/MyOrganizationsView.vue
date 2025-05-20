<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import OrganizationDataTable from "../components/OrganizationDataTable.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {onMounted} from "vue";
// import OrganizationListViewContent from "../components/OrganizationListViewContent.vue";
const {setSnackbarMessage} = useSnackbarStore()
onMounted(async () => {
  await setSnackbarMessage()
})
</script>

<template>
  <MainLayout title="My Consortium Member Institutions">
<!--    <OrganizationListViewContent :forUser="true"/>-->
    <OrganizationDataTable :isForUser="true"/>
  </MainLayout>
</template>


<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
// import RepositoryListViewContent from "../components/RepositoryListViewContent.vue";
import RepositoryDataTable from "../components/RepositoryDataTable.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {onMounted} from "vue";
const {setSnackbarMessage} = useSnackbarStore()
const {userData} = useUserStore()

onMounted(async () => {
  await setSnackbarMessage()
})
</script>

<template>
  <MainLayout title="My Projects">
<!--    <RepositoryListViewContent :forUser="true"/>-->
    <RepositoryDataTable :isForUser="!userData.is_superuser"/>
  </MainLayout>
</template>


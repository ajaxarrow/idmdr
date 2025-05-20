<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import OrganizationListViewContent from "../components/OrganizationListViewContent.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import OrganizationDataTable from "../components/OrganizationDataTable.vue";
import {onMounted} from "vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";

const {user, userData} = useUserStore()
const {setSnackbarMessage} = useSnackbarStore()
onMounted(async () => {
  await setSnackbarMessage()
})
</script>

<template>
  <MainLayout title="Consortium Member Institutions">
    <OrganizationDataTable v-if="user && userData.is_approved" :isForUser="!userData.is_superuser"/>
    <OrganizationListViewContent v-else/>
  </MainLayout>
</template>


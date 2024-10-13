<script setup lang="ts">
  import {onMounted} from "vue";
  import {useRepositoryStore} from "../stores/repository.store.ts";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
  import {useRepositoryServices} from "../services/repository.services.ts";
  const {repository} = useRepositoryStore();
  const {fetchRepositoryData} = useRepositoryServices()
  const {route} = useRouting()
  onMounted(() => {
    fetchRepositoryData(route.params.slug as string);
  })
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="settings">
    <div class="px-6 py-2">Settings</div>
  </RepositoryDetailsLayout>
</template>

<style scoped>

</style>
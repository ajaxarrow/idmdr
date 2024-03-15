<script setup lang="ts">
  import {onMounted} from "vue";
  import {useRepositoryStore} from "../../stores/repositoryStore.ts";
  import {useRouting} from "../../composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../layouts/RepositoryDetailsLayout.vue";
  const {repository, setRepositoryData} = useRepositoryStore();
  const {route} = useRouting()
  onMounted(() => {
    setRepositoryData(route.params.slug as string);
  })
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="discussions">
    <div class="px-6 py-2">Discussions</div>
  </RepositoryDetailsLayout>
</template>

<style scoped>

</style>
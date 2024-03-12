<script setup lang="ts">
  import MainLayout from "../../layouts/MainLayout.vue";
  import {onMounted, ref} from "vue";
  import {useRouting} from "../../composables/useRouting.ts";
  import {Repository} from "../../interfaces/repository.interface.ts";
  import {repositories} from "../../data/repository.ts";
  const {route} = useRouting()

  const repository = ref<Repository | null>();

  const fetchRepositoryData = (slug): Repository | null => {
    const repository = repositories.find(repo => repo.slug === slug);
    if (repository) {
      console.log(repository);
      return repository;
    } else {
      console.error('no repo')
      return null;
    }
  };




  onMounted(() => {
    console.log(route.params.slug)
    repository.value = fetchRepositoryData(route.params.slug)
  })

</script>

<template>
  <MainLayout title="Repository Details">
    <div v-if="repository">

    </div>
    <div v-else>
      walay data
    </div>
  </MainLayout>
</template>

<style scoped>

</style>
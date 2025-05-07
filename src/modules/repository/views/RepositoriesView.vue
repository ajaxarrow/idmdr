<script setup lang="ts">
  import MainLayout from "../../../core/layouts/MainLayout.vue";
  import {computed, onMounted, ref, watch} from "vue";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import RepositoryListViewContent from "../components/RepositoryListViewContent.vue";
  import {useUserStore} from "../../../core/stores/user.store.ts";
  import RepositoryDataTable from "../components/RepositoryDataTable.vue";

  const {userData} = useUserStore()
  const path = ref('repositories')
  const {route} = useRouting();
  const computedTitle = computed(() => {
    return path.value === 'repositories' ? 'Projects' : route.path === '/e-library' ? 'E-Library' : 'IP Technologies';
  });


  const getFirstPath = (url: string) => {
    return url.split('/').filter(Boolean)[0];
  }

  const init = async () => {
    path.value = getFirstPath(<string>route.path)
  }

  watch(() => route.path, async () => {
    await init();
  })

  onMounted(async () => {
    await init();
  })
</script>

<template>s
  <MainLayout :title="computedTitle">
    <RepositoryDataTable v-if="userData.is_superuser"/>
    <RepositoryListViewContent v-else/>
  </MainLayout>
</template>


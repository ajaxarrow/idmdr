<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {useRepositoryServices} from "../services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import RepoAccessRequestCharts from "../components/Reports/RepoAccessRequestCharts.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {userData} = useUserStore();
const {repository} = useRepositoryStore();
const {fetchRepositoryData, fetchRepositoryIDsByUser} = useRepositoryServices()

const {route, router} = useRouting()
const loading = ref(false)
const path = ref('repositories')
const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const isSlugInRepoList = (repository: Repository | null | undefined, repoList: Repository[]) => {
  return repoList.some(org => org.slug === repository?.slug);
};


onMounted(async () => {
  loading.value = true;
  await fetchRepositoryData(route.params.slug as string);
  path.value = getFirstPath(<string>route.path)

  const allUserRepo = await fetchRepositoryIDsByUser();

  if(repository.value){
    if(isSlugInRepoList(repository.value, allUserRepo) || userData.is_superuser) {
      if("is_member" in repository.value){
        repository.value.is_member = true;
      }
    } else {
      await router.push({
        name: "repository-data",
        params: {
          slug: <string> route.params.slug
        }
      })
    }
  }

  loading.value = false
})
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="reports">
    <div v-if="loading" class="loading-state-container mt-15">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="repository">
        <div class="px-7 py-5">
          <p class="text-about-heading py-3">Access Requests Received</p>
          <RepoAccessRequestCharts/>
        </div>
      </div>
    </div>
  </RepositoryDetailsLayout>
</template>

<style scoped>
:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}


.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
</style>
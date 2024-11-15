<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRepositoryStore} from "../stores/repository.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
import {useRepositoryServices} from "../services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";


const {repository} = useRepositoryStore();
const {fetchRepositoryData, fetchRepositoriesByUser} = useRepositoryServices()

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

  const allUserRepo = await fetchRepositoriesByUser();

  if(repository.value){
    if(isSlugInRepoList(repository.value, allUserRepo)) {
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
      <div v-if="repository" class="px-6 py-7">
        Hello
      </div>
    </div>
  </RepositoryDetailsLayout>
</template>

<style scoped>
.action-button{
  font-size: 14px;
  border-radius: 8px;
  padding: 10px;
  border: 2px solid #e6e6e6;
}

.action-button:hover{
  background-color: #F0F5F9;
}

.action-menu-item{
  padding: 10px 15px !important;
  font-size: 14px;
  display: flex;
  align-items: center !important;
  gap: 10px !important;
}

.action-menu-item:hover{
  background-color: #e0e3e3;
}

.section-title{
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}

:deep(.v-field__outline) {
  opacity: 70%;
  color: #8C8C8C;
  --v-field-border-width: 1px !important;
}

.text-name{
  font-size: 16px !important;
  font-weight: 700 !important;
}

.text-name-subtitle{
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 0.75;
}
</style>
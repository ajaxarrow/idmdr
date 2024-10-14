<script setup lang="ts">
import {onMounted, ref} from "vue";
  import {useRepositoryStore} from "../stores/repository.store.ts";
  import {useRouting} from "../../../core/composables/useRouting.ts";
  import RepositoryDetailsLayout from "../../../core/layouts/RepositoryDetailsLayout.vue";
  import {useRepositoryServices} from "../services/repository.services.ts";
  const {repository} = useRepositoryStore();
  const {fetchRepositoryData} = useRepositoryServices()
  const {route} = useRouting()
  const path = ref('repositories')
  const getFirstPath = (url: string) => {
    return url.split('/').filter(Boolean)[0];
  }

  onMounted(() => {
    fetchRepositoryData(route.params.slug as string);
    path.value = getFirstPath(<string>route.path)
  })
</script>

<template>
  <RepositoryDetailsLayout :repository="repository" activeTab="settings">
    <div class="px-6 py-7">
      <div class="mt-2">
        <VRow  class="ma-0" justify="space-between" align="center">
          <div>
            <p class="section-title">Update Organization Information</p>
            <p class="text-gs20 mb-2" style="font-size: 14px;">Modify your organization details and information</p>
          </div>
          <VBtnPrimaryFilled
              :to="{ name: path == 'repositories' ? 'edit-repository' : 'edit-repository-my', params: {slug: repository?.slug}}"
              height="41px"
              rounded="lg"
              class="satoshi-md"
              style="font-size: 14px !important;">
            Update Organization Info
          </VBtnPrimaryFilled>
        </VRow>
      </div>
    </div>
  </RepositoryDetailsLayout>
</template>

<style scoped>
.section-title{
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
}
</style>
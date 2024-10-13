<script setup lang="ts">
  import {Repository} from '../../../interfaces/repository.interface.ts'
  import {onMounted, PropType, ref} from "vue";
  import {useScreenStore} from "../../stores/screen-size.store.ts";
  import {useRouting} from "../../composables/useRouting.ts";
  const props = defineProps({
    repository: {
      type: Object as PropType<Repository>,
    }
  });

  const {isDesktop} = useScreenStore();
  const {router, route} = useRouting()
  const path = ref('/repositories')

  const goToRepositoryDetails = () => {
    router.push({
      name: path.value === '/repositories' ?  'repository-data' : 'my-repository-data',
      params: { slug: props.repository?.slug }
    });
  }

  onMounted(() => {
    path.value = <string>route.path
  })
</script>

<template>
  <div class="mb-2 cursor-pointer" @click="goToRepositoryDetails()">
    <VRow justify="space-between" align="center" class="ma-0" >
      <div class="d-flex align-center">
        <VImg
            style="border-radius: 8px"
            cover
            height="40px"
            width="40px"
            :src="props.repository?.image ? props.repository.image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
        />
        <div class="ml-2">
          <p class="repository-title">{{ props.repository?.title }}</p>
          <p class="repository-subtitle">{{ props.repository?.owner?.username }} · {{ props.repository?.organizationData?.name }} ({{ props.repository?.organizationData?.acronym }}) · {{ new Date(props.repository?.updated_at).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) }}</p>
        </div>
      </div>
      <VBtn
          :to="{ name: path == '/repositories' ?  'repository-data' : 'my-repository-data', params: { slug: props.repository?.slug } }"
          class="text-none bg-background view-details-btn"
          height="35px"
          width="95px"
          rounded="xl"
          v-if="isDesktop"
      >
        View Details
      </VBtn>
    </VRow>
    <VDivider class="mt-2"/>
  </div>
</template>

<style scoped>
  .repository-title{
    font-weight: 600;
  }

  .repository-subtitle{
    font-size: 14px;
  }

  .view-details-btn{
    font-size: 14px;
    letter-spacing: 0;
  }

  .v-btn--variant-elevated{
    box-shadow: 0 0 7px 0 #dae5f4;
  }
</style>
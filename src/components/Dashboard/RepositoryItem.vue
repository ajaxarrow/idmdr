<script setup lang="ts">
  import {Repository} from '../../interfaces/repository.interface.ts'
  import {PropType} from "vue";
  const props = defineProps({
    repository: {
      type: Object as PropType<Repository>,
    }
  });
</script>

<template>
  <div class="mb-2">
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
          <p class="repository-subtitle">{{ props.repository?.owner }} · {{ props.repository?.date?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</p>
        </div>
      </div>
      <VBtn class="text-none bg-background view-details-btn" height="35px" width="95px" rounded="xl" >
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
</style>
<script setup lang="ts">
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, PropType, ref} from "vue";
import {Post} from "../../../interfaces/post.interface.ts";

const path = ref('/organizations')
const props = defineProps({
  post: {
    type: Object as PropType<Post>
  }
})

const {isDesktop} = useScreenStore();
const {route} = useRouting()

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

onMounted(() => {
  path.value = getFirstPath(<string>route.path)
})
</script>

<template>
  <RouterLink class="mb-2 cursor-pointer text-decoration-none" :to="{ name: path == '/organizations' ?  'organization-posts-details' : 'my-organization-posts-details', params: { slug: props.post?.organizationData?.uid, post: props.post?.uid } }">
    <VRow justify="space-between" align="center" class="ma-0 data-list-item" >
      <div class="d-flex align-center">
        <VImg
            style="border-radius: 8px"
            cover
            height="40px"
            width="40px"
            :src="props.post?.images?.length ? <string>props.post.images[0].image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
        />
        <div class="ml-2">
          <p class="organization-title">{{props.post.title}}</p>

          <p class="organization-subtitle">{{  props.post.organizationData ? `${props.post.organizationData.name} (${props.post.organizationData.acronym})` : 'No CMI Associated'}}</p>
        </div>
      </div>
      <VBtn
          v-if="isDesktop" :to="{ name: path == '/organizations' ?  'organization-posts-details' : 'my-organization-posts-details', params: { slug: props.post?.organizationData?.uid, post: props.post?.uid } }"
          class="text-none bg-background view-details-btn"
          height="35px"
          width="95px"
          rounded="xl"
      >
        View Details
      </VBtn>
    </VRow>
    <VDivider class="mt-2"/>
  </RouterLink>

</template>

<style scoped>
.organization-title{
  font-weight: 600;
  color: black !important;
}

.organization-subtitle{
  font-size: 14px;
  color: black !important;
}

.view-details-btn{
  font-size: 14px;
  letter-spacing: 0;
}

.v-btn--variant-elevated{
  box-shadow: 0 0 7px 0 #dae5f4;
}
</style>
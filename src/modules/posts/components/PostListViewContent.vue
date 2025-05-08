<script setup lang="ts">
import {PhHardDrives, PhMagnifyingGlass} from "@phosphor-icons/vue";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import PostItem from "./PostItem.vue";
import {useScroll} from "../../../core/composables/useScroll.ts";
import {usePostServices} from "../services/post.services.ts";
import {onMounted, ref, watch, onUnmounted} from "vue";
import {Post} from "../../../interfaces/post.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";

const props = defineProps({
  forOrganization: {
    type: Boolean,
    default: false
  },
})
const {route} = useRouting()
const {scrollTop} = useScroll()
const {fetchAllPosts, fetchPostByOrganization} = usePostServices()
const searchQuery = ref('');
const postData = ref<Post[]>([]);
const searchedPosts = ref<Post[]>([]);
const pageLoading = ref(false)

const filterPostsBySearch = async (searchQuery: string, postData: Post[]) => {
  if(searchQuery) {
    //@ts-ignore
    return postData.filter((post: Post) => post.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()))
  } else {
    return postData
  }
}

watch(() => searchQuery.value, async () => {
  searchedPosts.value = await filterPostsBySearch(searchQuery.value, postData.value);
});

onMounted(async () => {
  pageLoading.value = true
  if(props.forOrganization) {
    postData.value = await fetchPostByOrganization(route.params.slug as string);
  } else {
    postData.value = await fetchAllPosts();
  }
  searchedPosts.value = postData.value
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
})
</script>

<template>
  <div class="pa-6">
    <VTextField
        v-model="searchQuery"
        hide-details
        variant="outlined"
        rounded="xl"
        density="comfortable"
        color="primary"
        base-color="gs60"
    >
      <template v-slot:prepend-inner>
        <PhMagnifyingGlass size="20" class="mx-1" color="#5F6061"/>
      </template>
      <template v-slot:label>
        <p class="text-gs20">Search posts by title</p>
      </template>
    </VTextField>
    <VRow justify="space-between" align="center" class="ma-0 my-6">
      <p class="text-title d-flex align-center">
        <PhHardDrives size="24" class="mr-1"/>
        Browse Experts
      </p>
    </VRow>
    <div v-if="pageLoading" class="loading-state-container">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <div v-else>
      <div v-if="postData.length > 0">
        <PostItem
            v-for="post in searchedPosts"
            :key="post.uid"
            :post="post"
        />
        <p class="text-center mt-5">
          All posts are loaded!
          <span
              @click="scrollTop"
              class="text-bs50 cursor-pointer scroll-top-link"
          >
                  Jump back to the top?
                </span>
        </p>
      </div>
      <EmptyStateInfo
          v-else
          header="No Posts Found"
          description="We couldn't find any posts at the moment."
          :isCallbackNeeded="searchQuery !== ''"
          @callback="searchQuery = ''"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
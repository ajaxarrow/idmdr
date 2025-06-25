<script setup lang="ts">
import {PhHardDrives, PhMagnifyingGlass} from "@phosphor-icons/vue";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";
import PostItem from "./PostItem.vue";
import {useScroll} from "../../../core/composables/useScroll.ts";
import {usePostServices} from "../services/post.services.ts";
import {onMounted, ref, watch, onUnmounted} from "vue";
import {Post} from "../../../interfaces/post.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useOrganizationStore} from "../../organization/stores/organization.store.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";

const props = defineProps({
  forOrganization: {
    type: Boolean,
    default: false
  },
})
const {userData} = useUserStore()
const {route} = useRouting()
const {organization} = useOrganizationStore();
const {fetchOrganizationData, fetchOrganizationIDsByUser} = useOrganizationServices();
const {scrollTop} = useScroll()
const {fetchAllPostsByUser, fetchPostByOrganization} = usePostServices()
const searchQuery = ref('');
const postData = ref<Post[]>([]);
const searchedPosts = ref<Post[]>([]);
const pageLoading = ref(false)

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};
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
  const allUserOrg = await fetchOrganizationIDsByUser();
  await fetchOrganizationData(route.params.slug as string);
  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    }
  }
  if(props.forOrganization) {
    postData.value = organization.value?.is_member! || userData.is_superuser ? await fetchPostByOrganization(organization.value?.slug as string) : (await fetchPostByOrganization(organization.value?.slug as string)).filter((post => post.is_published));
  } else {
    postData.value = await fetchAllPostsByUser();
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
        Browse Posts
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
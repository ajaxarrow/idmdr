<script setup lang="ts">
import OrganizationDetailsLayout from "../../../core/layouts/OrganizationDetailsLayout.vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, onUnmounted, ref, watch} from "vue";
import { PhHardDrives, PhInfo, PhMagnifyingGlass} from "@phosphor-icons/vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useScroll} from "../../../core/composables/useScroll.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import PostItem from "../../posts/components/PostItem.vue";
import {Post} from "../../../interfaces/post.interface.ts";
import {usePostServices} from "../../posts/services/post.services.ts";

const {setSnackbarMessage} = useSnackbarStore()
const {scrollTop} = useScroll()
const {route, router} = useRouting()
const {fetchOrganizationData, fetchOrganizationByUser} = useOrganizationServices();
const {fetchPostByOrganization} = usePostServices()

const path = ref('organizations')
const searchQuery = ref('');
const postData = ref<Post[]>([]);
const searchedPosts = ref<Post[]>([]);
const organization = ref<Organization | null>();
const pageLoading = ref(false)

const filterPostsBySearch = async (searchQuery: string, postData: Post[]) => {
  if(searchQuery) {
    //@ts-ignore
    return postData.filter((post: Post) => post.title.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()))
  } else {
    return postData
  }
}

const isSlugInOrgList = (organization: Organization | null | undefined, orgList: Organization[]) => {
  return orgList.some(org => org.slug === organization?.slug);
};



const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

watch(() => searchQuery.value, async () => {
  searchedPosts.value = await filterPostsBySearch(searchQuery.value, postData.value);
});

onMounted(async () => {
  pageLoading.value = true
  path.value = getFirstPath(<string>route.path)
  const allUserOrg = await fetchOrganizationByUser();
  organization.value = await fetchOrganizationData(route.params.slug as string);

  if(organization.value){
    if( isSlugInOrgList(organization.value, allUserOrg)){
      if ("is_member" in organization.value) {
        organization.value.is_member = true;
      }
    } else {
      await router.push({
        name: "organization-data",
        params: {
          slug: <string> route.params.slug
        }
      })
    }
  }
  postData.value = await fetchPostByOrganization(route.params.slug as string);
  searchedPosts.value = postData.value
  await setSnackbarMessage()
  pageLoading.value = false
})

onUnmounted(() => {
  searchQuery.value = '';
})

</script>

<template>
  <OrganizationDetailsLayout
      :organization="organization"
      activeTab="posts">
    <div v-if="organization" class="pa-6">
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
        <p v-else class="d-flex align-center justify-center"><PhInfo class="mr-1"/>No Posts Found</p>
      </div>
      </div>
  </OrganizationDetailsLayout>
</template>

<style scoped>


</style>
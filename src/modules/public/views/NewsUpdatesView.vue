<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import { PhCalendar } from "@phosphor-icons/vue";
import { useRouting } from "../../../core/composables/useRouting.ts";
import Placeholder from "../../../assets/landing-page/placeholder.png";
import { usePostServices } from "../../posts/services/post.services.ts";
import { onMounted, ref } from "vue";
import { Post } from "../../../interfaces/post.interface.ts";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const { router } = useRouting();
const { fetchAllPosts } = usePostServices();
const postData = ref<Post[]>([]);
const pageLoading = ref(false);

const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit"
  };
  return date.toLocaleDateString("en-US", options);
};

const goToPostDetails = (post: Post) => {
  router.push({ name: 'news-updates-detail', params: { slug: post.uid } });
};

onMounted(async () => {
  pageLoading.value = true;
  postData.value = await fetchAllPosts();
  pageLoading.value = false;
});
</script>

<template>
  <VLayout>
    <Navbar>
      <VContainer>
        <div>
          <h1>News & Updates</h1>
          <div v-if="pageLoading" class="loading-state-container" style="height: 65vh;">
            <VProgressCircular indeterminate color="#23668b"></VProgressCircular>
          </div>
          <div v-else style="min-height: 65vh;">
            <EmptyStateInfo
              v-if="postData.length == 0"
              header="No Posts Found"
              description="No posts available at the moment. Please check back later."
            />
            <VRow class="ma-0" v-else>
              <VCol
                  v-for="post in postData"
                  :key="post.uid"
                  cols="12" sm="12"
                  md="6"
                  xxl="4"
                  xl="4"
                  lg="4"
                  class="my-2"
              >
                <VCard
                    @click="goToPostDetails(post)"
                    class="mx-auto cursor-pointer post-card"
                >
                  <VImg
                      height="200px"
                      class="align-end text-white post-image"
                      :lazy-src="Placeholder"
                      :src="post?.images?.length ? <string>post.images[0].image : 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png?ssl=1'"
                      cover
                  >
                  </VImg>
                  <VCardSubtitle class="pt-4 d-flex align-center ga-1">
                    <PhCalendar :size="16"/> {{ formatDateString(post?.created_at!) }}
                  </VCardSubtitle>
                  <v-card-title>{{ post.title }}</v-card-title>
                  <RouterLink
                      :to="{name: 'news-updates-detail', params: {slug: post.uid}}"
                      class="text-none d-flex text-decoration-none"
                  >
                    <VCardText class="d-flex">
                      <div style="display: flex !important;">
                        <p class="fancy-text text-black">Read More</p>
                      </div>
                    </VCardText>
                  </RouterLink>
                </VCard>
              </VCol>
            </VRow>
          </div>
        </div>
      </VContainer>
      <Footer/>
    </Navbar>
  </VLayout>
</template>

<style scoped>
.fancy-text {
  width: 100%;
  background-image: linear-gradient(90deg, #000, #000);
  background-size: 0% 2.5px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size 300ms ease;
}

.fancy-text:hover, .animate-underline:hover {
  background-size: 100% 2.5px;
}

.post-card {
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.post-image {
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}
</style>
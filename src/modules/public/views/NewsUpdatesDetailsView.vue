<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import Placeholder from "../../../assets/landing-page/placeholder.png"
import {onMounted, ref} from "vue";
import {NewsUpdate, newsUpdates} from "../../../data/newsupdates.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {PhArrowLeft, PhCalendar} from "@phosphor-icons/vue";


const blog = ref<NewsUpdate | null>();
const {route} = useRouting()

const fetchBlogData = (slug: string): NewsUpdate | null => {
  const blogData = newsUpdates.find((blog) => blog.slug === slug);
  if (!blogData) {
    return null;
  }
  return blogData;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

onMounted(() => {
  blog.value = fetchBlogData(route.params.slug as string);
})

</script>

<template>
  <VLayout>
    <Navbar>
      <VContainer>
        <div>
          <RouterLink
            :to="{
              name: 'news-updates',
            }"
              class="text-decoration-none text-none">
            <p class="cursor-pointer back-button pa-2 d-flex align-center ga-1 text-black">
              <PhArrowLeft size="14"/>
              Back To News & Updates List
            </p>
          </RouterLink>
          <h1>{{ blog?.title }}</h1>
          <p class="pt-4 d-flex align-center ga-1 text-gs60">
            <PhCalendar size="16"/>
            {{ formatDate(blog?.date) }}
          </p>
        </div>
        <VImg :lazy-src="Placeholder" :src="blog?.image!" class="my-10" style="border-radius: 16px;"></VImg>
        <div v-html="blog?.content"></div>
      </VContainer>
      <Footer/>
    </Navbar>
  </VLayout>
</template>

<style scoped>
</style>
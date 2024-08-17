<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import {NewsUpdate, newsUpdates} from "../../../data/newsupdates.ts"
import {PhCalendar} from "@phosphor-icons/vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import Placeholder from "../../../assets/landing-page/placeholder.png";

const {router} = useRouting();
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

const goToBlogDetails = (slug: string) => {
  router.push({
    name: 'news-updates-detail',
    params: { slug: slug }
  });
}
</script>

<template>
  <VLayout>
    <Navbar>
      <VContainer>
        <div>
          <h1>News & Updates</h1>
          <VRow class="ma-0">
            <VCol v-for="blog in newsUpdates" sm="12" md="6" xxl="4" xl="4" lg="4" class="my-2">
              <VCard
                  @click="goToBlogDetails(blog.slug)"
                  class="mx-auto cursor-pointer"
              >
                <VImg
                    height="200px"
                    class="align-end text-white"
                    :lazy-src="Placeholder"
                    :src="blog.image"
                    cover
                >
                </VImg>

                <VCardSubtitle class="pt-4 d-flex align-center ga-1">
                  <PhCalendar size="16"/>
                  {{ formatDate(blog.date) }}
                </VCardSubtitle>

                <v-card-title>{{ blog.title }}</v-card-title>
                <RouterLink :to="{name: 'news-updates-detail', params: {slug: blog.slug}}" class="text-none d-flex text-decoration-none">
                <VCardText class="d-flex">
                    <div style="display: flex !important;"><p class="fancy-text text-black">Read More</p></div>
                </VCardText>
                </RouterLink>
              </VCard>

            </VCol>
          </VRow>
        </div>
      </VContainer>
      <Footer/>
    </Navbar>
  </VLayout>
</template>

<style scoped>
.fancy-text{
  width: 100%;
  background-image: linear-gradient(90deg, #000, #000);
  background-size: 0% 2.5px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size 300ms ease;
}

.fancy-text:hover, .animate-underline:hover{
  background-size: 100% 2.5px;
}
</style>
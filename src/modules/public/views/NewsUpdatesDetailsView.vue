<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import Placeholder from "../../../assets/landing-page/placeholder.png";
import { onMounted, ref } from "vue";
import { useRouting } from "../../../core/composables/useRouting.ts";
import { PhArrowLeft, PhCalendar, PhImage } from "@phosphor-icons/vue";
import { Post } from "../../../interfaces/post.interface.ts";
import { usePostServices } from "../../posts/services/post.services.ts";
import NotFound from "../../../assets/images/404.svg";

const post = ref<Post | null | undefined>(null);
const { fetchPostbyID } = usePostServices();
const { route } = useRouting();
const imagePreviewDialog = ref(false);
const selectedImageIndex = ref(0);
const loading = ref(false)

const formatDateString = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit"
  };
  return date.toLocaleDateString("en-US", options);
};

const openImagePreview = (index: number) => {
  selectedImageIndex.value = index;
  imagePreviewDialog.value = true;
};

onMounted(async () => {
  loading.value = true;
  post.value = await fetchPostbyID(route.params.slug as string);
  loading.value = false;
});
</script>

<template>
  <VLayout>
    <Navbar>
      <VContainer>
        <VRow v-if="loading" justify="center" align="center" class="my-12" style="min-height: 80vh;">
          <VCol cols="12" class="text-center">
            <VProgressCircular indeterminate color="bs50" size="64"></VProgressCircular>
            <p class="mt-4 text-body-1">Loading...</p>
          </VCol>
        </VRow>
        <div v-else>
          <div v-if="post">
            <div>
              <div class="d-flex">
                <RouterLink
                    :to="{ name: 'news-updates' }"
                    class="text-decoration-none text-none"
                >
                  <p class="cursor-pointer back-button pa-2 d-flex align-center ga-1 text-black">
                    <PhArrowLeft :size="14"/>
                    Back To News & Updates List
                  </p>
                </RouterLink>
              </div>

              <h1>{{ post?.title }}</h1>

              <p class="pt-4 d-flex align-center ga-1 text-gs60">
                <PhCalendar :size="16"/> {{ formatDateString(post?.updated_at!) }}
              </p>
            </div>

            <!-- Image Carousel -->
            <div v-if="post!.images!.length > 0" class="my-10">
              <VCarousel
                  :show-arrows="post!.images!.length > 1"
                  height="450"
                  hide-delimiter-background
                  cycle
              >
                <VCarouselItem
                    v-for="(image, index) in post.images"
                    :key="index"
                    :src="image.image! as string"
                    :lazy-src="Placeholder"
                    cover
                >
                  <div class="image-overlay">
                    <VBtn
                        icon
                        variant="elevated"
                        size="small"
                        class="image-preview-btn"
                        @click="openImagePreview(index)"
                    >
                      <PhImage :size="20" />
                    </VBtn>
                  </div>
                </VCarouselItem>
              </VCarousel>
            </div>

            <!-- Placeholder if no images -->
            <VImg
                v-else
                :src="Placeholder"
                height="450"
                cover
                class="my-10"
                style="border-radius: 16px;"
            />

            <!-- Image Preview Dialog -->
            <VDialog
                v-model="imagePreviewDialog"
                max-width="90%"
                class="image-preview-dialog"
            >
              <VCard>
                <VCardText class="pa-0 position-relative">
                  <VBtn
                      icon
                      variant="text"
                      class="close-btn"
                      @click="imagePreviewDialog = false"
                  >
                    ✕
                  </VBtn>
                  <VImg
                      :src="post?.images?.[selectedImageIndex]?.image! as string"
                      contain
                      max-height="80vh"
                  />
                </VCardText>
              </VCard>
            </VDialog>

            <div class="ql-snow">
              <div class="ql-editor" v-html="post?.description"></div>
            </div>
          </div>
          <div v-else style="height: 100%">
            <div style="height:45vh" class="d-flex flex-column justify-center align-center">
              <VImg :src="NotFound" width="300px" />
              <p class="text-h4 font-weight-black">Post Not Found</p>
            </div>
          </div>
        </div>
      </VContainer>
      <Footer/>
    </Navbar>
  </VLayout>
</template>

<style scoped>
.image-overlay {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.image-preview-btn {
  background: rgba(255, 255, 255, 0.8) !important;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}

.image-preview-dialog :deep(.v-card) {
  background: rgba(0,0,0,0.9);
}

.back-button{
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #f2f7fa;
}
</style>
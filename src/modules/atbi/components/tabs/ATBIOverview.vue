<script setup lang="ts">
import {PropType, ref} from "vue";
import {ATBI} from "../../../../interfaces/atbi.interface.ts";
import {PhImages} from "@phosphor-icons/vue";
import ImagePreviewOverlay from "../../../../core/components/ImagePreviewOverlay.vue";

const props = defineProps({
  atbi: {
    type: Object as PropType<ATBI>
  }
})

const selectedImageIndex = ref(0);
const previewImage = ref('')
const isImagePreviewed = ref(false)
const openImagePreview = (index: number) => {
  selectedImageIndex.value = index;
  previewImage.value = props.atbi?.image_urls?.[selectedImageIndex.value].image as string
  isImagePreviewed.value = true;
};
</script>

<template>
  <ImagePreviewOverlay
      :overlay="isImagePreviewed"
      :imageSrc="previewImage"
      @closeOverlay="isImagePreviewed = false"
  />
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">About ATBI</p>
      <div class="ql-snow">
        <div class="ql-editor" v-html="props.atbi?.description"></div>
      </div>
    </div>
  </div>
  <VDivider/>
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">Additional Info</p>
      <div class="ql-snow">
        <div class="ql-editor" v-html="props.atbi?.additional_info"></div>
      </div>
    </div>
  </div>
  <div v-if="props.atbi?.image_urls?.length! > 0">
    <VDivider/>
    <div class="px-8 pt-4 mb-10">
      <p class="text-about-heading py-3">Images</p>
      <VSheet width="100%" class="file-container mb-5">
        <div class="pa-4">
          <VRow justify="space-between" align="center" class="ma-0">
            <p><span class="text-data-heading">Image Gallery</span> ({{props.atbi?.image_urls?.length}} Images)</p>
          </VRow>
        </div>

        <VDivider/>

        <div class="pa-4">
          <VRow>
            <VCol v-for="(image, index) in props.atbi?.image_urls" :key="index" cols="12" sm="6" md="4" lg="3">
              <VCard
                  class="image-card elevation-2"
                  @click="openImagePreview(index)"
              >
                <VImg
                    :src="image.image! as string"
                    height="200"
                    cover
                >
                  <div class="image-overlay">
                    <VBtn
                        icon
                        variant="elevated"
                        size="small"
                        class="image-preview-btn"
                    >
                      <PhImages :size="20" />
                    </VBtn>
                  </div>
                </VImg>
              </VCard>
            </VCol>
          </VRow>
        </div>

        <!--            <VDivider v-if="selectedImageIndex !== -1"/>-->

        <!--            <div v-if="selectedImageIndex !== -1" class="px-6 py-4">-->
        <!--              <VRow class="ma-0" justify="space-between">-->
        <!--                <div>-->
        <!--                  <p class="text-data-subheading d-flex align-center">-->
        <!--                    <PhInfo size="20" class="mr-2"/>-->
        <!--                    About the selected image-->
        <!--                  </p>-->
        <!--                  <p class="text-data-description">-->
        <!--                    {{ imageFiles[selectedImageIndex].description || 'No description available' }}-->
        <!--                  </p>-->
        <!--                </div>-->
        <!--                <p v-if="isMember" class="download-icon d-flex align-center cursor-pointer"-->
        <!--                   @click="downloadFile(imageFiles[selectedImageIndex].attachment as string)">-->
        <!--                  <PhDownload size="20" class="mr-2"/>-->
        <!--                  Download Image-->
        <!--                </p>-->
        <!--              </VRow>-->

        <!--              <VRow class="mt-4">-->
        <!--                <VCol cols="12" md="8" class="mx-auto">-->
        <!--                  <VImg-->
        <!--                      :src="imageFiles[selectedImageIndex].attachment as string"-->
        <!--                      max-height="500"-->
        <!--                      contain-->
        <!--                      class="selected-image-preview"-->
        <!--                  ></VImg>-->
        <!--                </VCol>-->
        <!--              </VRow>-->
        <!--            </div>-->
      </VSheet>
    </div>
  </div>
</template>

<style scoped>
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
</style>
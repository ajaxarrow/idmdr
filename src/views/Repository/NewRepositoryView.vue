<script setup lang="ts">
import MainLayout from "../../layouts/MainLayout.vue";
import {ref} from "vue";
import {PhFileDashed} from "@phosphor-icons/vue";
const visibility = ref("public")
</script>

<template>
  <MainLayout title="New Repository">
    <div style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
          <div>
            <p class="text-heading d-flex align-center">
              Create New Repository
            </p>
            <p class="text-subtitle">
              A repository contain all project files and any related data.
            </p>
          </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
        <div class="px-6 py-3">
          <VRadioGroup hide-details v-model="visibility">
            <VRadio color="bs50" value="public" class="my-3">
              <template v-slot:label>
                <div>
                  <p class="radio-text-heading">Public</p>
                  <p class="radio-text-subtitle">The repository is accessible to the general public for content exploration.</p>
                </div>
              </template>
            </VRadio>
            <VRadio color="bs50" value="private" class="my-3">
              <template v-slot:label>
                <div>
                  <p class="radio-text-heading">Private</p>
                  <p class="radio-text-subtitle">The repository's content is exclusively visible to members within the organization.</p>
                </div>
              </template>
            </VRadio>
          </VRadioGroup>
        </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-5">
          <label class="input-label">Repository Title<span class="text-pink">*</span></label>
          <VTextField
            placeholder="E.g. Soil Health Monitoring: Databases on Agricultural Lands Across Borders"
            class="my-2"
            hide-details
            rounded="lg"
            density="comfortable"
            variant="outlined"
            color="primary"
            base-color="gs60"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Subtitle</label>
          <VTextField
              placeholder="E.g. Unveiling the Global Tapestry of Soil Vitality and Agricultural Sustainability"
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Description</label>
          <VTextarea
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Tags</label>
          <VTextField
              placeholder="E.g. Soil Health, Agriculture Data, Global Farming, Agricultural Lands,"
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-10">
          <label class="input-label">File</label>
          <div class="my-2 file-upload-container">
            <PhFileDashed size="50"/>
            <p class="text-dropzone">Drag and drop files here or <label class="file-label" for="dropzoneFile">Choose files</label></p>
            <VFileInput id="dropzoneFile" style="display: none"/>
          </div>
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
            rounded="lg"
            height="44px"
            width="166px"
          >
            Submit
          </VBtnPrimaryFilled>
        </VRow>
      </div>
    </div>

  </MainLayout>
</template>

<style scoped>
.circle::after {
  content: '';
  position: absolute;
  right: -168px;
  top: -460px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

.text-note{
  font-size: 14px;
  font-weight: 500;
  font-style: italic;
}

.radio-text-heading{
  margin-top: 3px;
  font-size: 16px;
  font-weight: 600;
  color: black !important;
  line-height: 1;
}

.radio-text-subtitle{
  font-size: 14px;
  font-weight: 350;
}

.input-label{
  font-weight: 600;
}

.file-upload-container{
  width: 100%;
  height: 144px;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #E6E6E6;
  background-color: #fff;
  transition: .3s ease all;
}

.text-dropzone{
  font-size: 14px;
}

.file-label{
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}


:deep .v-label{
  opacity: 100% !important;
}

:deep .v-icon{
  --v-icon-size-multiplier: 1.23
}

:deep .v-field__outline {
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep input::placeholder {
  color: #5F6061;
  opacity: 90%;
}

:deep textarea::placeholder {
  color: #5F6061;
  opacity: 90%;
}

</style>
<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {ClusterType} from "../../../interfaces/enums/organization.enum.ts"
import {ref} from "vue";
import {PhArrowLeft, PhFileDashed} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
const type = ref("institution")

const clusters: string[] = Object.values(ClusterType);


</script>

<template>
  <MainLayout title="New Organization">
    <div style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
          <RouterLink :to="{ name: 'organizations'}"  class="text-decoration-none text-none">
            <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
              <PhArrowLeft size="14" class="mr-1"/>
              Back To Organizations
            </p>
          </RouterLink>
          <p class="text-heading d-flex align-center">
            Create New Organization
          </p>
          <p class="text-subtitle">
            An organization is an agency or institution undertaking research and development.
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="px-6 py-3">
        <VRadioGroup hide-details v-model="type">
          <VRadio color="bs50" value="agency" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Agency</p>
                <p class="radio-text-subtitle">This organization is an agency type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" value="institution" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Institution</p>
                <p class="radio-text-subtitle">This organization is an institution type.</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-5">
          <label class="input-label">Organization Name<span class="text-pink">*</span></label>
          <VTextField
              placeholder="E.g. Central Mindanao University"
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
          <label class="input-label">Organization Acronym</label>
          <VTextField
              placeholder="E.g. CMU"
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
          <label class="input-label">Description<span class="text-pink">*</span></label>
          <QuillRichTextEditor
            placeholder="E.g. Central Mindanao University is a State University located in the heart of Mindanao Island, Province of Bukidnon, Philippines. It was transformed from a settlement farm school organized by the Americans. It started as the Mailag Industrial School founded in 1910. It is one of the oldest premier universities in Southern Philippines."
          />
<!--          <VTextarea-->
<!--              placeholder="E.g. Central Mindanao University is a State University located in the heart of Mindanao Island, Province of Bukidnon, Philippines. It was transformed from a settlement farm school organized by the Americans. It started as the Mailag Industrial School founded in 1910. It is one of the oldest premier universities in Southern Philippines."-->
<!--              class="my-2"-->
<!--              hide-details-->
<!--              rounded="lg"-->
<!--              density="comfortable"-->
<!--              variant="outlined"-->
<!--              color="primary"-->
<!--              base-color="gs60"-->
<!--          />-->
        </div>
        <div class="mb-5">
          <label class="input-label">Address<span class="text-pink">*</span></label>
          <VTextField
              placeholder="E.g. University"
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
          <label class="input-label">President<span class="text-pink">*</span></label>
          <VTextField
              placeholder="E.g. John Doe"
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
          <label class="input-label">Telephone Number<span class="text-pink">*</span></label>
          <VTextField
              placeholder="E.g. 000-888-000"
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
          <label class="input-label">Cell Number<span class="text-pink">*</span></label>
          <VTextField
              placeholder="E.g. 09510055677"
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
          <label class="input-label">Email<span class="text-pink">*</span></label>
          <VTextField
              placeholder="E.g. cmu@edu.ph"
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div v-for="cluster in clusters">
          <div class="mb-5">
            <label class="input-label">{{cluster}} Name<span class="text-pink">*</span></label>
            <VTextField
                placeholder="E.g. John Doe"
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
            <label class="input-label">{{cluster}} Email<span class="text-pink">*</span></label>
            <VTextField
                placeholder="E.g. johndoe@example.com"
                class="my-2"
                hide-details
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
            />
          </div>
        </div>
        <div class="mb-5">
          <label class="input-label">Organization Image</label>
          <div class="my-2 file-upload-container">
            <PhFileDashed size="50"/>
            <p class="text-dropzone">Drag and drop image file here or <label class="file-label" for="dropzoneFile">Choose file</label></p>
            <VFileInput id="dropzoneFile" style="display: none"/>
          </div>
        </div>
        <div class="mb-10">
          <label class="input-label">GeoJSON</label>
          <div class="my-2 file-upload-container">
            <PhFileDashed size="50"/>
            <p class="text-dropzone">Drag and drop files here or <label class="file-label" for="dropzoneFile">Choose files</label> or <label class="file-label" for="dropzoneFile">Draw Boundary</label></p>
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
:deep .ql-toolbar{
  margin-top: 8px;
  border: 1.75px solid rgba(140, 140, 140, 0.2) !important;
  border-radius: 10px 10px 0 0 !important;
}

:deep .ql-editor.ql-blank::before {
  content: none;
}

:deep .ql-editor.ql-blank::after {
  color: #5F6061;
  opacity: 90%;
  content: attr(data-placeholder);
  font-style: normal;
  pointer-events: none;
  display: block;
  margin-top: -1.42rem;
}

.circle::after {
  content: '';
  position: absolute;
  right: -168px;
  top: -460px;
  width: 640px;
  height: 591px;
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

.back-button{
  width: 175px;
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #f2f7fa;
}
</style>
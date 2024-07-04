<script setup lang="ts">
import {reactive, ref} from "vue";
import QuillRichTextEditor from "../../../../core/components/QuillRichTextEditor.vue";

const topicDialog = ref(false);
const topic = reactive({
  title: '',
  description: ``
})

</script>

<template>
  <VBtnPrimaryFilled
    @click="topicDialog = true"
    rounded="lg"
    class="satoshi-md"
    width="130px"
    height="40px"
    style="font-size: 14px !important;"
  >
    New Topic
  </VBtnPrimaryFilled>
  <VDialog v-model="topicDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Create New Topic</p>
      <VDivider/>
      <div class="px-5 py-2">
        <div class="mb-5">
          <p class="dialog-label mb-2">Topic Title</p>
          <VTextField
              v-model="topic.title"
              placeholder="E.g. New Topic"
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
          <label class="dialog-label mb-2">Topic Description</label>
          <QuillRichTextEditor
              :modelValue="topic.description"
              placeholder="Enter topic description here"
              @update:modelValue="$event => (topic.description = $event)"
          />
        </div>

      </div>
      <VDivider/>

      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="topicDialog = false"
            width="86"
            variant="outlined"
            class="button-outline"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            @click="topicDialog = false"
            width="86"
            class="button-outline"
        >
          Save
        </VBtnPrimaryAlt>
      </VRow>
    </VSheet>
  </VDialog>
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

.sector-tagging-dialog-container{
  width: 663px;
  border-radius: 15px !important;
}

.dialog-title{
  font-size: 20px;
  font-weight: 700;
}

.dialog-label{
  font-size: 16px;
  font-weight: 600;
  color: black;
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

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 3px;
  border-radius: 10px;
}

:deep .v-overlay__content {
  display: grid !important;
  place-items: center !important;
}

</style>
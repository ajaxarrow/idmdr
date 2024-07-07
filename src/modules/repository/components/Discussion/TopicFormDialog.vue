<script setup lang="ts">
import {computed, onMounted, PropType, reactive, ref} from "vue";
  import QuillRichTextEditor from "../../../../core/components/QuillRichTextEditor.vue";
import {FormType} from "../../../../interfaces/enums/formtype.enum.ts";
import {Topic} from "../../../../interfaces/dicussion.interface.ts";
import {useRouting} from "../../../../core/composables/useRouting.ts";
import {useRepositoryDiscussionTopicServices} from "../../services/repository-discussion-topic.services.ts";

  const {addTopic, updateTopic} = useRepositoryDiscussionTopicServices();
  const {route} = useRouting();
  const emits = defineEmits(['callback']);
  const action = computed(() => props.formType === FormType.edit ? 'Update' : 'Add');
  const props = defineProps({
    formType: {
      type: String as PropType<FormType>,
    },
    topic: {
      type: Object as PropType<Topic>
    }
  })

  const topicDialog = ref(false);
  const topic = reactive({
    title: '',
    description: ``
  })

  const generateRandom10DigitNumber = () => {
    return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
  }

  const addTopicData = async () => {
    const newTopic: Topic = {
      owner: 'Tabilla, Jiu Axl',
      ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/46.jpg',
      id: generateRandom10DigitNumber().toString(),
      repository: <string>route.params.slug,
      title: topic.title,
      description: topic.description
    }
    await addTopic(newTopic);
    clearTopicData();
    emits('callback')
    topicDialog.value = false;
  }

  const updateTopicData = async (currentTopic: Topic) => {
    await updateTopic({
      owner: currentTopic.owner,
      ownerImage: currentTopic.ownerImage,
      id: currentTopic.id,
      repository: currentTopic.repository,
      title: topic.title,
      description: topic.description
    });
    clearTopicData();
    emits('callback')
    topicDialog.value = false;
  }

  const clearTopicData = () => {
    topic.description = ``
    topic.title = ''
  }

  onMounted(()=> {
    if(props.formType === FormType.edit) {
      if(props.topic){
        topic.title = props.topic.title
        topic.description = props.topic.description
      }
    }
  })
</script>

<template>
  <div @click="topicDialog = true">
    <slot></slot>
  </div>
  <VDialog v-model="topicDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">{{action}} Topic</p>
      <VDivider/>
      <div class="px-5 py-2">
        <div class="mb-5">
          <p class="dialog-label mb-2">Topic Title</p>
          <VTextField
              autofocus
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
            @click="props.formType === FormType.edit ? updateTopicData(<Topic>props.topic) : addTopicData()"
            width="86"
            class="submit-button"
        >
          {{action}}
        </VBtnPrimaryAlt>
      </VRow>
    </VSheet>
  </VDialog>
</template>

<style scoped>
:deep(.ql-toolbar){
  margin-top: 8px;
  border: 1.75px solid rgba(140, 140, 140, 0.2) !important;
  border-radius: 10px 10px 0 0 !important;
}

:deep(.ql-editor.ql-blank::before){
  content: none;
}
:deep(.ql-editor.ql-blank::after){
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

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 3px;
  border-radius: 8px;
}

.submit-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 8px;
}


:deep(.v-label){
  opacity: 100% !important;
}

:deep(.v-icon){
  --v-icon-size-multiplier: 1.23
}

:deep(.v-field__outline){
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep(input::placeholder){
  color: #5F6061;
  opacity: 90%;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}

</style>
<script setup lang="ts">
import {computed, onMounted, PropType, reactive, ref} from "vue";
  import QuillRichTextEditor from "../../../../core/components/QuillRichTextEditor.vue";
import {FormType} from "../../../../interfaces/enums/formtype.enum.ts";
import {Topic} from "../../../../interfaces/discussion.interface.ts";
import {useRouting} from "../../../../core/composables/useRouting.ts";
import {useRepositoryDiscussionTopicServices} from "../../services/repository-discussion-topic.services.ts";
import {useUserStore} from "../../../../core/stores/user.store.ts";

  const {addDiscussionTopic, updateDiscussionTopic, errorMessage, hasErrorMessages} = useRepositoryDiscussionTopicServices();
  const {route} = useRouting();
  const {userData} = useUserStore();
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
  const discussionTopicInitialState = reactive<Topic>({
    repo_id: '',
    topic_content: '',
    topic_title: '',
    id: '',
    user: ''
  });

  const discussionTopicData = reactive<Topic>({
    ...discussionTopicInitialState
  })


  const addTopicData = async () => {
    discussionTopicData.repo_id = <string>route.params.slug;
    discussionTopicData.user = userData.uid;

    await addDiscussionTopic(discussionTopicData);
    if(!hasErrorMessages(errorMessage)) {
      clearTopicData();
      emits('callback')
      topicDialog.value = false;
    }
  }

  const updateTopicData = async () => {
    await updateDiscussionTopic(discussionTopicData, <string>discussionTopicData.id);
    if(!hasErrorMessages(errorMessage)) {
      clearTopicData();
      emits('callback')
      topicDialog.value = false;
    }
  }

  const clearTopicData = () => {
    Object.assign(discussionTopicData, {...discussionTopicInitialState})
  }

  onMounted(()=> {
    if(props.formType === FormType.edit) {
      if(props.topic){
        Object.assign(discussionTopicData, {...props.topic})
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
              v-model="discussionTopicData.topic_title"
              placeholder="E.g. New Topic"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.topic_title"
          />
        </div>
        <div class="mb-5">
          <label class="dialog-label mb-2">Topic Description</label>
          <QuillRichTextEditor
              :modelValue="discussionTopicData.topic_content"
              placeholder="Enter topic description here"
              @update:modelValue="$event => (discussionTopicData.topic_content = $event)"
          />
          <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.topic_content">{{errorMessage.topic_content}}</p>
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
            @click="props.formType === FormType.edit ? updateTopicData() : addTopicData()"
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
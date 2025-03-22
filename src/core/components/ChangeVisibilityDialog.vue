<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useOrganizationServices} from "../../modules/organization/services/organization.services.ts";
import {useRepositoryServices} from "../../modules/repository/services/repository.services.ts";
const {changeOrganizationVisibility} = useOrganizationServices()
const {changeRepositoryVisibility} = useRepositoryServices()

const emits = defineEmits(['callback']);
const visibilityData = ref<Number>(0);
const props = defineProps({
  visibility: {
    type: Number,
    default: 0
  },
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const visibilityDialog = ref(false);

const changeVisibility = () => {
  if(props.type === 'organization') {
    changeOrganizationVisibility(<string>props.id, visibilityData.value)
  } else {
    changeRepositoryVisibility(<string>props.id, visibilityData.value)
  }
  emits('callback', visibilityData.value)
  visibilityDialog.value = false
}

watch(() => visibilityDialog.value, () => {
  if(visibilityDialog.value) {
    visibilityData.value = <Number>props.visibility
  }
})

onMounted(() => {
  visibilityData.value = <Number>props.visibility
})
</script>

<template>
  <div @click="visibilityDialog = true">
    <slot></slot>
  </div>
  <VDialog v-model="visibilityDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Change {{ props.type.charAt(0).toUpperCase() + props.type.slice(1) }} Visibility</p>
      <VDivider/>
      <div class="px-5 py-2">
        <VRadioGroup hide-details v-model="visibilityData">
          <VRadio color="bs50" :value="1" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Public</p>
                <p class="radio-text-subtitle">The {{props.type == 'project' ? 'project' : 'CMI'}} is accessible to the general public for content exploration.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="2" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Private</p>
                <p class="radio-text-subtitle">The content is accessible only to the creator or owner of the {{props.type == 'project' ? 'project' : ' consortium member institutions.'}}</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="3" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within Organization</p>
                <p class="radio-text-subtitle">The {{props.type == 'project' ? 'project' : 'CMI'}}'s information is exclusively visible to members within the consortium member institutions.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="4" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within All Organization</p>
                <p class="radio-text-subtitle">The {{props.type == 'project' ? 'project' : ' CMI'}}'s information is visible to all members of any consortium member institutions</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>

      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="visibilityDialog = false"
            width="86"
            variant="outlined"
            class="button-outline"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            @click="changeVisibility()"
            width="86"
            class="submit-button"
        >
          Submit
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

</style>
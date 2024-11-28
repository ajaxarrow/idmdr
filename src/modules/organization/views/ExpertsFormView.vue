<script setup lang="ts">
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {onMounted, reactive, ref} from "vue";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {Expert, Organization} from "../../../interfaces/organization.interface.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import {useOrganizationExpertsServices} from "../services/organization-experts.services.ts";
import {contactVisibility, expertise} from "../../../data/repository.inventory.fields.ts";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";

const {userData} = useUserStore();
const {arrayToString} = useStringArrayHelper()
const {addExpert, updateExpert, fetchExpertById, loading} = useOrganizationExpertsServices()
const {fetchOrganizationByUser} = useOrganizationServices();
const {isEmptyObject} = useObjectChecker()
const {route} = useRouting();
// const previousTags = ref<string[]>([])


const organizations = ref<Organization[]>([])
const formType = ref<FormType>(FormType.create);
const expertDataInitialState = reactive<Expert>({
  uid: '',
  name: {
    first_name: '',
    last_name: '',
    middle_name: '',
    extension: ''
  },
  contact: {
    is_displayed: true,
    value: ''
  },
  expertise: [],
  organization: '',
  additional_info: ''
})

const expertData = reactive({
  ...expertDataInitialState
})


const clearFields = ( ) => {
  Object.assign(expertData, {...expertDataInitialState})
}


const addExpertData = async () => {
  expertData.name = JSON.stringify(expertData.name)
  expertData.expertise = arrayToString(<string[]>expertData.expertise)
  await addExpert(expertData, <string>expertData.organization)
  clearFields()
}

const updateExpertData = async () => {
  expertData.name = JSON.stringify(expertData.name)
  expertData.expertise = arrayToString(<string[]>expertData.expertise)
  await updateExpert(expertData, expertData.uid as string, <string>expertData.organization)
  clearFields()
}

onMounted(async () => {
  organizations.value = (await fetchOrganizationByUser()).filter(org => !org.is_deleted);
  expertData.organization = organizations.value[0].uid
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[1];

  if(type === 'edit') {
    formType.value = FormType.edit
    const fetchedData = await fetchExpertById(route.params.slug as string)
    Object.assign(expertData, {...fetchedData})
    if ("uid" in fetchedData.organization) {
      expertData.organization = fetchedData.organization.uid
    }
  }
})


</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <MainLayout :title="formType === FormType.edit ? 'Edit Expert' : 'New Expert'">
    <VForm id="form" ref="sectorForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div class="d-flex">
          <!--          <RouterLink-->
          <!--              :to="{-->
          <!--          name: path == 'sectors' ?  'sectors' : 'my-sectors'-->
          <!--        }"-->
          <!--              class="text-decoration-none text-none">-->
          <!--            <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">-->
          <!--              <PhArrowLeft size="14" class="mr-1"/>-->
          <!--              Back To {{path == 'sectors' ?  'Sectors' : 'My Sectors'}}-->
          <!--            </p>-->
          <!--          </RouterLink>-->
        </div>
        <div>
          <p class="text-heading d-flex align-center">
            {{formType === FormType.edit ? 'Edit Expert' : 'Add New Expert'}}
          </p>
          <p class="text-subtitle">
            An expert is a person with expertise in field that is part of a consortium member institution.
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Expert First Name<span class="text-pink">*</span></label>
          <VTextField
              v-if="typeof expertData.name === 'object'"
              v-model="expertData.name.first_name"
              placeholder="Enter first name"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Expert Middle Name</label>
          <VTextField
              v-if="typeof expertData.name === 'object'"
              v-model="expertData.name.middle_name"
              placeholder="Enter middle name"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Expert Last Name<span class="text-pink">*</span></label>
          <VTextField
              v-if="typeof expertData.name === 'object'"
              v-model="expertData.name.last_name"
              placeholder="Enter last name"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Expert Name Extension</label>
          <VTextField
              v-if="typeof expertData.name === 'object'"
              v-model="expertData.name.extension"
              placeholder="Enter extension"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Assigned Consortium Member Institution<span class="text-pink">*</span></label>
          <VAutocomplete
              v-model="expertData.organization"
              placeholder="Select Organization"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="organizations"
              :item-value="organization => `${organization.uid}`"
              :item-title="organization => `${organization.name} (${organization.acronym})`"
          >
            <template v-slot:item="{ props, item }">
              <VListItem
                  v-bind="props"
                  :prepend-avatar="item.raw.image"
                  :subtitle="item.raw.email"
                  :title="`${item.raw.name} (${item.raw.acronym})`"
              ></VListItem>
            </template>
          </VAutocomplete>
        </div>
        <div class="mb-3">
          <label class="input-label">Expertise</label>
          <VAutocomplete
              v-model="expertData.expertise as string[]"
              placeholder="Select expertise"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              :items="expertise"
              base-color="gs60"
              multiple
              chips
              closable-chips
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Expert Contact Number </label>
          <VTextField
              v-model="expertData.contact.value"
              placeholder="Enter contact number"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Contact Visibility </label>
          <VAutocomplete
              v-model="expertData.contact.is_displayed"
              placeholder="Select visibility"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="contactVisibility"
              :item-title="item => item.title"
              :item-value="item => item.value"
          />
        </div>
        <div class="mb-3" v-if="expertData.additional_info">
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="expertData.additional_info"
              @update:modelValue="$event => (expertData.additional_info = $event)"
              placeholder="Enter additional information related to this expert"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="expertData.additional_info"
              @update:modelValue="$event => (expertData.additional_info = $event)"
              placeholder="Enter additional information related to this expert"
          />
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              @click="formType === FormType.edit ? updateExpertData() : addExpertData()"
              rounded="lg"
              height="44px"
              width="166px"
          >
            Submit
          </VBtnPrimaryFilled>
        </VRow>
      </div>
    </VForm>

  </MainLayout>
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
.circle::after {
  content: '';
  position: absolute;
  right: -168px;
  top: -490px;
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

.error-file-container{
  border: 2px dashed #b00020;
  background-color: #ffeeee;
}

.dropzone-active{
  border: 4px dashed #00838F !important;
  background-color: #f2f2f2;
}


.text-dropzone{
  font-size: 14px;
}

.file-label{
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}

.back-button{
  font-size: 14px;
}
.back-button:hover{
  border-radius: 8px;
  background-color: #f2f7fa;
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

:deep(textarea::placeholder){
  color: #5F6061;
  opacity: 90%;
}
</style>
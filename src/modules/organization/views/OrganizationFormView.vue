<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {OrganizationType} from "../../../interfaces/enums/organization.enum.ts"
import {onMounted, reactive, ref} from "vue";
import {PhArrowLeft, PhFileDashed} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {useOrganizationServices} from "../services/organization.services.ts";

const organizationForm = ref(null);
const visibility = ref("public");
const type = ref("institution");
const formType = ref<FormType>(FormType.create);
const {addOrganization, errorMessage, hasErrorMessages} = useOrganizationServices();

const {route} = useRouting();

// const clusters: string[] = Object.values(ClusterType);
const organizationDataInitialState = reactive<Organization>({
  is_public: true,
  name: '',
  acronym: '',
  description: '',
  geojson: '',
  slug: '',
  image: '',
  type: OrganizationType.Institution,
  website: '',
  address: '',
  tel: '',
  phone: '',
  email: '',
  president: '',
  rd_rep: {
    email: '',
    name: '',
    phone: '',
  },
  tt_rep: {
    email: '',
    name: '',
    phone: '',
  },
  ic_rep: {
    email: '',
    name: '',
    phone: '',
  },
  sc_rep: {
    email: '',
    name: '',
    phone: '',
  },
});

const organization = reactive<Organization>({
  ...organizationDataInitialState
});

const clearFields = () => {
  Object.assign(organization, {...organizationDataInitialState});
}

const scrollToFirstErrorMessage = () => {
  //@ts-ignore
  const fields = organizationForm.value.items
  const firstErrorField = fields.find((field: any) => field.errorMessages.length > 0);
  const element = document.getElementById(firstErrorField.id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  }
}

const addOrganizationData = async () => {
  await addOrganization(organization)
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }
}

onMounted(() => {
  const type = <string>route.path.split('/').filter(Boolean).pop()
  if(type === 'edit') {
    formType.value = FormType.edit
  }
})



</script>

<template>
  <MainLayout title="New Organization">
    <VForm ref="organizationForm" style="height: 100%" class="relative-container circle">
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
      <div class="px-6 py-6">
        <label class="input-label mb-3">Organization Visibility</label>
        <VRadioGroup hide-details v-model="visibility">
          <VRadio color="bs50" value="public" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Public</p>
                <p class="radio-text-subtitle">The repository is accessible to the general public for content exploration.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" value="withinorg" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within Organization</p>
                <p class="radio-text-subtitle">The repository's content is exclusively visible to members within the organization.</p>
              </div>
            </template>
          </VRadio>
<!--          <VRadio color="bs50" value="withinall" class="my-3">-->
<!--            <template v-slot:label>-->
<!--              <div>-->
<!--                <p class="radio-text-heading">Within All Organization</p>-->
<!--                <p class="radio-text-subtitle">The repository's content is visible to all members of any organization</p>-->
<!--              </div>-->
<!--            </template>-->
<!--          </VRadio>-->
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="px-6 py-6">
        <label class="input-label mb-3">Organization Type</label>
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
        <div class="mb-3">
          <label class="input-label">Organization Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.name"
              placeholder="E.g. Central Mindanao University"
              class="my-2"
              :error-messages="errorMessage.name"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Organization Acronym</label>
          <VTextField
              v-model="organization.acronym"
              placeholder="E.g. CMU"
              class="my-2"
              :error-messages="errorMessage.acronym"
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
<!--              :error-messages="errorMessage"-->
<!--              rounded="lg"-->
<!--              density="comfortable"-->
<!--              variant="outlined"-->
<!--              color="primary"-->
<!--              base-color="gs60"-->
<!--          />-->
        </div>
        <div class="mb-3">
          <label class="input-label">Address<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.address"
              placeholder="E.g. University"
              class="my-2"
              :error-messages="errorMessage.address"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">President<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.president"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.president"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Telephone Number<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.tel"
              placeholder="E.g. 000-888-000"
              class="my-2"
              :error-messages="errorMessage.tel"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Cell Number<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.phone"
              placeholder="E.g. 09510055677"
              class="my-2"
              :error-messages="errorMessage.phone"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Email<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.email"
              placeholder="E.g. cmu@edu.ph"
              class="my-2"
              :error-messages="errorMessage.email"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Website<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.website"
              placeholder="E.g. www.cmu.edu.ph"
              class="my-2"
              :error-messages="errorMessage.website"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
<!--        <div v-for="cluster in clusters">-->
<!--          <div class="mb-3">-->
<!--            <label class="input-label">{{cluster}} Name<span class="text-pink">*</span></label>-->
<!--            <VTextField-->
<!--                placeholder="E.g. John Doe"-->
<!--                class="my-2"-->
<!--                :error-messages="errorMessage"-->
<!--                rounded="lg"-->
<!--                density="comfortable"-->
<!--                variant="outlined"-->
<!--                color="primary"-->
<!--                base-color="gs60"-->
<!--            />-->
<!--          </div>-->
<!--          <div class="mb-3">-->
<!--            <label class="input-label">{{cluster}} Email<span class="text-pink">*</span></label>-->
<!--            <VTextField-->
<!--                placeholder="E.g. johndoe@example.com"-->
<!--                class="my-2"-->
<!--                :error-messages="errorMessage"-->
<!--                rounded="lg"-->
<!--                density="comfortable"-->
<!--                variant="outlined"-->
<!--                color="primary"-->
<!--                base-color="gs60"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
        <div class="mb-3">
          <label class="input-label">Research & Development Representative Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.rd_rep.name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.rd_rep.name"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
        <label class="input-label">Research & Development Representative Email<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.rd_rep.email"
              placeholder="E.g. johndoe@example.com"
              class="my-2"
              :error-messages="errorMessage.rd_rep.email"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Research & Development Representative Phone<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.rd_rep.phone"
              placeholder="E.g. 09123456789"
              class="my-2"
              :error-messages="errorMessage.rd_rep.phone"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Transfer Representative Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.tt_rep.name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.tt_rep.name"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Transfer Representative Email<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.tt_rep.email"
              placeholder="E.g. johndoe@example.com"
              class="my-2"
              :error-messages="errorMessage.tt_rep.email"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Transfer Representative Phone<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.tt_rep.phone"
              placeholder="E.g. 09123456789"
              class="my-2"
              :error-messages="errorMessage.tt_rep.phone"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Information Communication Representative Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.ic_rep.name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.ic_rep.name"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Information Communication Representative Email<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.ic_rep.email"
              placeholder="E.g. johndoe@example.com"
              class="my-2"
              :error-messages="errorMessage.ic_rep.email"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Information Communication Representative Phone<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.ic_rep.phone"
              placeholder="E.g. 09123456789"
              class="my-2"
              :error-messages="errorMessage.ic_rep.phone"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Science Communication Representative Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.sc_rep.name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.sc_rep.name"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Science Communication Representative Email<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.sc_rep.email"
              placeholder="E.g. johndoe@example.com"
              class="my-2"
              :error-messages="errorMessage.sc_rep.email"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Science Communication Representative Phone<span class="text-pink">*</span></label>
          <VTextField
              v-model="organization.sc_rep.phone"
              placeholder="E.g. 09123456789"
              class="my-2"
              :error-messages="errorMessage.sc_rep.phone"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
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
            <VFileInput id="dropzoneFileGeoJSON" style="display: none"/>
          </div>
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              @click="addOrganizationData"
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

.back-button{
  width: 175px;
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
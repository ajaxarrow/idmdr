<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, reactive, ref, watch} from "vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {PhArrowLeft, PhFile, PhFileDashed, PhImage, PhTrash, PhX} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {useOrganizationServices} from "../services/organization.services.ts";
import {OrganizationAttachment} from "../../../interfaces/organization.interface.ts";
import {useOrganizationAttachmentServices} from "../services/organization-attachments.services.ts";

const {fetchOrganizationVisibility, loading} = useOrganizationServices();
const {fetchAttachmentsByOrganization, deleteAttachment, updateAttachment, addAttachment} = useOrganizationAttachmentServices()
// const visibilityInfo = [
//   {
//     name: 'Public',
//     value: 1
//   },
//   {
//     name: 'Private',
//     value: 2
//   },
//   {
//     name: 'Within Organization',
//     value: 3
//   },
//   {
//     name: 'Within All Organizations',
//     value: 4
//   }
// ]
const {showSnackbarMessage} = useSnackbarStore();
const {router, route} = useRouting();
const repositoryForm = ref(null);
const visibility = ref(0)
const path = ref('organizations')
const attachments = ref<OrganizationAttachment[]>([])
const attachmentData = reactive<OrganizationAttachment>({
  organization: <string>route.params.slug,
  attachment: '',
  file: null,
  file_type: '',
  mime_type: '',
  name: '',
  description: '',
  created_at: '',
  updated_at: '',
  is_deleted: false,
  deleted_at: '',
  visibility: visibility.value,
  type: 'create',
  errorMessage: '',
  showFiles: false,
  isDescriptionUpdated: false,
  isFileUpdated: false,
  isNameUpdated: false
})
const active = ref(false)
const toggleActive = () => {
  active.value = !active.value
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1);
  active.value = false
}

const addFileAttachment = () => {
  attachments.value.push({
    ...attachmentData
  })
}

const handleBulkAttachmentsUpload = (e: any) => {
  const files = e.target?.files || e.dataTransfer?.files;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      attachments.value.push({
        ...attachmentData,
        file: files[i],
        attachment: files[i],
      });
    }
  }
}

const handleIndividualAttachmentsUpload = (e: any, index: number) => {
  const target = e.target;
  if (target.files && target.files[0]) {
    if(attachments.value[index].type === 'update'){
      attachments.value[index].isFileUpdated = true
    }
    attachments.value[index].file = target.files[0];
    attachments.value[index].attachment = target.files[0];
  }
}

watch(
    () => attachments.value.map(attachment => attachment.description),
    (newDescriptions, oldDescriptions) => {
      newDescriptions.forEach((description, index) => {
        if (oldDescriptions[index] !== undefined && description !== oldDescriptions[index] && attachments.value[index].type === 'update') {
          attachments.value[index].isDescriptionUpdated = true
        }
      });
    }
);

watch(
    () => attachments.value.map(attachment => attachment.name),
    (newName, oldName) => {
      newName.forEach((name, index) => {
        if (oldName[index] !== undefined && name !== oldName[index] && attachments.value[index].type === 'update') {
          attachments.value[index].isNameUpdated = true
        }
      });
    }
);

const validateAttachments = () => {
  let isValid = true;
  for (let i = 0; i < attachments.value.length; i++) {
    if(attachments.value[i].type == 'update' && !attachments.value[i].file && attachments.value[i].attachment == ''){
      attachments.value[i].errorMessage = 'File is required';
      return false;
    }
    if(attachments.value[i].type == 'update'){
      isValid = true;
    } else {
      if (!attachments.value[i].file) {
        attachments.value[i].errorMessage = 'File is required';
        isValid = false;
      } else {
        attachments.value[i].errorMessage = '';
      }
    }

  }

  return isValid;
}

const deleteAttachmentCallback = async (id: string, index: number) => {
  await deleteAttachment(id);
  attachments.value.splice(index, 1);
  showSnackbarMessage('Attachment Deleted Successfully', Status.success)
}

const clearAttachment = (index: number) => {
  attachments.value[index].file = null
  attachments.value[index].attachment = ''
}

const uploadProjectFiles = async() => {
  if(validateAttachments()){
    loading.value = true
    for (let i = 0; i < attachments.value.length; i++) {
      if (attachments.value[i].description == ''){
        attachments.value[i].description = `This is ${attachments.value[i].file?.name!}`;
      }
      if(attachments.value[i].type == 'create'){
        attachments.value[i].name = attachments.value[i].file?.name!
      }
    }
    if(attachments.value.length > 0){
      for (let i = 0; i < attachments.value.length; i++) {
        attachments.value[i].organization = <string>route.params.slug
        if(attachments.value[i].type == 'create') {
          await addAttachment(attachments.value[i]);
        } else {
          if(attachments.value[i].isDescriptionUpdated || attachments.value[i].isFileUpdated) {
            await updateAttachment(attachments.value[i]);
          }
        }
      }
    }
    await localStorage.setItem('snackbarmessage', JSON.stringify({
      message: 'Project Files Updates successfully',
      status: 'success'
    }))
    await router.push({
      name: path.value == 'organizations' ?  'organization-data' : 'my-organization-data',
      params: {
        slug: <string>route.params.slug
      }
    })
  }
}
const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

onMounted(async ()=>{
  path.value = getFirstPath(<string>route.path)
  visibility.value =  await fetchOrganizationVisibility(<string>route.params.slug)
  attachmentData.visibility = visibility.value
  const fetchedFiles = await fetchAttachmentsByOrganization(<string>route.params.slug, 'update')
  for(let i = 0; i < fetchedFiles.length; i++){
    attachments.value.push({
      ...fetchedFiles[i],
      file: null,
      attachment: fetchedFiles[i].attachment,
      isDescriptionUpdated: false,
      isFileUpdated: false
    })
  }
})


</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <MainLayout title="Upload Project Files">
    <VForm id="form" ref="repositoryForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div class="d-flex">
          <RouterLink
              :to="{
                name: 'my-organization-settings',
                params: {
                  slug: <string>route.params.slug
                }
              }"
              class="text-decoration-none text-none">
            <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
              <PhArrowLeft size="14" class="mr-1"/>
              Back To Organization Settings
            </p>
          </RouterLink>
        </div>
        <div>
          <p class="text-heading d-flex align-center">
            Upload Organization Files
          </p>
          <p class="text-subtitle">
            Upload files to your organization
          </p>
        </div>
      </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-10">
          <div v-if="attachments.length == 0">
            <label class="input-label">File</label>
            <div
                class="my-2 file-upload-container"
                :class="{'dropzone-active': active}"
                @dragover.prevent
                @dragenter.prevent="toggleActive"
                @dragleave.prevent="toggleActive"
                @drop.prevent="handleBulkAttachmentsUpload">
              <PhFileDashed size="50"/>
              <p class="text-dropzone">Drag and drop files here or <label class="file-label" for="dropzoneFile">Choose files</label></p>
              <VFileInput @change="handleBulkAttachmentsUpload" multiple id="dropzoneFile" style="display: none"/>
            </div>
            <small>Maximum file size: 10 MB per file</small>
          </div>
          <div v-else>
            <label class="input-label mb-5">Files</label>
            <div
                class="attachments-container mt-2"
                :class="{'dropzone-active': active}"
                @dragover.prevent
                @dragenter.prevent="toggleActive"
                @dragleave.prevent="toggleActive"
                @drop.prevent="handleBulkAttachmentsUpload">
              <div
                  v-for="(attachment, index) in attachments"
                  :key="index"
              >
                <VDivider  v-if="index != 0"/>
                <div :class="{'mb-5': !attachment.showFiles}"  class="d-flex align-center justify-space-between mt-5">
                  <p style="font-size: 16px; font-weight: 700;">{{attachment.file ? attachment?.file?.name : (attachment.attachment != '' ? attachment.name as string : 'New File')}}</p>
                  <div class="d-flex align-center justify-space-between ga-2">
                    <DeleteDialog v-if="attachment.type == 'update'" @callback="deleteAttachmentCallback(<string>attachment.uid, index)">
                      <VTooltip location="bottom" >
                        <template v-slot:activator="{ props }">
                          <PhTrash v-bind="props" class="cursor-pointer" />
                        </template>
                        <span>Delete Attachment</span>
                      </VTooltip>
                    </DeleteDialog>
                    <VTooltip location="bottom" v-else>
                      <template v-slot:activator="{ props }">
                        <PhX v-bind="props" class="cursor-pointer" @click="removeAttachment(index)"/>
                      </template>
                      <span>Remove Attachment</span>
                    </VTooltip>
                    <VTooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <component
                            :is="attachment.showFiles ? 'PhCaretUp' : 'PhCaretDown'"
                            v-bind="props"
                            class="cursor-pointer"
                            @click="attachment.showFiles = !attachment.showFiles"
                        />
                      </template>
                      <span>{{attachment.showFiles ? 'Hide Files' : 'Show Files'}}</span>
                    </VTooltip>
                  </div>
                </div>
                <p class="pl-2 pb-2" style="color: #b00020; font-size: 14px;" v-if="attachment.errorMessage && !attachment.showFiles">{{attachment.errorMessage}}</p>
                <div v-if="attachment.showFiles">
                  <div class="mt-5 mb-3">
                    <label class="input-label">Attachment</label>
                    <div v-if="attachment.file || attachment.attachment != ''" class="my-3">
                      <VDivider/>
                      <div class="d-flex align-center justify-space-between pa-2" >
                        <p class="dialog-boundary-title d-flex align-center">
                          <PhImage class="mr-1"/>
                          {{attachment.file ? attachment.file.name : attachment.name }}
                        </p>
                        <div class="d-flex align-center ga-2">
                          <VTooltip location="bottom">
                            <template v-slot:activator="{ props }">
                              <PhX v-bind="props" class="cursor-pointer" @click="clearAttachment(index)"/>
                            </template>
                            <span>Remove File</span>
                          </VTooltip>
                        </div>
                      </div>
                      <VDivider/>
                      <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="attachment.errorMessage">{{attachment.errorMessage}}</p>
                    </div>
                    <VFileInput
                        v-else
                        @change="handleIndividualAttachmentsUpload($event, index)"
                        label="Choose File by Clicking Here"
                        class="my-2"
                        rounded="lg"
                        density="comfortable"
                        variant="outlined"
                        color="primary"
                        base-color="gs60"
                        chips
                        prepend-icon=""
                        :error-messages="attachments[index].errorMessage as string"
                    >
                      <template v-slot:prepend-inner>
                        <PhFile/>
                      </template>
                    </VFileInput>
                  </div>
                  <div class="mb-3">
                    <label class="input-label">Attachment Name</label>
                    <VTextField
                        v-model="attachments[index].name"
                        label="Enter File Name"
                        class="my-2"
                        rounded="lg"
                        density="comfortable"
                        variant="outlined"
                        color="primary"
                        base-color="gs60"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="input-label">Attachment Description</label>
                    <VTextField
                        v-model="attachments[index].description"
                        label="Enter File Description"
                        class="my-2"
                        rounded="lg"
                        density="comfortable"
                        variant="outlined"
                        color="primary"
                        base-color="gs60"
                    />
                  </div>
<!--                  <div class="mb-3">-->
<!--                    <label class="input-label d-flex justify-space-between">-->
<!--                      Attachment Visibility-->
<!--                      <span style="font-size: 14px; font-weight: 400;">-->
<!--                    <AttachmentsVisibilityInfoDialog/>-->
<!--                  </span>-->
<!--                    </label>-->
<!--                    <VAutocomplete-->
<!--                        v-model="attachments[index].visibility"-->
<!--                        :items="visibilityInfo"-->
<!--                        :item-title="item => item.name"-->
<!--                        :item-value="item => item.value"-->
<!--                        label="Enter File Visibility"-->
<!--                        class="my-2"-->
<!--                        rounded="lg"-->
<!--                        density="comfortable"-->
<!--                        variant="outlined"-->
<!--                        color="primary"-->
<!--                        base-color="gs60"-->
<!--                    />-->
<!--                  </div>-->
                </div>
                <VDivider v-if="index != attachments.length - 1 "/>
              </div>
              <div class="d-flex justify-end">
                <VBtnPrimaryFilled
                    @click="addFileAttachment"
                    rounded="lg"
                    style="font-size: 14px !important;"
                >
                  Add More File
                </VBtnPrimaryFilled>
              </div>
            </div>
          </div>
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              @click="uploadProjectFiles"
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
.attachments-container{
  max-height: 400px;
  overflow-y: scroll;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  padding: 20px 25px;
  transition: height 1s ease;
}
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

.disabled-cursor {
  cursor: not-allowed;
}
</style>
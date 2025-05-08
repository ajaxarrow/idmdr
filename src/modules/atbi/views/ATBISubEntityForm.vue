<script setup lang="ts">

import {computed, onMounted, reactive, ref} from "vue";
import {AtbiSubEntity, AtbiSubEntityImage} from "../../../interfaces/atbi.interface.ts";
import {useAtbiSubEntityServices} from "../services/atbi-sub-entity.services.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useAtbiSubEntityImagesServices} from "../services/atbi-sub-entity-images.services.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {PhEye, PhFileDashed, PhImage, PhTrash, PhX} from "@phosphor-icons/vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";

const {loading, errorMessage, hasErrorMessages, addAtbiSubEntity, updateAtbiSubEntity, fetchAtbiSubEntityData} = useAtbiSubEntityServices()
const {showSnackbarMessage} = useSnackbarStore();
const {deleteAtbiSubEntityImage} = useAtbiSubEntityImagesServices()

const atbiSubEntityInitialState = reactive<AtbiSubEntity>({
  atbi: "",
  description: "",
  entity_type: "",
  images: [],
  logo: "",
  name: "",
  quantity: 0,
  unit: "",
  uuid: "",
  price: 0.0
})
const formType = ref<FormType>(FormType.create);
const path = ref('organizations')
const atbiSubEntityForm = ref(null)
const {route} = useRouting();
const type = ref(route.params.type as string)
const capitalizedType = computed(() => {
  return type.value
      ? type.value.charAt(0).toUpperCase() + type.value.slice(1)
      : '';
});
const pageLoading = ref(false)
const atbiSubEntityData = reactive<AtbiSubEntity>({...atbiSubEntityInitialState})
const atbiSubEntityImages = ref<AtbiSubEntityImage[]>([])
const active = ref(false);
const isImagePreviewed = ref(false);
const previewImage = ref('');
const hasImage = ref(false);
const file = ref<File | null>(null);
const toggleActive = () => {
  active.value = !active.value;
};

const entityType = computed(() => {
  switch (route.params.type) {
    case 'facility':
      return 'facilities'
    case 'product':
      return 'products'
    case 'linkage':
      return 'linkages'
    default:
      return 'awards'
  }
})

// const handleUploadChange = (e: any) => {
//   const target = e.target;
//   if (target.files && target.files[0]) {
//     file.value = target.files[0];
//     const reader = new FileReader();
//
//     reader.onload = () => {
//       previewImage.value = reader.result as string;
//     };
//
//     reader.readAsDataURL(<File>file.value);
//     hasImage.value = true;
//   }
// };

const addAttachment = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.addEventListener('change', handleBulkImagesUpload);
  fileInput.click();
};

const removeImage = (index: number) => {
  atbiSubEntityImages.value.splice(index, 1);
};


const previewImageFile = (index: number) => {
  previewImage.value = <string>atbiSubEntityImages.value[index].previewImage;
  isImagePreviewed.value = true;
};


const clearFields = () => {
  Object.assign(atbiSubEntityData, {...atbiSubEntityInitialState});
  atbiSubEntityImages.value = [];
};


const handleBulkImagesUpload = (e: any) => {
  const files = e.target?.files || e.dataTransfer?.files;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result as string;
        atbiSubEntityImages.value.push({
          entity: "",
          file: files[i],
          image: files[i],
          previewImage: data,
          type: 'create',
          uuid: ''
        });
      };

      reader.readAsDataURL(files[i]);
    }
  }
};

const scrollToFirstErrorMessage = () => {
  //@ts-ignore
  const fields = atbiSubEntityForm.value.items
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

const deleteAtbiSubEntityImageCallback = async (id: string, index: number) => {
  await deleteAtbiSubEntityImage(id);
  atbiSubEntityImages.value.splice(index, 1);
  showSnackbarMessage('Image Deleted Successfully', Status.success);
};

const addAtbiSubEntityData = async() => {
  if(atbiSubEntityImages.value.length > 0) {
    atbiSubEntityData.images = [...atbiSubEntityImages.value]
  }
  if(file.value){
    //@ts-ignore
    atbiData.logo = file.value as File
  } else {
    delete atbiSubEntityData.logo;
  }
  await addAtbiSubEntity(atbiSubEntityData, entityType.value);
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }
}

const updateAtbiSubEntityData = async() => {
  if(atbiSubEntityImages.value.length > 0) {
    atbiSubEntityData.images = [...atbiSubEntityImages.value]
  }
  if(file.value){
    //@ts-ignore
    atbiData.logo = file.value as File
  } else {
    delete atbiSubEntityData.logo;
  }
  await updateAtbiSubEntity(atbiSubEntityData, entityType.value, atbiSubEntityData.uuid as string);
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }
}



const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
};


onMounted(async() => {
  pageLoading.value = true
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[3];
  path.value = getFirstPath(route.path);
  atbiSubEntityData.entity_type = route.params.type as string
  atbiSubEntityData.atbi = route.params.atbi as string
  if(type === 'edit'){
    formType.value = FormType.edit
    const atbiSubEntity = await fetchAtbiSubEntityData(route.params.slug as string)
    Object.assign(atbiSubEntityData, {...atbiSubEntity})
    if (Array.isArray(atbiSubEntityData.images)) {
      for (let i = 0; i < atbiSubEntityData.images.length; i++) {
        atbiSubEntityImages.value.push({
          ...atbiSubEntityData.images[i],
          file: null,
          image: atbiSubEntityData.images[i].image,
          previewImage: atbiSubEntityData.images[i].image as string,
          type: 'update'
        });
      }
    }
    previewImage.value = <string>atbiSubEntityData.logo
    hasImage.value = true
  }
  pageLoading.value = false
})
</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <MainLayout :title="formType === FormType.edit ? `Edit ${capitalizedType}` : `New ${capitalizedType}` ">
    <div v-if="pageLoading" class="loading-state-container h-screen">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <VForm v-else id="form" ref="atbiSubEntityForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div class="d-flex">
        </div>
        <div>
          <p class="text-heading d-flex align-center">
            {{formType === FormType.edit ? `Edit ${capitalizedType}` : `Add ${capitalizedType}`}}
          </p>
          <p class="text-subtitle">
            Edit {{capitalizedType}} for the selected ATBI
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="atbiSubEntityData.name"
              placeholder="Enter Name"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.name"
          />
        </div>
        <div class="mb-3" v-if="atbiSubEntityData.description">
          <label class="input-label">Description</label>
          <QuillRichTextEditor
              :modelValue="atbiSubEntityData.description"
              @update:modelValue="$event => (atbiSubEntityData.description = $event)"
              placeholder="Enter content about this atbi"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Description</label>
          <QuillRichTextEditor
              :modelValue="atbiSubEntityData.description"
              @update:modelValue="$event => (atbiSubEntityData.description = $event)"
              placeholder="Enter content about this atbi"
          />
        </div>

        <div v-if="type == 'product' || type == 'facility'" class="mb-3">
          <label class="input-label">{{type == 'product' ? 'Quantity' : 'Capacity'}}</label>
          <VTextField
              v-model="atbiSubEntityData.quantity"
              type="number"
              step="1"
              min="0"
              placeholder="Enter unit"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.quanity"
          />
        </div>
        <div v-if="type == 'product' || type == 'facility'"  class="mb-3">
          <label class="input-label">{{type == 'product' ? 'Price' : 'Booking Price'}}</label>
          <VTextField
              v-model="atbiSubEntityData.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter unit"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.price"
          />
        </div>
        <div v-if="type == 'product'" class="mb-3">
          <label class="input-label">Unit</label>
          <VTextField
              v-model="atbiSubEntityData.unit"
              placeholder="Enter unit"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.unit"
          />
        </div>
<!--        <div class="mb-5">-->
<!--          <label class="input-label">{{ capitalizedType }} Logo/Image</label>-->
<!--          <div v-if="hasImage" class="my-3">-->
<!--            <VDivider/>-->
<!--            <div class="d-flex align-center justify-space-between pa-2" >-->
<!--              <p class="dialog-boundary-title d-flex align-center">-->
<!--                <PhImage class="mr-1"/>-->
<!--                {{-->
<!--                  file ? file?.name :-->
<!--                      (typeof atbiSubEntityData?.logo === 'string' ? atbiSubEntityData.logo.split('/').pop() as string : '')-->
<!--                }}-->

<!--              </p>-->
<!--              <div class="d-flex align-center ga-2">-->
<!--                <VTooltip location="bottom">-->
<!--                  <template v-slot:activator="{ props }">-->
<!--                    <PhEye v-bind="props" class="cursor-pointer" @click="isImagePreviewed = true"/>-->
<!--                  </template>-->
<!--                  <span>Preview Image</span>-->
<!--                </VTooltip>-->
<!--                <VTooltip location="bottom">-->
<!--                  <template v-slot:activator="{ props }">-->
<!--                    <PhX v-bind="props" class="cursor-pointer" @click="removeImage"/>-->
<!--                  </template>-->
<!--                  <span>Remove Saved Image</span>-->
<!--                </VTooltip>-->
<!--              </div>-->
<!--            </div>-->
<!--            <VDivider/>-->
<!--          </div>-->
<!--          <VFileInput-->
<!--              v-else-->
<!--              @change="handleUploadChange"-->
<!--              label="Choose Organization Image by Clicking Here"-->
<!--              class="my-2"-->
<!--              rounded="lg"-->
<!--              density="comfortable"-->
<!--              variant="outlined"-->
<!--              color="primary"-->
<!--              base-color="gs60"-->
<!--              chips-->
<!--              prepend-icon=""-->
<!--              hint="Choose an image that will represent the entire atbi. It could be an atbi logo or a brand image. "-->
<!--              accept="image/*"-->
<!--          >-->
<!--            <template v-slot:prepend-inner>-->
<!--              <PhFileImage/>-->
<!--            </template>-->
<!--          </VFileInput>-->
<!--        </div>-->
        <div class="mb-10">
          <div v-if="atbiSubEntityImages.length === 0">
            <label class="input-label">Images</label>
            <div
                class="my-2 file-upload-container"
                :class="{'dropzone-active': active}"
                @dragover.prevent
                @dragenter.prevent="toggleActive"
                @dragleave.prevent="toggleActive"
                @drop.prevent="handleBulkImagesUpload">
              <PhFileDashed size="50"/>
              <p class="text-dropzone">Drag and drop files here or <label class="file-label" for="dropzoneFile">Choose files</label></p>
              <VFileInput @change="handleBulkImagesUpload" multiple accept="image/*"  id="dropzoneFile" style="display: none"/>
            </div>
          </div>
          <div v-else>
            <label class="input-label mb-5">Images</label>
            <div class="attachments-container mt-2"
                 :class="{'dropzone-active': active}"
                 @dragover.prevent
                 @dragenter.prevent="toggleActive"
                 @dragleave.prevent="toggleActive"
                 @drop.prevent="handleBulkImagesUpload">
              <div
                  v-for="(image, index) in atbiSubEntityImages"
                  :key="index"
              >
                <VDivider v-if="index !== 0"/>
                <VDivider/>
                <div class="d-flex align-center justify-space-between pa-2">
                  <p class="dialog-boundary-title d-flex align-center">
                    <PhImage class="mr-1"/>
                    {{
                      image.file ? image.file.name :
                          (typeof image.image === 'string' ? image.image.split('/').pop() : 'Image')
                    }}
                  </p>
                  <div class="d-flex align-center ga-2">
                    <VTooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <PhEye v-bind="props" class="cursor-pointer" @click="previewImageFile(index)"/>
                      </template>
                      <span>Preview Image</span>
                    </VTooltip>
                    <DeleteDialog v-if="image.type == 'update'" @callback="deleteAtbiSubEntityImageCallback(<string>image.uuid, index)">
                      <VTooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <PhTrash v-bind="props" class="cursor-pointer mt-2"/>
                        </template>
                        <span>Remove Image</span>
                      </VTooltip>
                    </DeleteDialog>
                    <VTooltip location="bottom" v-else>
                      <template v-slot:activator="{ props }">
                        <PhX v-bind="props" class="cursor-pointer" @click="removeImage(index)"/>
                      </template>
                      <span>Remove Image</span>
                    </VTooltip>
                  </div>
                </div>
                <VDivider v-if="index == atbiSubEntityImages.length - 1"/>
              </div>
              <div class="d-flex justify-end mt-3">
                <VBtnPrimaryFilled
                    @click="addAttachment"
                    rounded="lg"
                    style="font-size: 14px !important;"
                >
                  Add More File
                </VBtnPrimaryFilled>
              </div>
            </div>
          </div>
          <ImagePreviewOverlay
              :overlay="isImagePreviewed"
              :imageSrc="previewImage"
              @closeOverlay="isImagePreviewed = false"
          />
        </div>
        <VRow class="ma-0" justify="end" align="center">
          <VBtnPrimaryFilled
              @click="formType === FormType.edit ? updateAtbiSubEntityData() : addAtbiSubEntityData()"
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
  top: -490px;
  width: 640px;
  height: 591px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: 1;
  opacity: 75%;
}

.input-label{
  font-weight: 600;
}

.button-outline{
  border-width: 3px;
}
.action-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 10px;
}

.text-note{
  font-size: 14px;
  font-weight: 500;
  font-style: italic;
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
<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {ABH, AbhImage} from "../../../interfaces/abh.interface.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useAbhImagesServices} from "../services/abh-images.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useAbhServices} from "../services/abh.services.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {PhEye, PhFileDashed, PhImage, PhTrash, PhX} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {userData} = useUserStore();
const {route, router} = useRouting();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchRepositoryIDsByUser} = useRepositoryServices()
const {deleteAbhImage} = useAbhImagesServices();
const {addAbh, updateAbh, loading, fetchAbhData} = useAbhServices()
const path = ref('organizations')
const abhInitialState = reactive<ABH>({
  business_model_development: "",
  business_plan_preparation: "",
  feasibility: "",
  image_data: [],
  is_active: true,
  is_deleted: false,
  market_research: "",
  partnership_and_networking: "",
  tech_image: "",
  tech_name: "",
  technology: "",
  technology_assessment: "",
  technology_registration_assistance: "",
  uuid: ""
})
const formType = ref<FormType>(FormType.create);
const ipTechnologies = ref<Repository[]>([])
const abhData = reactive<ABH>({...abhInitialState})
const abhImages = ref<AbhImage[]>([])
const isImagePreviewed = ref(false);
const previewImage = ref('');
const active = ref(false);
const pageLoading = ref(false)
const toggleActive = () => {
  active.value = !active.value;
};

const addAttachment = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.addEventListener('change', handleBulkImagesUpload);
  fileInput.click();
};

const removeImage = (index: number) => {
  abhImages.value.splice(index, 1);
};


const previewImageFile = (index: number) => {
  previewImage.value = <string>abhImages.value[index].previewImage;
  isImagePreviewed.value = true;
};


const handleBulkImagesUpload = (e: any) => {
  const files = e.target?.files || e.dataTransfer?.files;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result as string;
        abhImages.value.push({
          file: files[i],
          image: files[i],
          previewImage: data,
          abh: '',
          type: 'create',
          uuid: ''
        });
      };

      reader.readAsDataURL(files[i]);
    }
  }
};

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
};

const deleteAbhImageCallback = async(uuid: string, index: number) => {
  await deleteAbhImage(uuid);
  abhImages.value.splice(index, 1);
  showSnackbarMessage('ABH Image Deleted Successfully', Status.success);
}

const addAbhData = async () => {
  if(abhImages.value.length > 0) {
    abhData.image_data = [...abhImages.value];
  }
  await addAbh(abhData, route.params.repo as string);
}

const updateAbhData = async () => {
  if(abhImages.value.length > 0) {
    abhData.image_data = [...abhImages.value];
  }
  await updateAbh(abhData, route.params.slug as string, route.params.repo as string);
}

onMounted(async () => {
  pageLoading.value = true;
  ipTechnologies.value = await fetchRepositoryIDsByUser(
      10000, !userData.is_superuser, '', '', '', true, true, 'Project Repository'
  );
  if(ipTechnologies.value.length > 0) {
    abhData.technology = ipTechnologies.value[0].slug
    abhData.technology = route.params.repo as string
  } else {
    await router.push({name: 'new-repository'})
    showSnackbarMessage('You have no associated technologies. You need to create an IP Technology first', Status.error)
  }

  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[2];
  path.value = getFirstPath(route.path);
  if(type === 'edit') {
    formType.value = FormType.edit
    const abh = await fetchAbhData(route.params.slug as string);
    if(!ipTechnologies.value.some(repository => repository.slug === abh?.technology) && !userData.is_superuser) {
      await router.push({name: 'repositories'})
    }
    Object.assign(abhData, {...abh});
    if (Array.isArray(abhData.image_data)) {
      for (let i = 0; i < abhData.image_data.length; i++) {
        abhImages.value.push({
          ...abhData.image_data[i],
          file: null,
          image: abhData.image_data[i].image,
          previewImage: abhData.image_data[i].image as string,
          type: 'update'
        });
      }
    }
    previewImage.value = <string>abhData.tech_image
  }

  pageLoading.value = false
})



</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <MainLayout :title="formType === FormType.edit ? 'Edit ABH' : 'New ABH'">
    <div v-if="pageLoading" class="loading-state-container h-screen">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <VForm v-else id="form" ref="atbiForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div class="d-flex">
        </div>
        <div>
          <p class="text-heading d-flex align-center">
            {{formType === FormType.edit ? 'Edit ABH' : 'Add New ABH'}}
          </p>
          <p class="text-subtitle">
            ABH means Agri-Aqua Business Hub. It is a program gears to support more incubatees in the Agri-Aqua sector.
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Associated IP Technology<span class="text-pink">*</span></label>
          <VAutocomplete
              v-model="abhData.technology"
              placeholder="Select IP Technology"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="ipTechnologies"
              :item-value="repository => `${repository.slug}`"
              :item-title="repository => `${repository.title}`"
          >
            <template v-slot:item="{ props, item }">
              <VListItem
                  v-bind="props"
                  :prepend-avatar="item.raw.image as string || 'https://dummyimage.com/600x400/023768/fff.png&text=Repo'"
                  :title="`${item.raw.title}`"
              ></VListItem>
            </template>
          </VAutocomplete>
        </div>
        <div class="mb-3" v-if="abhData.technology_assessment">
          <label class="input-label">Technology Assessment<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.technology_assessment"
              @update:modelValue="$event => (abhData.technology_assessment = $event)"
              placeholder="Enter technology assessment"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Technology Assessment<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.technology_assessment"
              @update:modelValue="$event => (abhData.technology_assessment = $event)"
              placeholder="Enter technology assessment"
          />
        </div>

        <div class="mb-3" v-if="abhData.business_model_development">
          <label class="input-label">Business Model Development<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.business_model_development"
              @update:modelValue="$event => (abhData.business_model_development = $event)"
              placeholder="Enter business model development"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Business Model Development<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.business_model_development"
              @update:modelValue="$event => (abhData.business_model_development = $event)"
              placeholder="Enter business model development"
          />
        </div>

        <div class="mb-3" v-if="abhData.business_plan_preparation">
          <label class="input-label">Business Plan Preparation<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.business_plan_preparation"
              @update:modelValue="$event => (abhData.business_plan_preparation = $event)"
              placeholder="Enter business plan preparation"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Business Plan Preparation<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.business_plan_preparation"
              @update:modelValue="$event => (abhData.business_plan_preparation = $event)"
              placeholder="Enter business plan preparation"
          />
        </div>

        <div class="mb-3" v-if="abhData.market_research">
          <label class="input-label">Market Research<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.market_research"
              @update:modelValue="$event => (abhData.market_research = $event)"
              placeholder="Enter market research"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Market Research<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.market_research"
              @update:modelValue="$event => (abhData.market_research = $event)"
              placeholder="Enter market research"
          />
        </div>

        <div class="mb-3" v-if="abhData.technology_registration_assistance">
          <label class="input-label">Technology Registration Assistance<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.technology_registration_assistance"
              @update:modelValue="$event => (abhData.technology_registration_assistance = $event)"
              placeholder="Enter technology registration assistance"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Technology Registration Assistance<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.technology_registration_assistance"
              @update:modelValue="$event => (abhData.technology_registration_assistance = $event)"
              placeholder="Enter technology registration assistance"
          />
        </div>

        <div class="mb-3" v-if="abhData.feasibility">
          <label class="input-label">Feasibility<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.feasibility"
              @update:modelValue="$event => (abhData.feasibility = $event)"
              placeholder="Enter feasibility"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Feasibility<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.feasibility"
              @update:modelValue="$event => (abhData.feasibility = $event)"
              placeholder="Enter feasibility"
          />
        </div>

        <div class="mb-3" v-if="abhData.partnership_and_networking">
          <label class="input-label">Partnership and Networking<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.partnership_and_networking"
              @update:modelValue="$event => (abhData.partnership_and_networking = $event)"
              placeholder="Enter partnership and networking"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Partnership and Networking<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="abhData.partnership_and_networking"
              @update:modelValue="$event => (abhData.partnership_and_networking = $event)"
              placeholder="Enter partnership and networking"
          />
        </div>
        <div class="mb-10">
          <div v-if="abhImages.length === 0">
            <label class="input-label">Images</label>
            <div
                class="my-2 file-upload-container"
                :class="{'dropzone-active': active}"
                @dragover.prevent
                @dragenter.prevent="toggleActive"
                @dragleave.prevent="toggleActive"
                @drop.prevent="handleBulkImagesUpload">
              <PhFileDashed size="50"/>
              <p class="text-dropzone">Drag and drop images here or <label class="file-label" for="dropzoneFile">Choose images here</label></p>
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
                  v-for="(image, index) in abhImages"
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
                    <DeleteDialog v-if="image.type == 'update'" @callback="deleteAbhImageCallback(<string>image.uuid, index)">
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
                <VDivider v-if="index == abhImages.length - 1"/>
              </div>
              <div class="d-flex justify-end mt-3">
                <VBtnPrimaryFilled
                    @click="addAttachment"
                    rounded="lg"
                    style="font-size: 14px !important;"
                >
                  Add More Image
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
          <VTooltip location="bottom">
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                <VBtnPrimaryFilled

                    :disabled="abhData.business_model_development === '' && abhData.business_plan_preparation === '' || abhData.market_research === '' || abhData.technology_registration_assistance === '' || abhData.feasibility === '' || abhData.partnership_and_networking === ''"
                    @click="formType === FormType.edit ? updateAbhData() : addAbhData()"
                    rounded="lg"
                    height="44px"
                    width="166px"
                >
                  Submit
                </VBtnPrimaryFilled>
              </div>

            </template>
            <span>The form can only be submitted if all required data is inputted.</span>
          </VTooltip>

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
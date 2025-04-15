<script setup lang="ts">
import {useAtbiServices} from "../services/atbi.services.ts";
import {useAtbiImagesServices} from "../services/atbi-images.services.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {onMounted, reactive, ref} from "vue";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {ATBI, AtbiImage} from "../../../interfaces/atbi.interface.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {CustomUserData} from "../../../interfaces/member.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useRepositoryMemberServices} from "../../repository/services/repository-member.services.ts";
import {PhEye, PhFileDashed, PhFileImage, PhImage, PhTrash, PhX} from "@phosphor-icons/vue";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {loading, errorMessage, hasErrorMessages, addAtbi, updateAtbi, fetchAtbiData} = useAtbiServices()
const {userData} = useUserStore()
const {fetchCustomUsers} = useRepositoryMemberServices();
const path = ref('organizations')
const atbiForm = ref(null)
const {route, router} = useRouting();
const {fetchRepositoryIDsByUser} = useRepositoryServices()
const formType = ref<FormType>(FormType.create);
const {deleteAtbiImage} = useAtbiImagesServices()
const {showSnackbarMessage} = useSnackbarStore();
const ipTechnologies = ref<Repository[]>([])
const customUsers = ref<CustomUserData[]>([])
const hasImage = ref(false);
const file = ref<File | null>(null);
const atbiInitialState = reactive<ATBI>({
  additional_info: "",
  description: "",
  email: "",
  facebook: "",
  logo: "",
  image_urls: [],
  is_active: true,
  is_deleted: false,
  mobile: "",
  name: "",
  owners: "",
  ownerData: [],
  technology: "",
  uuid: ""
})

const atbiData = reactive({...atbiInitialState})

const atbiImages = ref<AtbiImage[]>([])
const active = ref(false);
const isImagePreviewed = ref(false);
const previewImage = ref('');
const pageLoading = ref(false)

const toggleActive = () => {
  active.value = !active.value;
};

const handleUploadChange = (e: any) => {
  const target = e.target;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      previewImage.value = reader.result as string;
    };

    reader.readAsDataURL(<File>file.value);
    hasImage.value = true;
  }
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
  atbiImages.value.splice(index, 1);
};


const previewImageFile = (index: number) => {
  previewImage.value = <string>atbiImages.value[index].previewImage;
  isImagePreviewed.value = true;
};


const clearFields = () => {
  Object.assign(atbiData, {...atbiInitialState});
  atbiImages.value = [];
};

const handleBulkImagesUpload = (e: any) => {
  const files = e.target?.files || e.dataTransfer?.files;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result as string;
        atbiImages.value.push({
          file: files[i],
          image: files[i],
          previewImage: data,
          atbi: '',
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


const deleteAtbiImageCallback = async (id: string, index: number) => {
  await deleteAtbiImage(id);
  atbiImages.value.splice(index, 1);
  showSnackbarMessage('Post Image Deleted Successfully', Status.success);
};

const ownerRef = ref(null);
const ownerSearch = ref('')
const handleSearch = async (query: any) => {
  ownerSearch.value = query
}

const addCustomUser = () => {
  const newUser: CustomUserData = {
    type: 'custom',
    data: {
      username: ownerSearch.value as string,
      first_name: ownerSearch.value as string,
      last_name: '',
      email: '',
      uid: ''
    }
  };
  atbiData.ownerData?.push(newUser);
  ownerSearch.value = '';
  //@ts-ignore
  ownerRef.value.search = '';
}

const scrollToFirstErrorMessage = () => {
  //@ts-ignore
  const fields = atbiForm.value.items
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

const addAtbiData = async() => {
  if(atbiImages.value.length > 0) {
    atbiData.image_urls = [...atbiImages.value]
  }
  if(file.value){
    //@ts-ignore
    atbiData.logo = file.value as File
  } else {
    delete atbiData.logo;
  }
  atbiData.owners = JSON.stringify({
    data: atbiData.ownerData
  })
  await addAtbi(atbiData);
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }
}

const updateAtbiData = async() => {
  if(atbiImages.value.length > 0) {
    atbiData.image_urls = [...atbiImages.value]
  }
  if(file.value){
    //@ts-ignore
    atbiData.logo = file.value as File
  } else {
    delete atbiData.logo;
  }
  atbiData.owners = JSON.stringify({
    data: atbiData.ownerData
  })
  await updateAtbi(atbiData, atbiData.uuid as string);
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }
}

onMounted(async () => {
  pageLoading.value = true;
  customUsers.value = await fetchCustomUsers();
  ipTechnologies.value = await fetchRepositoryIDsByUser(
      10000, true, '', '', '', true, true, 'Project Repository'
  );
  if(ipTechnologies.value.length > 0) {
    atbiData.technology = ipTechnologies.value[0].slug
  } else {
    await router.push({name: 'new-repository'})
    showSnackbarMessage('You have no associated technologies. You need to create an IP Technology first', Status.error)
  }
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[1];
  path.value = getFirstPath(route.path);
  if(type === 'edit') {
    formType.value = FormType.edit
    const atbi = await fetchAtbiData(route.params.slug as string);
    if(!ipTechnologies.value.some(repository => repository.slug === atbi?.technology && !userData.is_superuser)) {
      await router.push({name: 'repositories'})
    }
    Object.assign(atbiData, {...atbi});
    if (Array.isArray(atbiData.image_urls)) {
      for (let i = 0; i < atbiData.image_urls.length; i++) {
        atbiImages.value.push({
          ...atbiData.image_urls[i],
          file: null,
          image: atbiData.image_urls[i].image,
          previewImage: atbiData.image_urls[i].image as string,
          type: 'update'
        });
      }
    }
    previewImage.value = <string>atbiData.logo
    hasImage.value = true
  }
  pageLoading.value = false
})

</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <MainLayout :title="formType === FormType.edit ? 'Edit ATBI' : 'New ATBI'">
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
            {{formType === FormType.edit ? 'Edit ATBI' : 'Add New ATBI'}}
          </p>
          <p class="text-subtitle">
            ATBI means Agri-Aqua Technology Business Incubation (ATBI). It is a program gears to support more incubatees in the Agri-Aqua sector.
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
              v-model="atbiData.name"
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
        <div class="mb-3" v-if="atbiData.description">
          <label class="input-label">Description</label>
          <QuillRichTextEditor
              :modelValue="atbiData.description"
              @update:modelValue="$event => (atbiData.description = $event)"
              placeholder="Enter content about this atbi"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Description</label>
          <QuillRichTextEditor
              :modelValue="atbiData.description"
              @update:modelValue="$event => (atbiData.description = $event)"
              placeholder="Enter content about this atbi"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Associated IP Technology<span class="text-pink">*</span></label>
          <VAutocomplete
              v-model="atbiData.technology"
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
        <div class="mb-3">
          <label class="input-label">Owners</label>
          <VCombobox
              ref="ownerRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="atbiData.ownerData"
              placeholder="Select Owners"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              multiple
              chips
              closable-chips
              @update:search="handleSearch($event)"
              :hide-no-data="false"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser()">
                <VListItemTitle>
                  Add {{ ownerSearch }} as an owner
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>
        </div>
        <div class="mb-3">
          <label class="input-label">Mobile Number</label>
          <VTextField
              v-model="atbiData.mobile"
              placeholder="Enter mobile number"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.mobile"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Email</label>
          <VTextField
              v-model="atbiData.email"
              placeholder="Enter email"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.email"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Facebook</label>
          <VTextField
              v-model="atbiData.facebook"
              placeholder="Enter facebook"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.facebook"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">ATBI Logo/Image</label>
          <div v-if="hasImage" class="my-3">
            <VDivider/>
            <div class="d-flex align-center justify-space-between pa-2" >
              <p class="dialog-boundary-title d-flex align-center">
                <PhImage class="mr-1"/>
                {{
                  file ? file?.name :
                      (typeof atbiData?.logo === 'string' ? atbiData.logo.split('/').pop() as string : '')
                }}

              </p>
              <div class="d-flex align-center ga-2">
                <VTooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <PhEye v-bind="props" class="cursor-pointer" @click="isImagePreviewed = true"/>
                  </template>
                  <span>Preview Image</span>
                </VTooltip>
                <VTooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <PhX v-bind="props" class="cursor-pointer" @click="removeImage"/>
                  </template>
                  <span>Remove Saved Image</span>
                </VTooltip>
              </div>
            </div>
            <VDivider/>
          </div>
          <VFileInput
              v-else
              @change="handleUploadChange"
              label="Choose Organization Image by Clicking Here"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              chips
              prepend-icon=""
              hint="Choose an image that will represent the entire atbi. It could be an atbi logo or a brand image. "
              accept="image/*"
          >
            <template v-slot:prepend-inner>
              <PhFileImage/>
            </template>
          </VFileInput>
        </div>
        <div class="mb-10">
          <div v-if="atbiImages.length === 0">
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
                  v-for="(image, index) in atbiImages"
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
                    <DeleteDialog v-if="image.type == 'update'" @callback="deleteAtbiImageCallback(<string>image.uuid, index)">
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
                <VDivider v-if="index == atbiImages.length - 1"/>
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
        <div class="mb-10" v-if="atbiData.additional_info">
          <label class="input-label">Additonal Info</label>
          <QuillRichTextEditor
              :modelValue="atbiData.additional_info"
              @update:modelValue="$event => (atbiData.additional_info = $event)"
              placeholder="Enter additional info about this atbi"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="atbiData.additional_info"
              @update:modelValue="$event => (atbiData.additional_info = $event)"
              placeholder="Enter additional info about this atbi"
          />
        </div>
        <VRow class="ma-0" justify="end" align="center">
          <VBtnPrimaryFilled
              @click="formType === FormType.edit ? updateAtbiData() : addAtbiData()"
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
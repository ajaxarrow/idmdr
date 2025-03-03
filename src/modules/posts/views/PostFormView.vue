<script setup lang="ts">
import {useRouting} from "../../../core/composables/useRouting.ts";
import {onMounted, reactive, ref} from "vue";
import {Post, PostImage} from "../../../interfaces/post.interface.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {usePostServices} from "../services/post.services.ts";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {usePostImagesServices} from "../services/post-images.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {PhEye, PhFileDashed, PhImage, PhTrash, PhX} from "@phosphor-icons/vue";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";

const {route} = useRouting();
const {userData} = useUserStore();
const {addPost, updatePost, fetchPostbyID, loading} = usePostServices();
const {showSnackbarMessage} = useSnackbarStore();
const {deletePostImage} = usePostImagesServices();
const formType = ref<FormType>(FormType.create);
const path = ref('');

const postDataInitialState = reactive<Post>({
  uid: '',
  title: '',
  description: '',
  created_by: '',
  is_draft: false,
  is_published: false,
  images: []
});

const postImages = ref<PostImage[]>([]);

const active = ref(false);
const isImagePreviewed = ref(false);
const previewImage = ref('');

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
    postImages.value.splice(index, 1);
};


const previewImageFile = (index: number) => {
  previewImage.value = <string>postImages.value[index].previewImage;
  isImagePreviewed.value = true;
};

const postData = reactive({...postDataInitialState});

const clearFields = () => {
  Object.assign(postData, {...postDataInitialState});
  postImages.value = [];
};

const handleBulkImagesUpload = (e: any) => {
  const files = e.target?.files || e.dataTransfer?.files;

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = () => {
        const data = reader.result as string;
        postImages.value.push({
          file: files[i],
          image: files[i],
          previewImage: data,
          post: '',
          type: 'create',
          uid: ''
        });
      };

      reader.readAsDataURL(files[i]);
    }
  }
};

const deletePostImageCallback = async (id: string, index: number) => {
  await deletePostImage(id);
  postImages.value.splice(index, 1);
  showSnackbarMessage('Post Image Deleted Successfully', Status.success);
};

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
};

const addPostData = async () => {
  postData.created_by = userData.uid;
  if (postImages.value.length > 0) {
    postData.images = [...postImages.value];
  }
  await addPost(postData);
  clearFields();
};

const updatePostData = async () => {
  postData.created_by = userData.uid;
  if (postImages.value.length > 0) {
    postData.images = postImages.value.filter(img => img.type === "create")
  } else {
    postData.images = [];
  }

  await updatePost(postData);
  clearFields();
};

onMounted(async () => {
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[1];
  path.value = getFirstPath(route.path);

  if (type === 'edit') {
    formType.value = FormType.edit;
    const data = await fetchPostbyID(route.params.slug as string);
    Object.assign(postData, {...data});
    if (Array.isArray(postData.images)) {
      for (let i = 0; i < postData.images.length; i++) {
        postImages.value.push({
          ...postData.images[i],
          file: null,
          image: postData.images[i].image,
          previewImage: postData.images[i].image as string,
          type: 'update'
        });
      }
    }
  }
});
</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <MainLayout :title="formType === FormType.edit ? 'Edit Post' : 'New Post'">
    <VForm id="form" ref="postForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div class="d-flex">
        </div>
        <div>
          <p class="text-heading d-flex align-center">
            {{formType === FormType.edit ? 'Edit Post' : 'Add New Post'}}
          </p>
          <p class="text-subtitle">
            Post will be published in the public section of the application and will showcases news and updates about the organization
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Post Title<span class="text-pink">*</span></label>
          <VTextField
              v-model="postData.title"
              placeholder="Enter post title"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3" v-if="postData.description">
          <label class="input-label">Post Content</label>
          <QuillRichTextEditor
              :modelValue="postData.description"
              @update:modelValue="$event => (postData.description = $event)"
              placeholder="Enter content about this post"
          />
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Post Content</label>
          <QuillRichTextEditor
              :modelValue="postData.description"
              @update:modelValue="$event => (postData.description = $event)"
              placeholder="Enter content about this post"
          />
        </div>
        <div class="mb-10">
          <div v-if="postImages.length === 0">
            <label class="input-label">File</label>
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
            <label class="input-label mb-5">Files</label>
            <div class="attachments-container mt-2">
              <div
                  v-for="(image, index) in postImages"
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
                    <DeleteDialog v-if="image.type == 'update'" @callback="deletePostImageCallback(<string>image.uid, index)">
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
                <VDivider v-if="index == postImages.length - 1"/>
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
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              @click="formType === FormType.edit ? updatePostData() : addPostData()"
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
<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {
  PhArrowLeft,
  PhEye,
  PhFile,
  PhFileDashed,
  PhFileImage,
  PhImage,
  PhPolygon,
  PhTrash,
  PhX
} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {Organization, OrganizationAttachment} from "../../../interfaces/organization.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import OrganizationFormMapPreview from "../components/OrganizationFormMapPreview.vue";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import {CustomUserData} from "../../../interfaces/member.interface.ts";
import {useRepositoryMemberServices} from "../../repository/services/repository-member.services.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import AttachmentsVisibilityInfoDialog from "../../repository/components/AttachmentsVisibilityInfoDialog.vue";
import {useOrganizationAttachmentServices} from "../services/organization-attachments.services.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {isEmptyObject} = useObjectChecker()
const path = ref('organizations')
const organizationForm = ref(null);
const formType = ref<FormType>(FormType.create);
const {organization} = useOrganizationStore();
const {userData} = useUserStore()
const {addOrganization, updateOrganization, errorMessage, hasErrorMessages, fetchOrganizationData, loading, fetchOrganizationIDsByUser} = useOrganizationServices();
const {showSnackbarMessage} = useSnackbarStore();
const {fetchAttachmentsByOrganization, deleteAttachment} = useOrganizationAttachmentServices()
const {fetchCustomUsers} = useRepositoryMemberServices();
const pageLoading = ref(false);
const isMapPreview= ref(false);
const isGeoJSONDrawn = ref(true);
const isGeoJSONPreview = ref(false);
const geoJSONFileName = ref('')
const isImagePreviewed = ref(false);
const hasImage = ref(false);
const previewImage = ref('');
const file = ref<File | null>(null);
const customUsers = ref<CustomUserData[]>([])
const {route, router} = useRouting();
const visibilityInfo = [
  {
    name: 'Public',
    value: 1
  },
  {
    name: 'Private',
    value: 2
  },
  {
    name: 'Within Organization',
    value: 3
  },
  {
    name: 'Within All Organizations',
    value: 4
  }
]

const organizationDataInitialState = reactive<Organization>({
  is_active: true,
  is_approved: true,
  name: '',
  acronym: '',
  description: ``,
  geojson: {},
  slug: '',
  image: '',
  sub_org_type: 1,
  org_type: 1,
  visibility: 1,
  website: '',
  address: '',
  tel_phone: '',
  phone: '',
  email: '',
  additional_info: '',
  president: '',
  rd_rep: '',
  tt_rep: '',
  ic_rep: '',
  sc_rep: '',
  rd_repData: [],
  tt_repData: [],
  ic_repData: [],
  sc_repData: [],
  files: []
});

const organizationData = reactive<Organization>({
  ...organizationDataInitialState
});

const rd_Data = ref<any[]>([])
const tt_Data = ref<any[]>([])
const ic_Data = ref<any[]>([])
const sc_Data = ref<any[]>([])

const attachments = ref<OrganizationAttachment[]>([])
const attachmentData = reactive<OrganizationAttachment>({
  organization: '',
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
  visibility: organizationData.visibility,
  type: 'create',
  errorMessage: '',
  showFiles: false,
  isDescriptionUpdated: false,
  isFileUpdated: false,
  isNameUpdated: false
})

const rd_repRef = ref(null);
const tt_repRef = ref(null);
const ic_repRef = ref(null);
const sc_repRef = ref(null);

// Reusable search query handling
const searchQueries = {
  rd_rep: ref(''),
  tt_rep: ref(''),
  ic_rep: ref(''),
  sc_rep: ref('')
};

// Reusable function to handle search for any field
const handleSearch = (field: string, query: any) => {
  // @ts-ignore
  searchQueries[field].value = query;
};
const active = ref(false)

const handleEnterKey = (field: string, event: KeyboardEvent) => {
  // @ts-ignore
  if (searchQueries[field].value) {
    event.preventDefault();
    event.stopPropagation();
    addCustomUser(field);
    return false;
  }
  return false;
};

// Handle blur event
const handleBlur = (field: string) => {
  // @ts-ignore
  if (searchQueries[field].value) {
    addCustomUser(field);
  }
};

// Reusable function to add custom user for any field
const addCustomUser = (field: string) => {
  if (field === 'rd_rep' && rd_repRef.value) {
    if(searchQueries.rd_rep.value.trim().length > 0){
      const newUser: CustomUserData = {
        type: 'custom',
        data: {
          username: searchQueries.rd_rep.value as string,
          first_name: searchQueries.rd_rep.value as string,
          last_name: '',
          email: '',
          uid: ''
        }
      };
      rd_Data.value.push(newUser);
      //@ts-ignore
      rd_Data.value = rd_Data.value?.filter(user => typeof user === 'object');
      searchQueries.rd_rep.value = '';
      //@ts-ignore
      rd_repRef.value.search = '';
    }
  } else if (field === 'tt_rep' && tt_repRef.value) {
    if(searchQueries.tt_rep.value.trim().length > 0){
      const newUser: CustomUserData = {
        type: 'custom',
        data: {
          username: searchQueries.tt_rep.value as string,
          first_name: searchQueries.tt_rep.value as string,
          last_name: '',
          email: '',
          uid: ''
        }
      };
      tt_Data.value.push(newUser);
      //@ts-ignore
      tt_Data.value = tt_Data.value?.filter(user => typeof user === 'object');
      searchQueries.tt_rep.value = '';
      //@ts-ignore
      tt_repRef.value.search = '';
    }
  } else if (field === 'ic_rep' && ic_repRef.value) {
    if(searchQueries.ic_rep.value.trim().length > 0){
      const newUser: CustomUserData = {
        type: 'custom',
        data: {
          username: searchQueries.ic_rep.value as string,
          first_name: searchQueries.ic_rep.value as string,
          last_name: '',
          email: '',
          uid: ''
        }
      };
      ic_Data.value.push(newUser);
      // organizationData.ic_repData = ic_Data.value;
      //@ts-ignore
      ic_Data.value = ic_Data.value?.filter(user => typeof user === 'object');
      searchQueries.ic_rep.value = '';
      //@ts-ignore
      ic_repRef.value.search = '';
    }
  } else if (field === 'sc_rep' && sc_repRef.value) {
    if(searchQueries.sc_rep.value.trim().length > 0){
      const newUser: CustomUserData = {
        type: 'custom',
        data: {
          username: searchQueries.sc_rep.value as string,
          first_name: searchQueries.sc_rep.value as string,
          last_name: '',
          email: '',
          uid: ''
        }
      };
      sc_Data.value.push(newUser);
      // organizationData.sc_repData = sc_Data.value;
      //@ts-ignore
      sc_Data.value = sc_Data.value?.filter(user => typeof user === 'object');
      searchQueries.sc_rep.value = '';
      //@ts-ignore
      sc_repRef.value.search = '';
    }

  }
};

const removeImage = () => {
  file.value = null;
  hasImage.value = false;
}

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

const toggleActive = () => {
  active.value = !active.value
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1);
  active.value = false
}

const addAttachment = () => {
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


const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}


const clearFields = () => {
  Object.assign(organizationData, {...organizationDataInitialState});
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
  if(validateAttachments()){
    for (let i = 0; i < attachments.value.length; i++) {
      if (attachments.value[i].description == ''){
        attachments.value[i].description = `This is ${attachments.value[i].file?.name!}`;
      }
      if(attachments.value[i].type == 'create'){
        attachments.value[i].name = attachments.value[i].file?.name!
      }
    }
    if(attachments.value.length > 0){
      organizationData.files = attachments.value
    }
    if(file.value){
      //@ts-ignore
      organizationData.image = file.value as File
    } else {
      delete organizationData.image;
    }
    organizationData.rd_rep = JSON.stringify({
      data: rd_Data.value,
    })
    organizationData.tt_rep = JSON.stringify({
      data: tt_Data.value,
    })
    organizationData.ic_rep = JSON.stringify({
      data: ic_Data.value,
    })
    organizationData.sc_rep = JSON.stringify({
      data: sc_Data.value,
    })
    await addOrganization(organizationData)
    if(hasErrorMessages(errorMessage)){
      scrollToFirstErrorMessage()
    } else {
      clearFields();
    }
  }
}

const updateOrganizationData = async () => {
  if(validateAttachments()){
    for (let i = 0; i < attachments.value.length; i++) {
      if (attachments.value[i].description == ''){
        attachments.value[i].description = `This is ${attachments.value[i].file?.name!}`;
      }
      if((!attachments.value[i].isFileUpdated && (!attachments.value[i].isDescriptionUpdated || !attachments.value[i].isNameUpdated) && attachments.value[i].type == 'updated') || (!attachments.value[i].isFileUpdated && (attachments.value[i].isDescriptionUpdated || attachments.value[i].isNameUpdated))){
        delete attachments.value[i].attachment
      }

    }
    if(attachments.value.length > 0){
      organizationData.files = attachments.value
    }
    if(file.value){
      //@ts-ignore
      organizationData.image = file.value as File
    } else {
      delete organizationData.image;
    }
    organizationData.rd_rep = JSON.stringify({
      data: rd_Data.value,
    })
    organizationData.tt_rep = JSON.stringify({
      data: tt_Data.value,
    })
    organizationData.ic_rep = JSON.stringify({
      data: ic_Data.value,
    })
    organizationData.sc_rep = JSON.stringify({
      data: sc_Data.value,
    })
    await updateOrganization(organizationData, organizationData.slug)
    if(hasErrorMessages(errorMessage)){
      scrollToFirstErrorMessage()
    } else {
      clearFields();
    }
  }
}


const setGeoJSON = (geojson: any, isJSONDrawn: boolean) => {
  organizationData.geojson = JSON.stringify(geojson)
  isGeoJSONDrawn.value = isJSONDrawn
  // console.log(organizationData.geojson)
}

const scrollToBottom = () => {
  const element = document.getElementById('form')
  if(element){
    setTimeout(() => {
      window.scrollTo({
        top: element.scrollHeight + 4000,
        behavior: 'smooth'
      });
    }, 100);
  }
}

const closeGeoJSONPreview = () => {
  isGeoJSONPreview.value = false
  isMapPreview.value = false
}

const openMapPreview = () => {
  isMapPreview.value = true
  scrollToBottom()
}

const openGeoJSONPreview = () => {
  isGeoJSONPreview.value = true
  scrollToBottom()
}

const closePreview = () => {
  organizationData.geojson = {}
  scrollToBottom()
}

const handleGeoJSONFileInput = (e: any) => {

  const file = e.target.files[0]

  if (file && file.type === 'application/json') {
    const reader = new FileReader()
    geoJSONFileName.value = file.name

    reader.onload = (e) => {
      try {
        if(e.target){
          if (typeof e.target.result === "string") {
            const jsonData = JSON.parse(e.target.result)
            setGeoJSON(jsonData, false)
          }
        }

        // Perform any additional operations with the parsed JSON data
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }

    reader.readAsText(file)
  } else {
    console.error('Please select a valid JSON file.')
  }
}

const formatDate = (): string=> {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`
}

onMounted(async () => {
  pageLoading.value = true
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  customUsers.value = await fetchCustomUsers();
  const type = rawSegments[1];
  path.value = getFirstPath(<string>route.path)
  if(type === 'edit') {
    await fetchOrganizationData(route.params.slug as string);
    const allUserOrg = await fetchOrganizationIDsByUser();
    if(!allUserOrg.some(org => org.slug === route.params.slug) && !userData.is_superuser){
      await router.push({name: 'organizations'})
    }
    formType.value = FormType.edit
    Object.assign(organizationData, {...organization.value});
    // @ts-ignore
    rd_Data.value = organizationData.rd_repData
    // @ts-ignore
    tt_Data.value = organizationData.tt_repData
    // @ts-ignore
    ic_Data.value = organizationData.ic_repData
    // @ts-ignore
    sc_Data.value = organizationData.sc_repData

    organizationData.geojson = JSON.stringify(organizationData.geojson)
    if(!isEmptyObject(organizationData.geojson)){
      isGeoJSONPreview.value = true
    }
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
    previewImage.value = <string>organizationData.image
    hasImage.value = true
  }
  pageLoading.value = false
})



</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <ImagePreviewOverlay
      :overlay="isImagePreviewed"
      :imageSrc="previewImage"
      @closeOverlay="isImagePreviewed = false"
  />
  <MainLayout :title="formType === FormType.edit ? 'Edit Consortium Member Institution' : 'New Consortium Member Institution'">
    <div v-if="pageLoading" class="loading-state-container h-screen">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <VForm v-else id="form" ref="organizationForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
         <div class="d-flex">
           <RouterLink
               :to="{
                  name: formType === FormType.edit ? 'my-organization-settings' : 'my-organizations',
                  ...(formType === FormType.edit ? { params: { slug: route.params.slug } } : {})
                }"
               class="text-decoration-none text-none">
             <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
               <PhArrowLeft size="14" class="mr-1"/>
               Back To {{formType === FormType.edit  ?  'Settings' : 'My Consortium Member Institutions'}}
             </p>
           </RouterLink>
         </div>
          <p class="text-heading d-flex align-center">
            {{formType === FormType.edit ? 'Edit Consortium Member Institution' : 'Create New Consortium Member Institution'}}
          </p>
          <p class="text-subtitle">
            A Consortium Member Institution is an agency or institution undertaking research and development.
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="px-6 py-6">
        <label class="input-label mb-3">CMI Visibility</label>
        <VRadioGroup hide-details v-model="organizationData.visibility">
          <VRadio color="bs50" :value="1" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Public</p>
                <p class="radio-text-subtitle">The CMI is accessible to the general public for content exploration.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="2" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Private</p>
                <p class="radio-text-subtitle">The content is accessible only to the creator or owner of the consortium member institutions.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="3" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within Organization</p>
                <p class="radio-text-subtitle">The organization's information is exclusively visible to members within the consortium member institutions.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="4" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within All Organization</p>
                <p class="radio-text-subtitle">The CMI's information is visible to all members of any consortium member institutions</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="px-6 py-6">
        <label class="input-label mb-3">Organization Type</label>
        <VRadioGroup hide-details v-model="organizationData.org_type">
          <VRadio color="bs50" :value="1" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Government</p>
                <p class="radio-text-subtitle">This consortium member institution is an agency type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="2" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Private</p>
                <p class="radio-text-subtitle">This consortium member institution is an private type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="3" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Public</p>
                <p class="radio-text-subtitle">This consortium member institution is an public type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="4" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">International</p>
                <p class="radio-text-subtitle">This consortium member institution is an international type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="5" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">NGO</p>
                <p class="radio-text-subtitle">This consortium member institution is an NGO type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="6" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Others</p>
                <p class="radio-text-subtitle">This consortium member institution is an others type.</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="px-6 py-6">
        <label class="input-label mb-3">Sub Organization Type</label>
        <VRadioGroup hide-details v-model="organizationData.sub_org_type">
          <VRadio color="bs50" :value="1" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Academia</p>
                <p class="radio-text-subtitle">This consortium member institution sub type is an academia type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="2" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Research</p>
                <p class="radio-text-subtitle">This consortium member institution sub type is an research type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="3" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Agency</p>
                <p class="radio-text-subtitle">This consortium member institution sub type is an agency type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="4" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Institutional</p>
                <p class="radio-text-subtitle">This consortium member institution sub type is an institutional type.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="5" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Others</p>
                <p class="radio-text-subtitle">This consortium member institution sub type is an others type.</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Consortium Member Institution Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organizationData.name"
              hint="This field is for the name of the organization"
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
          <label class="input-label">Consortium Member Institution Acronym<span class="text-pink">*</span></label>
          <VTextField
              v-model="organizationData.acronym"
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
        <div class="mb-5" v-if="formType === FormType.edit">
          <label class="input-label">Description</label>
          <QuillRichTextEditor
            v-if="organizationData.description"
            :modelValue="organizationData.description"
            @update:modelValue="$event => (organizationData.description = $event)"
            placeholder="E.g. Central Mindanao University is a State University located in the heart of Mindanao Island, Province of Bukidnon, Philippines. It was transformed from a settlement farm school organized by the Americans. It started as the Mailag Industrial School founded in 1910. It is one of the oldest premier universities in Southern Philippines."
          />
        </div>
        <div class="mb-5" v-else>
          <label class="input-label">Description</label>
          <QuillRichTextEditor
              :modelValue="organizationData.description"
              @update:modelValue="$event => (organizationData.description = $event)"
              placeholder="E.g. Central Mindanao University is a State University located in the heart of Mindanao Island, Province of Bukidnon, Philippines. It was transformed from a settlement farm school organized by the Americans. It started as the Mailag Industrial School founded in 1910. It is one of the oldest premier universities in Southern Philippines."
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Address<span class="text-pink">*</span></label>
          <VTextField
              v-model="organizationData.address"
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
          <label class="input-label">President</label>
          <VTextField
              v-model="organizationData.president"
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
          <label class="input-label">Telephone Number</label>
          <VTextField
              v-model="organizationData.tel_phone"
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
              v-model="organizationData.phone"
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
              v-model="organizationData.email"
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
              v-model="organizationData.website"
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
          <label class="input-label">Research & Development Representatives</label>
          <VCombobox
              ref="rd_repRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="rd_Data"
              placeholder="Select Representatives"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              multiple
              chips
              closable-chips
              @update:search="handleSearch('rd_rep', $event)"
              :hide-no-data="false"
              @keydown.enter="(e: any) => handleEnterKey('rd_rep', e)"
              @blur="handleBlur('rd_rep')"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser('rd_rep')">
                <VListItemTitle>
                  Add {{ searchQueries.rd_rep }} as a research & development representative
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Transfer Representatives</label>
          <VCombobox
              ref="tt_repRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="tt_Data"
              placeholder="Select Representatives"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              multiple
              chips
              closable-chips
              @update:search="handleSearch('tt_rep', $event)"
              :hide-no-data="false"
              @keydown.enter="(e: any) => handleEnterKey('tt_rep', e)"
              @blur="handleBlur('tt_rep')"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser('tt_rep')">
                <VListItemTitle>
                  Add {{ searchQueries.tt_rep }} as a technology transfer representative
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>
        </div>

        <div class="mb-3">
          <label class="input-label">Information Communication Representatives</label>
          <VCombobox
              ref="ic_repRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="ic_Data"
              placeholder="Select Representatives"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              multiple
              chips
              closable-chips
              @update:search="handleSearch('ic_rep', $event)"
              :hide-no-data="false"
              @keydown.enter="(e: any) => handleEnterKey('ic_rep', e)"
              @blur="handleBlur('ic_rep')"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser('ic_rep')">
                <VListItemTitle>
                  Add {{ searchQueries.ic_rep }} as an information communication representative
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>

        </div>
        <div class="mb-3">
          <label class="input-label">Science Communication Representatives</label>
          <VCombobox
              ref="sc_repRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="sc_Data"
              placeholder="Select Representatives"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              multiple
              chips
              closable-chips
              @update:search="handleSearch('sc_rep', $event)"
              :hide-no-data="false"
              @keydown.enter="(e: any) => handleEnterKey('sc_rep', e)"
              @blur="handleBlur('sc_rep')"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser('sc_rep')">
                <VListItemTitle>
                  Add {{ searchQueries.sc_rep }} as a science communication representative
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>
        </div>
        <div class="mb-3" v-if="organizationData.additional_info">
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="organizationData.additional_info"
              @update:modelValue="$event => (organizationData.additional_info = $event)"
              placeholder="Enter additional information related to this project "
          />
        </div>
        <div class="mb-5" v-else>
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="organizationData.additional_info"
              @update:modelValue="$event => (organizationData.additional_info = $event)"
              placeholder="Enter additional information related to this project "
          />
          <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.description">{{errorMessage.description}}</p>
        </div>
        <div class="mb-5">
          <label class="input-label">Organization Logo/Image</label>
          <div v-if="hasImage" class="my-3">
            <VDivider/>
            <div class="d-flex align-center justify-space-between pa-2" >
              <p class="dialog-boundary-title d-flex align-center">
                <PhImage class="mr-1"/>
                {{
                  file ? file?.name :
                      (typeof organizationData?.image === 'string' ? organizationData.image.split('/').pop() as string : '')
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
            <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.image">{{errorMessage.image}}</p>
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
              hint="Choose an image that will represent the entire organization. It could be an organization logo or a brand image. "
              :error-messages="errorMessage.image"
              accept="image/*"
          >
            <template v-slot:prepend-inner>
              <PhFileImage/>
            </template>
          </VFileInput>
        </div>
        <div class="mb-10">
          <div v-if="attachments.length == 0">
            <label class="input-label">CMI Files</label>
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
                  <div class="mb-3">
                    <label class="input-label d-flex justify-space-between">
                      Attachment Visibility
                      <span style="font-size: 14px; font-weight: 400;">
                    <AttachmentsVisibilityInfoDialog/>
                  </span>
                    </label>
                    <VAutocomplete
                        v-model="attachments[index].visibility"
                        :items="visibilityInfo"
                        :item-title="item => item.name"
                        :item-value="item => item.value"
                        label="Enter File Visibility"
                        class="my-2"
                        rounded="lg"
                        density="comfortable"
                        variant="outlined"
                        color="primary"
                        base-color="gs60"
                    />
                  </div>
                </div>
                <VDivider v-if="index != attachments.length - 1 "/>
              </div>
              <div class="d-flex justify-end">
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
        </div>
        <div class="mb-10">
          <label class="input-label">Location/Area</label>
          <OrganizationFormMapPreview
              class="my-2"
              v-if="isMapPreview"
              @setGeoJSONData="setGeoJSON"
              @closeMapPreview="isMapPreview = false"
          />
          <div v-else>
            <div class="my-2 file-upload-container" v-if="isEmptyObject(organizationData.geojson)">
              <PhFileDashed size="50"/>
              <p class="text-dropzone text-center">
                Submit a geometric representation of the area by
                <label class="file-label" for="dropzoneFileGeoJSON">uploading a GeoJSON file by clicking here</label>
                or <br/><label class="file-label" @click="openMapPreview">drawing the boundary manually</label>.
              </p>
              <VFileInput id="dropzoneFileGeoJSON" style="display: none" @change="handleGeoJSONFileInput" accept="application/json"/>
            </div>
            <div class="my-3" v-else>
              <OrganizationFormMapPreview
                id="geojson-preview"
                class="my-2"
                v-if="isGeoJSONPreview"
                :isGeoJSONPreview="true"
                :geoJSONData="JSON.parse(organizationData.geojson)"
                @closeMapPreview="closeGeoJSONPreview"
              />
              <div v-else>
                <VDivider/>
                <div class="d-flex align-center justify-space-between pa-2" >
                  <p class="dialog-boundary-title d-flex align-center">
                    <PhPolygon class="mr-1"/>
                    {{isGeoJSONDrawn ? `drawn-boundary-coordinates-${formatDate()}` : geoJSONFileName}}
                  </p>
                  <div class="d-flex align-center ga-2">
                    <VTooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <PhEye v-bind="props" class="cursor-pointer" @click="openGeoJSONPreview"/>
                      </template>
                      <span>Preview Location</span>
                    </VTooltip>
                    <VTooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <PhX v-bind="props" class="cursor-pointer" @click="closePreview"/>
                      </template>
                      <span>Remove Saved File</span>
                    </VTooltip>
                  </div>
                </div>
                <VDivider/>
              </div>
            </div>
          </div>
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              @click="formType === FormType.edit ? updateOrganizationData() : addOrganizationData()"
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
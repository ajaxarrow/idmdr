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
import {Attachment, Commercialization, Repository} from "../../../interfaces/repository.interface.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {
  commodities, readinessLevel, technologyStatus, technologyCategories, agencies, industries,
  ipStatus, modeStatus, priorityLevels, adopters, ipType, transferPlans, currentStatus, repoType, status, forPatent, categories
} from "../../../data/repository.inventory.fields.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import OrganizationFormMapPreview from "../../organization/components/OrganizationFormMapPreview.vue";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {useTags} from "../composables/useTags.ts";
import {useRepositoryServices} from "../services/repository.services.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useRepositoryStore} from "../stores/repository.store.ts";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import AttachmentsVisibilityInfoDialog from "../components/AttachmentsVisibilityInfoDialog.vue";
import {useRepositoryAttachmentServices} from "../services/repository-attachments.services.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import DeleteDialog from "../../../core/components/DeleteDialog.vue";
import {useStringArrayHelper} from "../../../core/composables/useStringArrayHelper.ts";
import {CustomUserData} from "../../../interfaces/member.interface.ts";
import {useRepositoryMemberServices} from "../services/repository-member.services.ts";

const {arrayToString} = useStringArrayHelper()
const {isEmptyObject} = useObjectChecker()
const {fetchOrganizationByUser, fetchOrganizationByAdmin} = useOrganizationServices();
const {addRepository, updateRepository, errorMessage, hasErrorMessages, fetchRepositoryData, loading, fetchRepositoryIDsByUser} = useRepositoryServices();
const {fetchAttachmentsByRepository, deleteAttachment} = useRepositoryAttachmentServices()
const {fetchCustomUsers} = useRepositoryMemberServices();
const {showSnackbarMessage} = useSnackbarStore();
const {repository} = useRepositoryStore()
const {tags, fetchTags} = useTags();
const {route, router} = useRouting();
const {userData} = useUserStore();

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

const repositoryForm = ref(null);
const isImagePreviewed = ref(false);
const hasImage = ref(false);
const previewImage = ref('');
const path = ref('organizations')
const isMapPreview= ref(false);
const isGeoJSONDrawn = ref(true);
const isGeoJSONPreview = ref(false);
const geoJSONFileName = ref('')
const organizations = ref<Organization[]>([]);
const previousTags = ref<string[]>([])
const previousFundingAgencies = ref<string[]>([])
const previousCommodities = ref<string[]>([])
const previousIndustries = ref<string[]>([])
const previousAffiliations = ref<string[]>([])
const previousRPTs = ref<string[]>([])
const previousAdopters = ref<string[]>([])
const customUsers = ref<CustomUserData[]>([])
const formType = ref<FormType>(FormType.create);
const pageLoading = ref(false);
const file = ref<File | null>(null);
const repositoryDataIntialState = reactive<Repository>({
  affiliation: [],
  commodity: [],
  description: "",
  end_date: '',
  funding_agency: [],
  geojson: {},
  industry: [],
  is_active: true,
  is_approved: true,
  is_deleted: false,
  location: "",
  organization: "",
  priority_level: "high",
  project_component: "",
  rpt: [],
  slug: "",
  start_date: '',
  type: 'Project Repository',
  tags: [],
  tech_owner: "Aurora State College of Technology (ASCoT)",
  technology_category: "Application of genomics in the study of diseases of aquatic species",
  technology_generator: "",
  technology_readiness_level: "Level 1 - Basic principles observed and reported",
  technology_status: "Laboratory experiment stage / Lab testing / Greenhouse testing",
  technology_transfer_status: "",
  title: "",
  transfer_plan: "Extension",
  uid: "",
  visibility: 1,
  authorsData: [],
  adaptors: [],
  com_extra: {},
  image: '',
  author: '',
  lead: '',
  proj_type: 'Project',
  additional_info: '',
  status: 'Ongoing',
  abh: '',
  atbi: '',
  is_patentable: false,
  leadData: {},
  techGeneratorData: [],
  techOwnerData: []
})

const repositoryData = reactive<Repository>({
  ...repositoryDataIntialState
})

const commercializationIntialState = reactive<Commercialization>({
  adopterStatus: "",
  currentStatus: "Applied Fairness Opinion Report",
  ipStatus: "For filing",
  ipType: "Copyright & Related Rights",
  modeStatus: "Direct Sales",
  regNo: ""
})

const commercialization = reactive<Commercialization>({
  ...commercializationIntialState
})
const attachments = ref<Attachment[]>([])
const attachmentData = reactive<Attachment>({
  repository: '',
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
  visibility: repositoryData.visibility,
  type: 'create',
  errorMessage: '',
  showFiles: false,
  isDescriptionUpdated: false,
  isFileUpdated: false,
  isNameUpdated: false
})
const active = ref(false)
const authorRef = ref(null);
const techOwnerRef = ref(null);
const leadRef = ref(null);
const techGenRef = ref(null);

// Reusable search query handling
const searchQueries = {
  author: ref(''),
  techOwner: ref(''),
  lead: ref(''),
  techGen: ref('')
};

// Reusable function to handle search for any field
const handleSearch = (field: string, query: any) => {
  // @ts-ignore
  searchQueries[field].value = query;
};

// Reusable function to add custom user for any field
const addCustomUser = (field: string) => {
  if (field === 'author' && authorRef.value) {
    const newUser: CustomUserData = {
      type: 'custom',
      data: {
        username: searchQueries.author.value as string,
        first_name: searchQueries.author.value as string,
        last_name: '',
        email: '',
        uid: ''
      }
    };
    repositoryData.authorsData?.push(newUser);
    searchQueries.author.value = '';
    //@ts-ignore
    authorRef.value.search = '';
  } else if (field === 'techOwner' && techOwnerRef.value) {
    const newUser: CustomUserData = {
      type: 'custom',
      data: {
        username: searchQueries.techOwner.value as string,
        first_name: searchQueries.techOwner.value as string,
        last_name: '',
        email: '',
        uid: ''
      }
    };
    repositoryData.techOwnerData?.push(newUser);
    searchQueries.techOwner.value = '';
    //@ts-ignore
    techOwnerRef.value.search = '';
  } else if (field === 'lead' && leadRef.value) {
    const newUser: CustomUserData = {
      type: 'custom',
      data: {
        username: searchQueries.lead.value as string,
        first_name: searchQueries.lead.value as string,
        last_name: '',
        email: '',
        uid: ''
      }
    };
    repositoryData.leadData = newUser;
    searchQueries.lead.value = '';
    //@ts-ignore
    // leadRef.value.search = '';
  } else if (field === 'techGen' && techGenRef.value) {
    const newUser: CustomUserData = {
      type: 'custom',
      data: {
        username: searchQueries.techGen.value as string,
        first_name: searchQueries.techGen.value as string,
        last_name: '',
        email: '',
        uid: ''
      }
    };
    repositoryData.techGeneratorData?.push(newUser);
    searchQueries.techGen.value = '';
    //@ts-ignore
    techGenRef.value.search = '';
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

watch(()=> repositoryData.is_patentable, ()=> {
  if(repositoryData.is_patentable){
    repositoryData.visibility = 2
  }
})


const setGeoJSON = (geojson: any, isJSONDrawn: boolean) => {
  repositoryData.geojson = JSON.stringify(geojson)
  isGeoJSONDrawn.value = isJSONDrawn
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
  repositoryData.geojson = {}
  closeGeoJSONPreview()
}

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


const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const clearFields = ( ) => {
  Object.assign(repositoryData, {...repositoryDataIntialState})
  Object.assign(commercialization, {...commercializationIntialState})
}
const scrollToFirstErrorMessage = () => {
  //@ts-ignore
  const fields = repositoryForm.value.items
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

const addRepositoryData = async () => {
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
      repositoryData.files = attachments.value
    }
    previousTags.value = <string[]>repositoryData.tags
    previousCommodities.value = <string[]>repositoryData.commodity
    previousAffiliations.value = <string[]>repositoryData.affiliation
    previousIndustries.value = <string[]>repositoryData.industry
    previousFundingAgencies.value = <string[]>repositoryData.funding_agency
    previousRPTs.value = <string[]>repositoryData.rpt
    previousAdopters.value = <string[]>repositoryData.adaptors
    repositoryData.adaptors = arrayToString(<string[]>repositoryData.adaptors)
    repositoryData.rpt = arrayToString(<string[]>repositoryData.rpt)
    repositoryData.tags = arrayToString(<string[]>repositoryData.tags)
    repositoryData.commodity = arrayToString(<string[]>repositoryData.commodity)
    repositoryData.industry = arrayToString(<string[]>repositoryData.industry)
    repositoryData.affiliation = arrayToString(<string[]>repositoryData.affiliation)
    repositoryData.funding_agency = arrayToString(<string[]>repositoryData.funding_agency)
    repositoryData.author = JSON.stringify({
      data: repositoryData.authorsData
    })

    repositoryData.tech_owner = JSON.stringify({
      data: repositoryData.techOwnerData
    })

    repositoryData.technology_generator = JSON.stringify({
      data: repositoryData.techGeneratorData
    })
    repositoryData.lead = JSON.stringify(repositoryData.leadData)


    if(file.value){
      //@ts-ignore
      repositoryData.image = file.value as File
    } else {
      delete repositoryData.image;
    }
    if(repositoryData.transfer_plan === 'Commercialization'){
      repositoryData.com_extra = JSON.stringify(commercialization)
    }
    repositoryData.owner_id = userData.uid
    await addRepository(repositoryData)
    if(hasErrorMessages(errorMessage)){
      repositoryData.tags = previousTags.value
      repositoryData.commodity = previousCommodities.value
      repositoryData.affiliation = previousAffiliations.value
      repositoryData.industry = previousIndustries.value
      repositoryData.funding_agency = previousFundingAgencies.value
      scrollToFirstErrorMessage()
    } else {
      clearFields();
    }
  }
}


const updateRepositoryData = async () => {
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
      repositoryData.files = attachments.value
    }
    if(file.value){
      //@ts-ignore
      repositoryData.image = file.value as File
    } else {
      delete repositoryData.image;
    }

    previousTags.value = <string[]>repositoryData.tags
    previousCommodities.value = <string[]>repositoryData.commodity
    previousAffiliations.value = <string[]>repositoryData.affiliation
    previousIndustries.value = <string[]>repositoryData.industry
    previousFundingAgencies.value = <string[]>repositoryData.funding_agency
    previousRPTs.value = <string[]>repositoryData.rpt
    previousAdopters.value = <string[]>repositoryData.adaptors
    repositoryData.adaptors = arrayToString(<string[]>repositoryData.adaptors)
    repositoryData.rpt = arrayToString(<string[]>repositoryData.rpt)
    repositoryData.tags = arrayToString(<string[]>repositoryData.tags)
    repositoryData.commodity = arrayToString(<string[]>repositoryData.commodity)
    repositoryData.industry = arrayToString(<string[]>repositoryData.industry)
    repositoryData.affiliation = arrayToString(<string[]>repositoryData.affiliation)
    repositoryData.funding_agency = arrayToString(<string[]>repositoryData.funding_agency)
    repositoryData.author = JSON.stringify({
      data: repositoryData.authorsData
    })
    repositoryData.tech_owner = JSON.stringify({
      data: repositoryData.techOwnerData
    })

    repositoryData.technology_generator = JSON.stringify({
      data: repositoryData.techGeneratorData
    })
    repositoryData.lead = JSON.stringify(repositoryData.leadData)

    if(repositoryData.transfer_plan === 'Commercialization'){
      repositoryData.com_extra = JSON.stringify(commercialization)
    }
    await updateRepository(repositoryData, repositoryData.slug)
    if(hasErrorMessages(errorMessage)){
      repositoryData.tags = previousTags.value
      repositoryData.commodity = previousCommodities.value
      repositoryData.affiliation = previousAffiliations.value
      repositoryData.industry = previousIndustries.value
      repositoryData.funding_agency = previousFundingAgencies.value
      scrollToFirstErrorMessage()
    } else {
      clearFields();
    }
  }
}


onMounted( async () => {
  pageLoading.value = true
  fetchTags();
  organizations.value = userData.is_superuser ? (await fetchOrganizationByAdmin()).filter(org => !org.is_deleted) : (await fetchOrganizationByUser()).filter(org => !org.is_deleted);
  customUsers.value = await fetchCustomUsers();
  repositoryData.leadData = customUsers.value[0]
  repositoryData.organization = organizations.value.length > 0 ? <string>organizations.value[0].uid : null
  if(organizations.value.length == 0){
    await router.push({name: 'new-organization'})
    showSnackbarMessage('You have no associated CMIs. You need to create first', Status.error)
  }
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[1];
  path.value = getFirstPath(<string>route.path)
  if(type === 'edit') {
    await fetchRepositoryData(route.params.slug as string, 'update');
    const userRepo = await fetchRepositoryIDsByUser(
        10000, true, '', '', ''
    );
    if(!userRepo.some(repo => repo.slug === repository.value?.slug) && !userData.is_superuser) {
      await router.push({name: 'repositories'})
    }
    formType.value = FormType.edit
    Object.assign(repositoryData, {...repository.value});
    // console.log(repositoryData.tags)
    // repositoryData.tags = stringToArray(<string>repositoryData.tags)
    repositoryData.geojson = JSON.stringify(repositoryData.geojson)
    if(!isEmptyObject(repositoryData.geojson)){
      isGeoJSONPreview.value = true
    }
    const fetchedFiles = await fetchAttachmentsByRepository(<string>route.params.slug, 'update')
    for(let i = 0; i < fetchedFiles.length; i++){
      attachments.value.push({
        ...fetchedFiles[i],
        file: null,
        attachment: fetchedFiles[i].attachment,
        isDescriptionUpdated: false,
        isFileUpdated: false
      })
    }

    previewImage.value = <string>repositoryData.image
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

  <MainLayout :title="formType === FormType.edit ? 'Edit Project' : 'New Project'">
    <div v-if="pageLoading" class="loading-state-container h-screen">
      <VProgressCircular
          indeterminate
          color="#23668b"
      ></VProgressCircular>
    </div>
    <VForm v-else id="form" ref="repositoryForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div class="d-flex">
          <RouterLink
              :to="{
                name: formType === FormType.edit ? 'my-repository-settings' : 'my-repositories',
                ...(formType === FormType.edit ? { params: { slug: route.params.slug } } : {})
              }"
              class="text-decoration-none text-none">
            <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
              <PhArrowLeft size="14" class="mr-1"/>
              Back To {{formType === FormType.edit ?  'Settings' : 'My Projects'}}
            </p>
          </RouterLink>
        </div>
        <div>
          <p class="text-heading d-flex align-center">
            {{formType === FormType.edit ? 'Edit Project' : 'Create New Project'}}
          </p>
          <p class="text-subtitle">
            A project contain all related project of a certain project of the organization
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div
          class="px-6 py-3"
          :class="{ 'disabled-cursor': repositoryData.is_patentable }"
          :title="repositoryData.is_patentable ? 'This project is open for patenting, visibility set to Private' : ''"
      >
        <VRadioGroup
            v-model="repositoryData.visibility"
            :disabled="repositoryData.is_patentable"
        >
          <VRadio color="bs50" :value="1" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Public</p>
                <p class="radio-text-subtitle">The project is accessible to the general public for content exploration.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="2" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Private</p>
                <p class="radio-text-subtitle">The content is accessible only to the creator or owner of the project.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="3" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within Organization</p>
                <p class="radio-text-subtitle">The project's information is exclusively visible to members within the organization.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="4" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within All Organization</p>
                <p class="radio-text-subtitle">The project's information is visible to all members of any organization</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Title<span class="text-pink">*</span></label>
          <VTextField
              v-model="repositoryData.title"
              placeholder="E.g. Soil Health Monitoring: Databases on Agricultural Lands Across Borders"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.title"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Associated CMI<span class="text-pink">*</span></label>
          <VAutocomplete
              :disabled="formType === FormType.edit"
              v-model="repositoryData.organization"
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
              :error-messages="errorMessage.organization"
              :hint="formType === FormType.edit ? 'You cannot changed the associated organization' : 'Select Organization that the repository belongs to'"
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
        <div class="mb-3" v-if="repositoryData.description">
          <label class="input-label">Abstract<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="repositoryData.description"
              @update:modelValue="$event => (repositoryData.description = $event)"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
          />
        </div>
        <div class="mb-5" v-else>
          <label class="input-label">Description<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="repositoryData.description"
              @update:modelValue="$event => (repositoryData.description = $event)"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
          />
          <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.description">{{errorMessage.description}}</p>
        </div>
        <div class="mb-3">
          <label class="input-label">Site of Implementation</label>
          <VTextField
              v-model="repositoryData.location"
              placeholder="E.g. Musuan, Bukidnon"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.location"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Type</label>
          <VAutocomplete
              v-model="repositoryData.type"
              placeholder="Select Type"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="repoType"
              :item-title="item => `${item.title}`"
              :item-value="item => `${item.value}`"
              :error-messages="errorMessage.commodity"
          />
          <!--          hint="Project Repository focuses on IP Technology projects file Document Repository type served as file repository"-->
        </div>
        <div class="mb-3">
          <label class="input-label">Project Category</label>
          <VAutocomplete
              :items="categories"
              v-model="repositoryData.proj_type"
              placeholder="Enter Project Category"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.commodity"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Collaborator(s)</label>
          <VCombobox
              ref="authorRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="repositoryData.authorsData"
              placeholder="Enter Collaborator"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.commodity"
              multiple
              chips
              closable-chips
              @update:search="handleSearch('author', $event)"
              :hide-no-data="false"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser('author')">
                <VListItemTitle>
                  Add {{ searchQueries.author }} as a collaborator
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>
        </div>
        <div class="mb-3">
          <label class="input-label">Project Lead</label>
          <VCombobox
              ref="leadRef"
              :items="customUsers"
              :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
              v-model="repositoryData.leadData"
              placeholder="Enter Project Lead"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.commodity"
              @update:search="handleSearch('lead', $event)"
              :hide-no-data="false"
          >
            <template v-slot:no-data>
              <VListItem @click="addCustomUser('lead')">
                <VListItemTitle>
                  Add {{ searchQueries.lead }} as Project Lead
                </VListItemTitle>
              </VListItem>
            </template>
          </VCombobox>
        </div>
        <div class="mb-3">
          <label class="input-label">Start Date</label>
          <VTextField
              v-model="repositoryData.start_date"
              type="date"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.start_date"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">End Date</label>
          <VTextField
              v-model="repositoryData.end_date"
              type="date"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.end_date"
          />
        </div>
        <div v-if="repositoryData.type === 'Project Repository'">
          <div class="mb-3">
            <label class="input-label">Project Status</label>
            <VAutocomplete
                v-model="repositoryData.status"
                placeholder="Select Status"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="status"
                :error-messages="errorMessage.commodity"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Commodity</label>
            <VCombobox
                v-model="repositoryData.commodity as string[]"
                placeholder="Select Commodity"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="commodities"
                :error-messages="errorMessage.commodity"
                multiple
                chips
                closable-chips
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Industry</label>
            <VCombobox
                v-model="repositoryData.industry as string[]"
                placeholder="Select Industry"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="industries"
                :error-messages="errorMessage.industry"
                multiple
                chips
                closable-chips
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Technology Category</label>
            <VAutocomplete
                v-model="repositoryData.technology_category"
                placeholder="Select Technology Category"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="technologyCategories"
                :error-messages="errorMessage.technology_category"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Technology Status</label>
            <VAutocomplete
                v-model="repositoryData.technology_status"
                placeholder="Select Technology Status"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="technologyStatus"
                :error-messages="errorMessage.technology_status"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Technology Readiness Level</label>
            <VAutocomplete
                v-model="repositoryData.technology_readiness_level"
                placeholder="Select Readiness Level"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="readinessLevel"
                :error-messages="errorMessage.technology_readiness_level"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Research Project/s Conducted</label>
            <VCombobox
                v-model="repositoryData.rpt as string[]"
                placeholder="Enter Research Project/s Conducted"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :error-messages="errorMessage.rpt"
                multiple
                chips
                closable-chips
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Funding Agency</label>
            <VAutocomplete
                v-model="repositoryData.funding_agency as string[]"
                placeholder="Select Funding Agency"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="agencies"
                multiple
                chips
                closable-chips
                :error-messages="errorMessage.funding_agency"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Technology Generator(s)</label>
            <VCombobox
                ref="techGenRef"
                :items="customUsers"
                :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
                v-model="repositoryData.techGeneratorData"
                placeholder="Select Technology Generator"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                multiple
                chips
                closable-chips
                :error-messages="errorMessage.technology_generator"
                @update:search="handleSearch('techGen', $event)"
                :hide-no-data="false"
            >
              <template v-slot:no-data>
                <VListItem @click="addCustomUser('techGen')">
                  <VListItemTitle>
                    Add {{ searchQueries.techGen }} as a technology generator
                  </VListItemTitle>
                </VListItem>
              </template>
            </VCombobox>
          </div>
          <div class="mb-3">
            <label class="input-label">Affiliation<span class="text-pink">*</span></label>
            <VCombobox
                v-model="repositoryData.affiliation as string[]"
                placeholder="Enter Affiliation"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="agencies"
                multiple
                chips
                closable-chips
                :error-messages="errorMessage.affiliation"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Technology Owner(s)</label>
            <VCombobox
                ref="techOwnerRef"
                :items="customUsers"
                :item-title="item => `${item.data?.first_name} ${item.data?.last_name}`"
                v-model="repositoryData.techOwnerData"
                placeholder="Select Technology Owners"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                multiple
                chips
                closable-chips
                :error-messages="errorMessage.tech_owner"
                :hide-no-data="false"
                @update:search="handleSearch('techOwner', $event)"
            >
              <template v-slot:no-data>
                <VListItem @click="addCustomUser('techOwner')">
                  <VListItemTitle>
                    Add {{ searchQueries.techOwner }} as a new technology owner
                  </VListItemTitle>
                </VListItem>
              </template>
            </VCombobox>
          </div>
          <div class="mb-3">
            <label class="input-label">Existing or Potential Adopters</label>
            <VCombobox
                v-model="repositoryData.adaptors as string[]"
                placeholder="Select Adopter"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="adopters"
                :error-messages="errorMessage.adaptors"
                multiple
                chips
                closable-chips
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Patenting Status</label>
            <VAutocomplete
                v-model="repositoryData.  is_patentable"
                placeholder="Select Funding Agency"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="forPatent"
                :item-value="item => item.value"
                :item-title="item => item.title"
                :error-messages="errorMessage.funding_agency"
            />
          </div>
          <!--          <div class="mb-3" v-if="repositoryData.abh">-->
          <!--            <label class="input-label">Agri-Aqua Business Hub</label>-->
          <!--            <QuillRichTextEditor-->
          <!--                :modelValue="repositoryData.abh"-->
          <!--                @update:modelValue="$event => (repositoryData.abh = $event)"-->
          <!--                placeholder="Enter information related to agri aqua business hub to this project"-->
          <!--            />-->
          <!--          </div>-->
          <!--          <div class="mb-5" v-else>-->
          <!--            <label class="input-label">Agri-Aqua Business Hub</label>-->
          <!--            <QuillRichTextEditor-->
          <!--                :modelValue="repositoryData.abh"-->
          <!--                @update:modelValue="$event => (repositoryData.abh = $event)"-->
          <!--                placeholder="Enter information related to agri aqua business hub to this project"-->
          <!--            />-->
          <!--            <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.description">{{errorMessage.description}}</p>-->
          <!--          </div>-->
          <!--          <div class="mb-3" v-if="repositoryData.atbi">-->
          <!--            <label class="input-label">Agri-Aqua Technology Business Incubator</label>-->
          <!--            <QuillRichTextEditor-->
          <!--                :modelValue="repositoryData.atbi"-->
          <!--                @update:modelValue="$event => (repositoryData.atbi = $event)"-->
          <!--                placeholder="Enter information about technology business incubator that is related to this project"-->
          <!--            />-->
          <!--          </div>-->
          <!--          <div class="mb-5" v-else>-->
          <!--            <label class="input-label">Agri-Aqua Technology Business Incubator</label>-->
          <!--            <QuillRichTextEditor-->
          <!--                :modelValue="repositoryData.atbi"-->
          <!--                @update:modelValue="$event => (repositoryData.atbi = $event)"-->
          <!--                placeholder="Enter information about technology business incubator that is related to this project"-->
          <!--            />-->
          <!--            <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.description">{{errorMessage.description}}</p>-->
          <!--          </div>-->
          <div class="mb-3">
            <label class="input-label">Technology Transfer Plan</label>
            <VAutocomplete
                v-model="repositoryData.transfer_plan"
                placeholder="Select Transfer Plan"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="transferPlans"
                :error-messages="errorMessage.transfer_plan"
            />
          </div>
          <div v-if="repositoryData.transfer_plan == 'Commercialization'">
            <div class="mb-3">
              <label class="input-label">IP Type</label>
              <VAutocomplete
                  v-model="commercialization.ipType"
                  placeholder="Select IP Type"
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :items="ipType"
              />
            </div>
            <div class="mb-3">
              <label class="input-label">IP Status</label>
              <VAutocomplete
                  v-model="commercialization.ipStatus"
                  placeholder="Select IP Status"
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :items="ipStatus"
              />
            </div>
            <div class="mb-3">
              <label class="input-label">IP Registration Number</label>
              <VTextField
                  v-model="commercialization.regNo"
                  placeholder="Enter IP Registration Number"
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :items="industries"
              />
            </div>
            <div class="mb-3">
              <label class="input-label">Commercialization Status (Mode)</label>
              <VAutocomplete
                  v-model="commercialization.modeStatus"
                  placeholder="Select Status Mode"
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :items="modeStatus"
              />
            </div>
            <div class="mb-3">
              <label class="input-label">Commercialization Status (Current)</label>
              <VAutocomplete
                  v-model="commercialization.currentStatus"
                  placeholder="Select Current Commercialization Status"
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
                  :items="currentStatus"
              />
            </div>
            <div class="mb-3">
              <label class="input-label">Commercialization Status (Adopter)</label>
              <VTextField
                  v-model="commercialization.adopterStatus"
                  placeholder="Enter Commercialization Status"
                  class="my-2"
                  rounded="lg"
                  density="comfortable"
                  variant="outlined"
                  color="primary"
                  base-color="gs60"
              />
            </div>
          </div>
          <div class="mb-3" v-else>
            <label class="input-label">Technology Transfer Status</label>
            <VTextField
                v-model="repositoryData.technology_transfer_status"
                placeholder="Select Transfer Status"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
            />
          </div>
          <div class="mb-3">
            <label class="input-label">Priority Level</label>
            <VAutocomplete
                v-model="repositoryData.priority_level"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :item-value="priorityLevel => `${priorityLevel}`"
                :items="priorityLevels"
                :item-title="priorityLevel => `${priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}`"
                :error-messages="errorMessage.priority_level"
            />
          </div>
        </div>
        <div class="mb-3" v-if="repositoryData.additional_info">
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="repositoryData.additional_info"
              @update:modelValue="$event => (repositoryData.additional_info = $event)"
              placeholder="Enter additional information related to this project "
          />
        </div>
        <div class="mb-5" v-else>
          <label class="input-label">Additional Info</label>
          <QuillRichTextEditor
              :modelValue="repositoryData.additional_info"
              @update:modelValue="$event => (repositoryData.additional_info = $event)"
              placeholder="Enter additional information related to this project "
          />
          <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.description">{{errorMessage.description}}</p>
        </div>
        <div class="mb-3">
          <label class="input-label">Tags<span class="text-pink">*</span></label>
          <VCombobox
              placeholder="E.g. Soil Health, Agriculture Data, Global Farming, Agricultural Lands,"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              v-model="repositoryData.tags as string[]"
              :items="tags"
              multiple
              chips
              closable-chips
              :error-messages="errorMessage.tags"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Image</label>
          <div v-if="hasImage" class="my-3">
            <VDivider/>
            <div class="d-flex align-center justify-space-between pa-2" >
              <p class="dialog-boundary-title d-flex align-center">
                <PhImage class="mr-1"/>
                {{
                  file ? file?.name :
                      (typeof repositoryData?.image === 'string' ? repositoryData.image.split('/').pop() as string : 'Image')
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
              @change="handleUploadChange($event)"
              label="Choose Repository Image by Clicking Here"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              chips
              prepend-icon=""
              hint="Choose an image that will represent your project and be visible in the repository."
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
        <div class="mb-10" v-if="repositoryData.type === 'Project Repository'">
          <label class="input-label">Location/Area</label>
          <OrganizationFormMapPreview
              class="my-2"
              v-if="isMapPreview"
              @setGeoJSONData="setGeoJSON"
              @closeMapPreview="isMapPreview = false"
          />
          <div v-else>
            <div class="my-2 file-upload-container" v-if="isEmptyObject(repositoryData.geojson)">
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
                  :geoJSONData="JSON.parse(repositoryData.geojson)"
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
              @click="formType === FormType.edit ? updateRepositoryData() : addRepositoryData()"
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
<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {onMounted, reactive, ref} from "vue";
import {PhArrowLeft, PhEye, PhFileDashed, PhFileImage, PhPolygon, PhX} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {useOrganizationServices} from "../services/organization.services.ts";
import OrganizationFormMapPreview from "../components/OrganizationFormMapPreview.vue";
import {useOrganizationStore} from "../stores/organization.store.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";

const {isEmptyObject} = useObjectChecker()
const path = ref('organizations')
const organizationForm = ref(null);
const formType = ref<FormType>(FormType.create);
const {organization} = useOrganizationStore();
const {addOrganization, updateOrganization, errorMessage, hasErrorMessages, fetchOrganizationData, loading} = useOrganizationServices();
const isMapPreview= ref(false);
const isGeoJSONDrawn = ref(true);
const isGeoJSONPreview = ref(false);
const geoJSONFileName = ref('')
const isImagePreviewed = ref(false);
const hasImage = ref(false);
const previewImage = ref('');
const file = ref<File | null>(null);

const {route} = useRouting();

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
  rd_rep: {
    email: '',
    full_name: '',
    phone: '',
  },
  tt_rep: {
    email: '',
    full_name: '',
    phone: '',
  },
  ic_rep: {
    email: '',
    full_name: '',
    phone: '',
  },
  sc_rep: {
    email: '',
    full_name: '',
    phone: '',
  },
});

const organizationData = reactive<Organization>({
  ...organizationDataInitialState
});

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
  if(file.value){
    //@ts-ignore
    organizationData.image = file.value as File
  } else {
    delete organizationData.image;
  }
  await addOrganization(organizationData)
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }
}

const updateOrganizationData = async () => {
  if(file.value){
    //@ts-ignore
    organizationData.image = file.value as File
  } else {
    delete organizationData.image;
  }
  await updateOrganization(organizationData, organizationData.slug)
  if(hasErrorMessages(errorMessage)){
    scrollToFirstErrorMessage()
  } else {
    clearFields();
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
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[1];
  path.value = getFirstPath(<string>route.path)
  if(type === 'edit') {
    await fetchOrganizationData(route.params.slug as string);
    formType.value = FormType.edit
    Object.assign(organizationData, {...organization.value});
    organizationData.geojson = JSON.stringify(organizationData.geojson)
    if(!isEmptyObject(organizationData.geojson)){
      isGeoJSONPreview.value = true
    }
    previewImage.value = <string>organizationData.image
    hasImage.value = true
  }
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
    <VForm id="form" ref="organizationForm" style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <div>
         <div class="d-flex">
           <RouterLink
               :to="{
            name: path == 'organizations' ?  'organizations' : 'my-organizations'
            }"
               class="text-decoration-none text-none">
             <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
               <PhArrowLeft size="14" class="mr-1"/>
               Back To {{path == 'organizations' ?  'Consortium Member Institutions' : 'My Consortium Member Institutions'}}
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
          <label class="input-label">Telephone Number<span class="text-pink">*</span></label>
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
          <label class="input-label">Research & Development Representative Name<span class="text-pink">*</span></label>
          <VTextField
              v-model="organizationData.rd_rep.full_name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.rd_rep.full_name"
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
              v-model="organizationData.rd_rep.email"
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
              v-model="organizationData.rd_rep.phone"
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
              v-model="organizationData.tt_rep.full_name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.tt_rep.full_name"
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
              v-model="organizationData.tt_rep.email"
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
              v-model="organizationData.tt_rep.phone"
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
              v-model="organizationData.ic_rep.full_name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.ic_rep.full_name"
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
              v-model="organizationData.ic_rep.email"
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
              v-model="organizationData.ic_rep.phone"
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
              v-model="organizationData.sc_rep.full_name"
              placeholder="E.g. John Doe"
              class="my-2"
              :error-messages="errorMessage.sc_rep.full_name"
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
              v-model="organizationData.sc_rep.email"
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
              v-model="organizationData.sc_rep.phone"
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
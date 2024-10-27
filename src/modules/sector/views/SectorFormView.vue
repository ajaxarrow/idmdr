<script setup lang="ts">
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import MainLayout from "../../../core/layouts/MainLayout.vue";
import OrganizationFormMapPreview from "../../organization/components/OrganizationFormMapPreview.vue";
import {
  PhEye,
  PhFileDashed, PhFileImage, PhImage,
  PhPolygon,
  PhX
} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {useTags} from "../../repository/composables/useTags.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {Repository} from "../../../interfaces/repository.interface.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {useSectorMapStore} from "../../../core/stores/sector-map.store.ts";
import {useSectorServices} from "../services/sector.services.ts";
import LoadingOverlay from "../../../core/components/LoadingOverlay.vue";
import ImagePreviewOverlay from "../../../core/components/ImagePreviewOverlay.vue";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {userData} = useUserStore();
const {addSector, hasErrorMessages, errorMessage, loading} = useSectorServices()
const {fetchOrganizationByUser} = useOrganizationServices();
const {storedGeoJSON, confirmDialog, fileName} = useSectorMapStore();
const {fetchRepositoriesByUser} = useRepositoryServices();
const {isEmptyObject} = useObjectChecker()
const {tags, fetchTags} = useTags();
const {route} = useRouting();
// const previousTags = ref<string[]>([])


const organizations = ref<Organization[]>([])
const repositories = ref<Repository[]>([])
const objectTypes = ['Organization', 'Repository']
const selectedObjectType = ref('Repository')
const sectorForm = ref(null);
const path = ref('sectors')
const isMapPreview= ref(false);
const isGeoJSONDrawn = ref(true);
const isGeoJSONPreview = ref(false);
const geoJSONFileName = ref('')
const formType = ref<FormType>(FormType.create);
const previewImage = ref('');
const isImagePreviewed = ref(false);
const hasImage = ref(false);
const file = ref<File | null>(null);
const previousTags = ref<string[]>([])

const sectorDataInitialState = reactive<Sector>({
  description: "",
  geojson: {},
  object_id: "",
  object_type: "",
  tags: [],
  name: "",
  uid: "",
  organization: null,
  repository: null,
  visibility: 1,
  address: "",
})

const sectorData = reactive({
  ...sectorDataInitialState
})

const setGeoJSON = (geojson: any, isJSONDrawn: boolean) => {
  sectorData.geojson = JSON.stringify(geojson)
  isGeoJSONDrawn.value = isJSONDrawn
}

const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 100);
}

const closeGeoJSONPreview = () => {
  isGeoJSONPreview.value = false
  isMapPreview.value = false
}

const openMapPreview = () => {
  isMapPreview.value = true
  scrollToTop()
}

const openGeoJSONPreview = () => {
  isGeoJSONPreview.value = true
  scrollToTop()
}

const closePreview = () => {
  sectorData.geojson = {}
  closeGeoJSONPreview()
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

const removeImage = () => {
  file.value = null;
  hasImage.value = false;
}

const arrayToString = (arr: string[]): string =>
    arr.length > 0 ? arr.join(', ') : '';

const getFirstPath = (url: string) => {
  return url.split('/').filter(Boolean)[0];
}

const clearFields = ( ) => {
  Object.assign(sectorData, {...sectorDataInitialState})
}

const scrollToFirstErrorMessage = () => {
  //@ts-ignore
  const fields = sectorForm.value.items
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

const addSectorData = async () => {
  if(file.value){
    //@ts-ignore
    sectorData.image = file.value as File
  } else {
    delete sectorData.image;
  }
  previousTags.value = <string[]>sectorData.tags
  sectorData.tags = arrayToString(<string[]>sectorData.tags)
  sectorData.parent = selectedObjectType.value
  sectorData.owner_id = userData.uid
  if(selectedObjectType.value === 'Repository'){
    sectorData.parent_id = sectorData.repository as string
  } else {
    sectorData.parent_id = sectorData.organization as string
  }
  await addSector(sectorData)
  if(hasErrorMessages(errorMessage)){
    sectorData.tags = previousTags.value
    scrollToFirstErrorMessage()
  } else {
    clearFields();
  }

}

const updateSectorData = async () => {

}

onMounted(async () => {
  fetchTags();
  organizations.value = await fetchOrganizationByUser();
  repositories.value = await fetchRepositoriesByUser();
  sectorData.organization = organizations.value.length > 0 ? <string>organizations.value[0].uid : null;
  sectorData.repository = repositories.value.length > 0 ? <string>repositories.value[0].uid : null;
  const rawSegments = route.path.split('/').filter(Boolean) as string[];
  const type = rawSegments[1];
  path.value = getFirstPath(<string>route.path)

  if (type === 'edit') {
    formType.value = FormType.edit
  }
  if (Object.keys(storedGeoJSON.value).length !== 0) {
    setGeoJSON(storedGeoJSON.value, true);
  }
  if(fileName.value !== '') {
    isGeoJSONDrawn.value = false
    geoJSONFileName.value = fileName.value
  }
})

onUnmounted(() => {
  storedGeoJSON.value = {}
  fileName.value = ''
  confirmDialog.value = false
})

</script>

<template>
  <LoadingOverlay :overlay="loading"/>
  <ImagePreviewOverlay
      :overlay="isImagePreviewed"
      :imageSrc="previewImage"
      @closeOverlay="isImagePreviewed = false"
  />
  <MainLayout :title="formType === FormType.edit ? 'Edit Sector' : 'New Sector'">
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
            {{formType === FormType.edit ? 'Edit Sector' : 'Create New Sector'}}
          </p>
          <p class="text-subtitle">
            A sector is an area that represents an object
          </p>
        </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
      <div class="px-6 py-3">
        <VRadioGroup  v-model="sectorData.visibility">
          <VRadio color="bs50" :value="1" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Public</p>
                <p class="radio-text-subtitle">The sector is accessible to the general public for content exploration.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="2" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Private</p>
                <p class="radio-text-subtitle">The content is accessible only to the creator or owner of the sector.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="3" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within Organization</p>
                <p class="radio-text-subtitle">The sector's information is exclusively visible to members within the organization.</p>
              </div>
            </template>
          </VRadio>
          <VRadio color="bs50" :value="4" class="my-3">
            <template v-slot:label>
              <div>
                <p class="radio-text-heading">Within All Organization</p>
                <p class="radio-text-subtitle">The sector's information is visible to all members of any organization</p>
              </div>
            </template>
          </VRadio>
        </VRadioGroup>
      </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-10">
          <label class="input-label">Boundary</label>
          <OrganizationFormMapPreview
              class="my-2"
              v-if="isMapPreview"
              @setGeoJSONData="setGeoJSON"
              @closeMapPreview="isMapPreview = false"
          />
          <div v-else>
            <div class="my-2 file-upload-container" :class="{'error-file-container': errorMessage.geojson}" v-if="isEmptyObject(sectorData.geojson)">
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
                  :geoJSONData="JSON.parse(sectorData.geojson)"
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
            <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.geojson">{{errorMessage.geojson}}</p>
          </div>
        </div>
        <div class="mb-3">
          <label class="input-label">Sector Title<span class="text-pink">*</span></label>
          <VTextField
              v-model="sectorData.name"
              placeholder="E.g. Soil Health Monitoring: Databases on Agricultural Lands Across Borders"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.name"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Sector Location<span class="text-pink">*</span></label>
          <VTextField
              v-model="sectorData.address"
              placeholder="E.g. Musuan, Bukidnon"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :error-messages="errorMessage.address"
          />
        </div>
        <div class="mb-5" v-if="formType === FormType.edit">
          <label class="input-label">Sector Description</label>
          <QuillRichTextEditor
              v-if="sectorData.description"
              :modelValue="sectorData.description"
              @update:modelValue="$event => (sectorData.description = $event)"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
          />
        </div>
        <div class="mb-5" v-else>
          <label class="input-label">Sector Description<span class="text-pink">*</span></label>
          <QuillRichTextEditor
              :modelValue="sectorData.description"
              @update:modelValue="$event => (sectorData.description = $event)"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
          />
<!--          <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.description">{{errorMessage.description}}</p>-->
        </div>
        <div class="mb-3">
          <label class="input-label">Tagged Entity<span class="text-pink">*</span></label>
          <VAutocomplete
              v-model="selectedObjectType"
              placeholder="Select What Entity to be Tagged"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="objectTypes"
          />
        </div>
        <div class="mb-3" v-if="selectedObjectType === 'Organization'">
          <label class="input-label">Organization<span class="text-pink">*</span></label>
          <VAutocomplete
              v-model="sectorData.organization"
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
        <div class="mb-3" v-else>
          <label class="input-label">Repository<span class="text-pink">*</span></label>
          <VAutocomplete
              v-model="sectorData.repository"
              placeholder="Select Repository"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="repositories"
              :item-value="repository => `${repository.uid}`"
              :item-title="repository => `${repository.title}`"
          >
            <template v-slot:item="{ props, item }">
              <VListItem
                  v-bind="props"
                  :prepend-avatar="item.raw.image as string"
                  :subtitle="item.raw.owner_data?.username!"
                  :title="`${item.raw.title}`"
              ></VListItem>
            </template>
          </VAutocomplete>
        </div>
        <div class="mb-3">
          <label class="input-label">Tags<span class="text-pink">*</span></label>
          <VAutocomplete
              placeholder="E.g. Soil Health, Agriculture Data, Global Farming, Agricultural Lands,"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              v-model="sectorData.tags as string[]"
              :items="tags"
              multiple
              chips
              closable-chips
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
                      (typeof sectorData?.image === 'string' ? sectorData.image.split('/').pop() as string : 'Image')
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
<!--            <p class="pl-2 pt-2" style="color: #b00020; font-size: 12px;" v-if="errorMessage.image">{{errorMessage.image}}</p>-->
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
              accept="image/*"
          >
            <template v-slot:prepend-inner>
              <PhFileImage/>
            </template>
          </VFileInput>
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
              @click="formType === FormType.edit ? updateSectorData() : addSectorData()"
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
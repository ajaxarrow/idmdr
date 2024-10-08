<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {onMounted, reactive, ref} from "vue";
import {PhArrowLeft, PhFileDashed, PhPolygon, PhX} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {Commercialization, RepositoryData} from "../../../interfaces/repository.interface.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";
import {
  commodities, readinessLevel, technologyStatus, technologyCategories, agencies, industries,
  ipStatus, modeStatus, priorityLevels, adopters, ipType, transferPlans, currentStatus
} from "../../../data/repository.inventory.fields.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Organization} from "../../../interfaces/organization.interface.ts";
import OrganizationFormMapPreview from "../../organization/components/OrganizationFormMapPreview.vue";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";

const {isEmptyObject} = useObjectChecker()
const {fetchOrganizationByUser} = useOrganizationServices();
const isMapPreview= ref(false);
const isGeoJSONDrawn = ref(true);
const geoJSONFileName = ref('')
const organizations = ref<Organization[]>([]);

const formType = ref<FormType>(FormType.create);

const repositoryDataIntialState = reactive<RepositoryData>({
  affiliation: "",
  commodity: "Abaca",
  description: "",
  end_date: '',
  funding_agency: "Aurora State College of Technology (ASCoT)",
  geojson: {},
  industry: "Agriculture",
  is_active: false,
  is_approved: false,
  is_deleted: false,
  location: "",
  organization: "",
  priority_level: "high",
  project_component: "",
  rpt: "",
  slug: "",
  start_date: '',
  tags: "",
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
  adopters: 'Farmers'
})

const repositoryCurrentData = reactive<RepositoryData>({
  ...repositoryDataIntialState
})

const commercialization = reactive<Commercialization>({
  adopterStatus: "",
  currentStatus: "Applied Fairness Opinion Report",
  ipStatus: "For filing",
  ipType: "Copyrigth & Related Rights",
  modeStatus: "Direct Sakes",
  regNo: ""
})

const setGeoJSON = (geojson: any, isJSONDrawn: boolean) => {
  repositoryCurrentData.geojson = JSON.stringify(geojson)
  isGeoJSONDrawn.value = isJSONDrawn
  console.log(repositoryCurrentData.geojson)
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

onMounted( async () => {
  organizations.value = await fetchOrganizationByUser();
  repositoryCurrentData.organization = organizations.value.length > 0 ? <string>organizations.value[0].uid : null
})


</script>

<template>
  <MainLayout title="New Repository">
    <div style="height: 100%" class="relative-container circle">
      <div class="pa-6 relative-container" style="z-index: 20;">
        <RouterLink
            :to="{
          name: 'repositories'
        }"
            class="text-decoration-none text-none">
          <p class="cursor-pointer back-button pa-2 d-flex align-center text-black">
            <PhArrowLeft size="14" class="mr-1"/>
            Back To Repositories
          </p>
        </RouterLink>
          <div>
            <p class="text-heading d-flex align-center">
              Create New Repository
            </p>
            <p class="text-subtitle">
              A repository contain all related project of a certain project of the organization
            </p>
          </div>
      </div>
      <VDivider/>
      <p class="mx-6 my-3 text-note">Required fields are marked with an asterisk (<span class="text-red">*</span>).</p>
      <VDivider/>
        <div class="px-6 py-3">
          <VRadioGroup  v-model="repositoryCurrentData.visibility">
            <VRadio color="bs50" :value="1" class="my-3">
              <template v-slot:label>
                <div>
                  <p class="radio-text-heading">Public</p>
                  <p class="radio-text-subtitle">The repository is accessible to the general public for content exploration.</p>
                </div>
              </template>
            </VRadio>
            <VRadio color="bs50" :value="2" class="my-3">
              <template v-slot:label>
                <div>
                  <p class="radio-text-heading">Private</p>
                  <p class="radio-text-subtitle">The content is accessible only to the creator or owner of the repository.</p>
                </div>
              </template>
            </VRadio>
            <VRadio color="bs50" :value="3" class="my-3">
              <template v-slot:label>
                <div>
                  <p class="radio-text-heading">Within Organization</p>
                  <p class="radio-text-subtitle">The repository's information is exclusively visible to members within the organization.</p>
                </div>
              </template>
            </VRadio>
            <VRadio color="bs50" :value="4" class="my-3">
              <template v-slot:label>
                <div>
                  <p class="radio-text-heading">Within All Organization</p>
                  <p class="radio-text-subtitle">The repository's information is visible to all members of any organization</p>
                </div>
              </template>
            </VRadio>
          </VRadioGroup>
        </div>
      <VDivider/>
      <div class="pa-6">
        <div class="mb-3">
          <label class="input-label">Repository Title<span class="text-pink">*</span></label>
          <VTextField
            v-model="repositoryCurrentData.title"
            placeholder="E.g. Soil Health Monitoring: Databases on Agricultural Lands Across Borders"
            class="my-2"
            rounded="lg"
            density="comfortable"
            variant="outlined"
            color="primary"
            base-color="gs60"
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Organization</label>
          <VAutocomplete
              v-model="repositoryCurrentData.organization"
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
<!--        <div class="mb-3">-->
<!--          <label class="input-label">Subtitle</label>-->
<!--          <VTextField-->
<!--              v-model="repositoryCurrentData.subtitle"-->
<!--              placeholder="E.g. Unveiling the Global Tapestry of Soil Vitality and Agricultural Sustainability"-->
<!--              class="my-2"-->
<!--              rounded="lg"-->
<!--              density="comfortable"-->
<!--              variant="outlined"-->
<!--              color="primary"-->
<!--              base-color="gs60"-->
<!--              hint="Short description about the project"-->
<!--          />-->
<!--        </div>-->
        <div class="mb-3" v-if="formType === FormType.edit">
          <label class="input-label">Abstract</label>
          <QuillRichTextEditor
              v-if="repositoryCurrentData.description"
              :modelValue="repositoryCurrentData.description"
              @update:modelValue="$event => (repositoryCurrentData.description = $event)"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
          />
        </div>
        <div class="mb-5" v-else>
          <label class="input-label">Abstract</label>
          <QuillRichTextEditor
              :modelValue="repositoryCurrentData.description"
              @update:modelValue="$event => (repositoryCurrentData.description = $event)"
              placeholder="E.g. This dataset presents a comprehensive array of meticulously compiled data related to soil health and agricultural landscapes across diverse global regions. It encompasses an extensive range of indicators vital for understanding soil conditions and their implications for sustainable cultivation practices."
          />
        </div>
        <div class="mb-5">
          <label class="input-label">Project Component</label>
          <VTextField
              v-model="repositoryCurrentData.project_component"
              placeholder="E.g. Project Component 1"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Location</label>
          <VTextField
              v-model="repositoryCurrentData.location"
              placeholder="E.g. Musuan, Bukidnon"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Commodity</label>
          <VAutocomplete
              v-model="repositoryCurrentData.commodity"
              placeholder="Select Commodity"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="commodities"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Industry</label>
          <VAutocomplete
              v-model="repositoryCurrentData.industry"
              placeholder="Select Industry"
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
          <label class="input-label">Start Date</label>
          <VTextField
              v-model="repositoryCurrentData.start_date"
              type="date"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">End Date</label>
          <VTextField
              v-model="repositoryCurrentData.end_date"
              type="date"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Category</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_category"
              placeholder="Select Technology Category"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="technologyCategories"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Status</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_status"
              placeholder="Select Technology Status"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="technologyStatus"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Readiness Level</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_readiness_level"
              placeholder="Select Readiness Level"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="readinessLevel"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Research Project/s Conducted</label>
          <VTextField
              v-model="repositoryCurrentData.rpt"
              placeholder="Enter Research Project/s Conducted"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Funding Agency</label>
          <VAutocomplete
              v-model="repositoryCurrentData.funding_agency"
              placeholder="Select Funding Agency"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="agencies"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Generator</label>
          <VTextField
              v-model="repositoryCurrentData.technology_generator"
              placeholder="Enter Technology Generator"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Affiliation</label>
          <VTextField
              v-model="repositoryCurrentData.affiliation"
              placeholder="Enter Affiliation"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Owners</label>
          <VAutocomplete
              v-model="repositoryCurrentData.tech_owner"
              placeholder="Select Technology Owners"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="agencies"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Existing or Potential Adopters</label>
          <VAutocomplete
              v-model="repositoryCurrentData.adopters"
              placeholder="Select Adopter"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="adopters"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Technology Transfer Plan</label>
          <VAutocomplete
              v-model="repositoryCurrentData.transfer_plan"
              placeholder="Select Transfer Plan"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="transferPlans"
          />
        </div>
        <div v-if="repositoryCurrentData.transfer_plan == 'Commercialization'">
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
              v-model="repositoryCurrentData.technology_transfer_status"
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
              v-model="repositoryCurrentData.priority_level"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :item-value="priorityLevel => `${priorityLevel}`"
              :items="priorityLevels"
              :item-title="priorityLevel => `${priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}`"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Affiliation</label>
          <VTextField
              placeholder="E.g. College of Forestry and Environmental Science"
              class="my-2"
              
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Tags</label>
          <VTextField
              placeholder="E.g. Soil Health, Agriculture Data, Global Farming, Agricultural Lands,"
              class="my-2"
              
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div class="mb-10">
          <label class="input-label">File</label>
          <div class="my-2 file-upload-container">
            <PhFileDashed size="50"/>
            <p class="text-dropzone">Drag and drop files here or <label class="file-label" for="dropzoneFile">Choose files</label></p>
            <VFileInput id="dropzoneFile" style="display: none"/>
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
            <div class="my-2 file-upload-container" v-if="isEmptyObject(repositoryCurrentData.geojson)">
              <PhFileDashed size="50"/>
              <p class="text-dropzone">
                Drag and drop files here or
                <label class="file-label" for="dropzoneFileGeoJSON">Choose files</label>
                or <label class="file-label" @click="isMapPreview = !isMapPreview">Draw Boundary</label>
              </p>
              <VFileInput id="dropzoneFileGeoJSON" style="display: none" @change="handleGeoJSONFileInput" accept="application/json"/>
            </div>
            <div class="my-3" v-else>
              <VDivider/>
              <div class="d-flex align-center justify-space-between pa-2" >
                <p class="dialog-boundary-title d-flex align-center">
                  <PhPolygon class="mr-1"/>
                  {{isGeoJSONDrawn ? `drawn-boundary-coordinates-${formatDate()}` : geoJSONFileName}}
                </p>
                <PhX class="cursor-pointer" @click="repositoryCurrentData.geojson = {}"/>
              </div>
              <VDivider/>
            </div>
          </div>
        </div>
        <VRow class="ma-0" justify="end">
          <VBtnPrimaryFilled
            rounded="lg"
            height="44px"
            width="166px"
          >
            Submit
          </VBtnPrimaryFilled>
        </VRow>
      </div>
    </div>

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
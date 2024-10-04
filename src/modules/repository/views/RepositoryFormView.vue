<script setup lang="ts">
import MainLayout from "../../../core/layouts/MainLayout.vue";
import {reactive, ref} from "vue";
import {PhArrowLeft, PhFileDashed} from "@phosphor-icons/vue";
import QuillRichTextEditor from "../../../core/components/QuillRichTextEditor.vue";
import {RepositoryData} from "../../../interfaces/repository.interface.ts";
import {FormType} from "../../../interfaces/enums/formtype.enum.ts";

const formType = ref<FormType>(FormType.create);

const repositoryDataIntialState = reactive<RepositoryData>({
  geojson: {},
  is_active: false,
  is_deleted: false,
  is_private: false,
  organization: "",
  priority_level: "High",
  visibility: 1,
  slug: '',
  title: '',
  subtitle: '',
  description: '',
  commodity: 'Abaca',
  industry: 'Crops',
  technology_category: '',
  technology_status: '',
  technology_readiness_level: '',
  rpt: '',
  funding_agency: '',
  transfer_plan: 'Extension',
  technology_transfer_status: '',
  commercialization_status: '',
  ip_status: '',
  ip_registration_number: '',
  adaptor_status: '',
  technology_generator: '',
  tech_owner: ''
})

const repositoryCurrentData = reactive<RepositoryData>({
  ...repositoryDataIntialState
})

const commodities = [
  'Abaca', 'Banana', 'Cacao', 'Cashew', 'Cement/Concrete', 'Citrus', 'Coconut', 'Coffee', 'Corn', 'Grains', 'Legume - Mungbean', 'Legume - Peanut', 'Legume - Soybean', 'Mango', 'Medicinal Plants', 'Natural Sources of Dye', 'Oil Palm', 'Ornamental - Cutflowers', 'Ornamental - Foliages', 'Pili', 'Rice', 'Rubber', 'Rootcrops - Sweet Potato', 'Rootcrops - Cassava', 'Sericulture and Apiculture', 'Sugarcane', 'Tropical Fruits - Durian', 'Tropical Fruits - Papaya', 'Tropical Fruits - Pineapple', 'Tropical Fruits - Pomelo', 'Tropical Fruits - Jackfruit', 'Tropical Fruits - Citrus', 'Vegetables', 'Crops (Others)',
]

const industries = [
    'Crops', 'Livestock', 'Marine and Inland Aquatic', 'Forestry', 'Environmental Services / Climate Change Adaptation and Disaster Risk Reduction', 'Agriculture', 'Information Technology', 'Food Processing', 'Mining', 'Biotechnology / Molecular Technology', 'Construction', 'Others'
]

const transferPlan = ["Extension", "Deployment", "Commercialization"]

const priorityLevel = ["High", "Medium", "Low"]

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
        <div class="mb-3">
          <label class="input-label">Subtitle</label>
          <VTextField
              v-model="repositoryCurrentData.subtitle"
              placeholder="E.g. Unveiling the Global Tapestry of Soil Vitality and Agricultural Sustainability"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              hint="Short description about the project"
          />
        </div>
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
          <label class="input-label">Technology Category</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_category"
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
          <label class="input-label">Technology Status</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_status"
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
          <label class="input-label">Technology Readiness Level</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_readiness_level"
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
          <label class="input-label">Research Project/s Conducted</label>
          <VTextField
              v-model="repositoryCurrentData.rpt"
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
          <label class="input-label">Funding Agency</label>
          <VAutocomplete
              v-model="repositoryCurrentData.funding_agency"
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
          <label class="input-label">Technology Generator</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_generator"
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
          <label class="input-label">Affiliation</label>
          <VTextField
              v-model="repositoryCurrentData.technology_generator"
              placeholder="Enter Affiliation"
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
          <label class="input-label">Technology Owners</label>
          <VAutocomplete
              v-model="repositoryCurrentData.tech_owner"
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
          <label class="input-label">Existing or Potential Adaptors</label>
          <VAutocomplete
              v-model="repositoryCurrentData.adaptor_status"
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
          <label class="input-label">Technology Transfer Plan</label>
          <VAutocomplete
              v-model="repositoryCurrentData.transfer_plan"
              placeholder="Select Industry"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="transferPlan"
          />
        </div>
        <div v-if="repositoryCurrentData.transfer_plan == 'Commercialization'">
          <div class="mb-3">
            <label class="input-label">IP Type</label>
            <VAutocomplete
                v-model="repositoryCurrentData.technology_transfer_status"
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
            <label class="input-label">IP Status</label>
            <VAutocomplete
                v-model="repositoryCurrentData.ip_status"
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
            <label class="input-label">IP Registration Number</label>
            <VTextField
                v-model="repositoryCurrentData.ip_registration_number"
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
                v-model="repositoryCurrentData.commercialization_status"
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
            <label class="input-label">Commercialization Status (Current)</label>
            <VAutocomplete
                v-model="repositoryCurrentData.commercialization_status"
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
            <label class="input-label">Commercialization Status (Adaptor)</label>
            <VTextField
                v-model="repositoryCurrentData.adaptor_status"
                placeholder="Enter Commercialization Status"
                class="my-2"
                rounded="lg"
                density="comfortable"
                variant="outlined"
                color="primary"
                base-color="gs60"
                :items="industries"
            />
          </div>
        </div>
        <div class="mb-3" v-else>
          <label class="input-label">Technology Transfer Status</label>
          <VAutocomplete
              v-model="repositoryCurrentData.technology_transfer_status"
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
          <label class="input-label">Priority Level</label>
          <VAutocomplete
              v-model="repositoryCurrentData.priority_level"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              :items="priorityLevel"
          />
        </div>
        <div class="mb-3">
          <label class="input-label">Start Date</label>
          <VTextField
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
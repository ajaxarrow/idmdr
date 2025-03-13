<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import cmis from "../../../data/cmis.ts";
import { CMI } from "../../../interfaces/cmi.interface.ts";
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

const router = useRouter();
const searchQuery = ref('');
const loading = ref(true);

// Separate CMIs into research and non-research categories
const researchInstitutions = computed(() => {
  return filteredCmis.value.filter(cmi => cmi.research);
});

const otherInstitutions = computed(() => {
  return filteredCmis.value.filter(cmi => !cmi.research);
});

// Filter CMIs based on search query
const filteredCmis = computed(() => {
  if (!searchQuery.value) return cmis;

  const query = searchQuery.value.toLowerCase();
  return cmis.filter(cmi =>
      cmi.name.toLowerCase().includes(query) ||
      cmi.acronym.toLowerCase().includes(query)
  );
});

// Handle CMI click based on withData and link properties
const handleCmiClick = (cmi: CMI) => {
  if (cmi.withData) {
    router.push({ name: 'cmi-details', params: { slug: cmi.slug } });
  } else if (cmi.link) {
    window.open(cmi.link, '_blank');
  }
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<template>
  <VLayout>
    <div style="width: 100%">
      <Navbar>
        <VContainer>
          <VRow class="mb-8">
            <VCol cols="12">
              <h1 class="text-h3 font-weight-bold text-center mb-3 mt-10">Consortium Member Institutions</h1>
              <p class="text-body-1 text-center mb-8">
                Explore our network of academic and research institutions within the consortium.
              </p>

              <VRow justify="center">
                <VCol cols="12" sm="8" md="6">
                  <VTextField
                      v-model="searchQuery"
                      placeholder="Search institutions by name or acronym"
                      hide-details
                      rounded="lg"
                      density="comfortable"
                      variant="outlined"
                      color="primary"
                      base-color="gs60"
                      prepend-inner-icon="mdi-magnify"
                      clearable
                  ></VTextField>
                </VCol>
              </VRow>
            </VCol>
          </VRow>

          <!-- Loading State -->
          <VRow v-if="loading" justify="center" class="my-12" style="min-height: 50vh;">
            <VCol cols="12" class="text-center">
              <VProgressCircular indeterminate color="bs50" size="64"></VProgressCircular>
              <p class="mt-4 text-body-1">Loading institutions...</p>
            </VCol>
          </VRow>

          <template v-else>
            <!-- Research Institutions Section -->
            <section v-if="researchInstitutions.length > 0" class="mb-10">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex align-center mb-4">
                    <VIcon icon="mdi-flask" color="primary" class="mr-2" size="x-large"></VIcon>
                    <h2 class="text-h4 font-weight-bold">Research Delivering Institutions</h2>
                  </div>
                  <VDivider class="mb-4"></VDivider>
                </VCol>
              </VRow>

              <VRow>
                <VCol
                    v-for="cmi in researchInstitutions"
                    :key="cmi.acronym"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    class="mb-4"
                >
                  <VCard
                      class="h-100 institution-card"
                      :class="{ 'with-data': cmi.withData, 'external-link': !cmi.withData }"
                      @click="handleCmiClick(cmi)"
                      :ripple="true"
                      elevation="2"
                      hover
                  >
                    <div class="card-img-container">
                      <VImg
                          :src="cmi.logo"
                          aspect-ratio="1"
                          cover
                          class="institution-logo bg-grey-lighten-3"
                          height="180"
                      >
                        <template v-slot:placeholder>
                          <VRow class="fill-height ma-0" align="center" justify="center">
                            <VProgressCircular indeterminate color="primary"></VProgressCircular>
                          </VRow>
                        </template>
                      </VImg>
                      <div class="badge research-badge" v-if="cmi.research">Research</div>
                      <div class="badge link-badge" v-else>Non-Research</div>
                    </div>

                    <VCardTitle class="text-center pt-4 pb-2">
                      <div class="text-subtitle-1 font-weight-bold">{{ cmi.acronym }}</div>
                    </VCardTitle>

                    <VCardText class="text-center pb-4">
                      <div class="text-body-2">{{ cmi.name }}</div>
                    </VCardText>

                  </VCard>
                </VCol>
              </VRow>
            </section>

            <!-- Other Institutions Section -->
            <section v-if="otherInstitutions.length > 0">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex align-center mb-4">
                    <VIcon icon="mdi-school" color="primary" class="mr-2" size="x-large"></VIcon>
                    <h2 class="text-h4 font-weight-bold">Non-Research Delivering Institutions</h2>
                  </div>
                  <VDivider class="mb-4"></VDivider>
                </VCol>
              </VRow>

              <VRow>
                <VCol
                    v-for="cmi in otherInstitutions"
                    :key="cmi.acronym"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    class="mb-4"
                >
                  <VCard
                      class="h-100 institution-card"
                      :class="{ 'with-data': cmi.withData, 'external-link': !cmi.withData }"
                      @click="handleCmiClick(cmi)"
                      :ripple="true"
                      elevation="2"
                      hover
                  >
                    <div class="card-img-container">
                      <VImg
                          :src="cmi.logo"
                          aspect-ratio="1"
                          cover
                          class="institution-logo bg-grey-lighten-3"
                          height="180"
                      >
                        <template v-slot:placeholder>
                          <VRow class="fill-height ma-0" align="center" justify="center">
                            <VProgressCircular indeterminate color="primary"></VProgressCircular>
                          </VRow>
                        </template>
                      </VImg>
                      <div class="badge link-badge" v-if="cmi.research">Research</div>
                      <div class="badge link-badge" v-else>Non-Research</div>
                    </div>

                    <VCardTitle class="text-center pt-4 pb-2">
                      <div class="text-subtitle-1 font-weight-bold">{{ cmi.acronym }}</div>
                    </VCardTitle>

                    <VCardText class="text-center pb-4">
                      <div class="text-body-2">{{ cmi.name }}</div>
                    </VCardText>

                  </VCard>
                </VCol>
              </VRow>
            </section>

            <!-- No Results -->
            <EmptyStateInfo
              v-if="filteredCmis.length === 0"
              description="We couldn't find any institutions matching your search criteria."
              header="No Institutions Found"
              :isCallbackNeeded="true"
              @callback="searchQuery = ''"
            />
          </template>
        </VContainer>
        <VDivider/>
        <Footer/>
      </Navbar>
    </div>
  </VLayout>
</template>


<style scoped>
.institution-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.institution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.institution-logo {
  background-position: center;
  transition: all 0.3s ease;
  padding: 16px;
}

.card-img-container {
  position: relative;
  overflow: hidden;
}

.badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  border-top-left-radius: 8px;
  color: white;
  z-index: 1;
}

.research-badge {
  background-color: rgba(76, 175, 80, 0.9);
}

.link-badge {
  background-color: rgba(33, 150, 243, 0.9);
}

.with-data:hover .institution-logo {
  opacity: 0.9;
}

.external-link:hover .institution-logo {
  opacity: 0.8;
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
</style>
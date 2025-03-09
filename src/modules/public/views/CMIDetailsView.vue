<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import { onMounted, ref, computed } from "vue";
import { CMI } from "../../../interfaces/cmi.interface.ts";
import cmis from "../../../data/cmis.ts";
import { useRouting } from "../../../core/composables/useRouting.ts";
import { ClusterType } from "../../../interfaces/enums/organization.enum.ts";
import { ClusterRepresentative } from "../../../interfaces/organization.interface.ts";
import {PhIdentificationCard, PhInfo, PhUsers} from "@phosphor-icons/vue";

const { route } = useRouting();
const cmi = ref<CMI | null>(null);
const pageLoading = ref(false);

const groupedRepresentatives = computed(() => {
  if (!cmi.value) return {};

  const grouped: Record<ClusterType, ClusterRepresentative[]> = {
    [ClusterType.ResearchAndDevelopment]: [],
    [ClusterType.TechnologyTransfer]: [],
    [ClusterType.InformationCommunication]: [],
    [ClusterType.ScienceCommunication]: []
  };

  if (cmi.value) {
    cmi.value!.representatives?.forEach(rep => {
      if (grouped[rep.type]) {
        grouped[rep.type].push(rep);
      }
    });
  }

  return grouped;
});

onMounted(async () => {
  pageLoading.value = true;
  cmi.value = await cmis.find((cmi) => cmi.slug === route.params.slug)!;
  pageLoading.value = false;
});
</script>

<template>
  <VLayout>
    <div style="width: 100%">
      <Navbar />

      <VContainer fluid class="p-0" v-if="cmi">
        <VParallax :src="cmi.cover" height="400" class="hero-parallax">
          <div class="hero-overlay"></div>
          <VContainer class="d-flex flex-column justify-center h-100">
            <VAvatar size="120" class="mb-4 elevation-5 bg-white pa-2" rounded="0">
              <VImg :src="cmi.logo" alt="CMI Logo" contain />
            </VAvatar>
            <h1 class="text-h3 font-weight-bold text-white mb-2">{{ cmi.name }}</h1>
            <h2 class="text-h5 font-weight-regular text-white mb-2">({{ cmi.acronym }})</h2>
          </VContainer>
        </VParallax>

        <VContainer class="py-8">
          <VRow>
            <VCol cols="12" md="8">
              <VCard class="mb-6 elevation-2 pa-4">
                <VCardTitle class="text-h5 primary d-flex align-center ga-2">
                  <PhInfo/>
                  About
                </VCardTitle>
                <VCardText class="pa-4">
                  <div v-if="cmi.description" class="text-body-1 text-justify">
                    <p v-for="(paragraph, index) in cmi.description.split('\n')" :key="index" class="mb-4">
                      {{ paragraph }}
                    </p>
                  </div>
                  <div v-else class="text-body-1 text-disabled">
                    No description available for this institution.
                  </div>
                </VCardText>
              </VCard>

              <VCard class="elevation-2 pa-4">
                <VCardTitle class="text-h5 primary d-flex align-center ga-2 mb-4">
                  <PhUsers/>
                  Cluster Representatives
                </VCardTitle>
                <VCardText class="pa-0">
                  <VExpansionPanels>
                    <VExpansionPanel v-for="(representatives, type) in groupedRepresentatives" :key="type">
                      <VExpansionPanelTitle>
                        <span class="text-subtitle-1">{{ type }}</span>
                      </VExpansionPanelTitle>
                      <VExpansionPanelText>
                        <VList>
                          <VListItem v-for="(rep, index) in representatives" :key="index" class="py-2">
                            <template v-slot:prepend>
                              <VAvatar color="primary" class="mr-3">
                                <span class="text-h6 text-white">{{ rep!.name!.charAt(0) }}</span>
                              </VAvatar>
                            </template>
                            <VListItemTitle>{{ rep.name }}</VListItemTitle>
                            <VListItemSubtitle v-if="rep.email">
                              <VIcon size="small" icon="mdi-email-outline" class="mr-1"></VIcon>
                              {{ rep!.email! }}
                            </VListItemSubtitle>
                          </VListItem>
                        </VList>
                      </VExpansionPanelText>
                    </VExpansionPanel>
                  </VExpansionPanels>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" md="4">
              <VCard class="mb-6 elevation-2 pa-4">
                <VCardTitle class="text-h5 primary d-flex align-center ga-2">
                  <PhIdentificationCard/>
                  Institution Details
                </VCardTitle>
                <VCardText class="pa-0">
                  <VList>
                    <VListItem v-if="cmi.director">
                      <template v-slot:prepend>
                        <VIcon icon="mdi-account-tie" color="primary"></VIcon>
                      </template>
                      <VListItemTitle class="font-weight-bold">Director</VListItemTitle>
                      <VListItemSubtitle>{{ cmi.director }}</VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VContainer>

      <VContainer v-else-if="pageLoading" class="d-flex justify-center align-center" style="min-height: 60vh">
        <VProgressCircular indeterminate color="primary" size="64"></VProgressCircular>
      </VContainer>

      <VContainer v-else class="d-flex flex-column justify-center align-center text-center" style="min-height: 60vh">
        <VIcon icon="mdi-alert-circle" size="64" color="error" class="mb-4"></VIcon>
        <h2 class="text-h4 mb-2">Institution Not Found</h2>
        <p class="text-body-1 mb-6">The institution you're looking for could not be found.</p>
        <VBtn color="primary" prepend-icon="mdi-arrow-left">Return to Consortium</VBtn>
      </VContainer>
      <VDivider/>
      <Footer/>
    </div>
  </VLayout>
</template>

<style scoped>
.hero-parallax {
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

}
</style>

<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue';
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import {PhCheckCircle, PhX} from "@phosphor-icons/vue";
import EmptyStateInfo from "../../../core/components/EmptyStateInfo.vue";

interface Director {
  id: number;
  name: string;
  period: string;
  startYear: number;
  endYear: number | string;
  image: string;
  achievements: string[];
  isExpanded: boolean;
}

const searchQuery = ref('');
const loading = ref(true);
const activeDirector = ref<Director | null>(null);
const showModal = ref(false);
const filteredDirectors = ref<Director[]>([]);

// Directors data
const directors = ref<Director[]>([
  {
    id: 1,
    name: "Dr. Lamberto B. Boloron",
    period: "1978-1983",
    startYear: 1978,
    endYear: 1983,
    image: "/images/directors/placeholder.png",
    achievements: ["Founding director of NOMCAARRD", "Established initial research framework"],
    isExpanded: false
  },
  {
    id: 2,
    name: "Dr. Elmedio T. Rivas",
    period: "1983-1985",
    startYear: 1983,
    endYear: 1985,
    image: "/images/directors/placeholder.png",
    achievements: ["Expanded regional research initiatives", "Developed agricultural extension programs"],
    isExpanded: false
  },
  {
    id: 3,
    name: "Dr. Hermino M. Pava",
    period: "1985-1986",
    startYear: 1985,
    endYear: 1986,
    image: "/images/directors/placeholder.png",
    achievements: ["Strengthened community partnerships", "Initiated technology transfer programs"],
    isExpanded: false
  },
  {
    id: 4,
    name: "Dr. Perfecto Hebron",
    period: "1986",
    startYear: 1986,
    endYear: 1986,
    image: "/images/directors/placeholder.png",
    achievements: ["Interim leadership during transition period"],
    isExpanded: false
  },
  {
    id: 5,
    name: "Dr. Jose Arances",
    period: "1986",
    startYear: 1986,
    endYear: 1986,
    image: "/images/directors/placeholder.png",
    achievements: ["Brief leadership tenure", "Maintained organizational stability"],
    isExpanded: false
  },
  {
    id: 6,
    name: "Dr. Lorenzo Z. Margate",
    period: "1986-1990",
    startYear: 1986,
    endYear: 1990,
    image: "/images/directors/placeholder.png",
    achievements: ["Modernized research methodologies", "Expanded international collaborations"],
    isExpanded: false
  },
  {
    id: 7,
    name: "Dr. Nonito S. Franje",
    period: "1991-1993",
    startYear: 1991,
    endYear: 1993,
    image: "/images/directors/placeholder.png",
    achievements: ["Implemented strategic planning initiatives", "Enhanced research funding channels"],
    isExpanded: false
  },
  {
    id: 8,
    name: "Dr. Frederick M. Corey",
    period: "1993-2000",
    startYear: 1993,
    endYear: 2000,
    image: "/images/directors/placeholder.png",
    achievements: ["Longest-serving director of the decade", "Established key research partnerships"],
    isExpanded: false
  },
  {
    id: 9,
    name: "Dr. Rebecca B. Cagmat",
    period: "2000-2009",
    startYear: 2000,
    endYear: 2009,
    image: "/images/directors/placeholder.png",
    achievements: ["Led NOMCAARRD into the 21st century", "Digitized research management systems"],
    isExpanded: false
  },
  {
    id: 10,
    name: "Dr. Lucerne M. Razalo",
    period: "2009 (OIC)",
    startYear: 2009,
    endYear: 2009,
    image: "/images/directors/placeholder.png",
    achievements: ["Officer-in-Charge during transition", "Maintained operational continuity"],
    isExpanded: false
  },
  {
    id: 11,
    name: "Dr. Anthony M. Penaso",
    period: "2009-2011",
    startYear: 2009,
    endYear: 2011,
    image: "/images/directors/placeholder.png",
    achievements: ["Expanded research focus areas", "Enhanced community engagement programs"],
    isExpanded: false
  },
  {
    id: 12,
    name: "Dr. Judith D. Intong",
    period: "2011-2014",
    startYear: 2011,
    endYear: 2014,
    image: "/images/directors/placeholder.png",
    achievements: ["Introduced innovative research methodologies", "Strengthened institutional collaborations"],
    isExpanded: false
  },
  {
    id: 13,
    name: "Dr. Emily Damag",
    period: "2014-2015",
    startYear: 2014,
    endYear: 2015,
    image: "/images/directors/placeholder.png",
    achievements: ["Focused on sustainability in research", "Enhanced stakeholder engagement"],
    isExpanded: false
  },
  {
    id: 14,
    name: "Dr. Maria Estela B. Detalla",
    period: "2015-2019",
    startYear: 2015,
    endYear: 2019,
    image: "/images/directors/placeholder.png",
    achievements: ["Modernized institutional frameworks", "Expanded international reach"],
    isExpanded: false
  },
  {
    id: 15,
    name: "Dr. Agnes S. Riñon",
    period: "2019-2020",
    startYear: 2019,
    endYear: 2020,
    image: "/images/directors/placeholder.png",
    achievements: ["Led response to changing research landscapes", "Enhanced digital transformation"],
    isExpanded: false
  },
  {
    id: 16,
    name: "Dr. Emmanuel P. Leaño",
    period: "2020-2023",
    startYear: 2020,
    endYear: 2023,
    image: "/images/directors/placeholder.png",
    achievements: ["Guided institution through pandemic challenges", "Expanded virtual research initiatives"],
    isExpanded: false
  },
  {
    id: 17,
    name: "Dr. Maria Estela B. Detalla",
    period: "2023-present",
    startYear: 2023,
    endYear: "present",
    image: "/images/directors/placeholder.png",
    achievements: ["Current director serving second term", "Focusing on innovation and sustainability"],
    isExpanded: false
  }
]);

// Filter directors based on search query
const filterDirectors = () => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    filteredDirectors.value = sortedDirectors.value;
    return;
  }

  const query = searchQuery.value.toLowerCase();
  filteredDirectors.value = sortedDirectors.value.filter(director =>
      director.name.toLowerCase().includes(query) ||
      director.period.toLowerCase().includes(query)
  );
  setTimeout(() => {
    observeTimelineItems();
  }, 100);
};

// Sort directors in descending order (newest to oldest)
const sortedDirectors = computed(() => {
  return [...directors.value].sort((a, b) => b.startYear - a.startYear);
});

// Watch for changes in searchQuery and update filteredDirectors
watch(() => searchQuery.value, () => {
  filterDirectors();
});

// Toggle timeline item expansion
const toggleExpand = (director: Director) => {
  director.isExpanded = !director.isExpanded;
};

// Open director details modal
const openDirectorDetails = (director: Director) => {
  activeDirector.value = director;
  showModal.value = true;
};

// Animation intersection observer
const observeTimelineItems = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-timeline-item');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
    filteredDirectors.value = sortedDirectors.value;
    // Set up timeline animations after loading
    setTimeout(() => {
      observeTimelineItems();
    }, 100);
  }, 800);
});
</script>

<template>
  <VLayout>
    <div style="width: 100%">
      <Navbar>
        <VContainer>
          <VRow class="mb-8">
            <VCol cols="12">
              <h1 class="text-h3 font-weight-bold text-center mb-3 mt-10">
                Legacy of Leadership
              </h1>
              <p class="text-body-1 text-center mb-4">
                Honoring Four Decades of NOMCAARRD Directors (1978-Present)
              </p>
              <div class="d-flex justify-center">
                <VChip color="primary" class="px-3 py-1 mb-8">17 Visionary Leaders</VChip>
              </div>

              <VRow justify="center">
                <VCol cols="12" sm="8" md="6">
                  <VTextField
                      v-model="searchQuery"
                      placeholder="Search by director name or year"
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
              <p class="mt-4 text-body-1">Exploring our leadership history...</p>
            </VCol>
          </VRow>

          <template v-else>
            <!-- Timeline Section -->
            <section v-if="filteredDirectors.length > 0" class="timeline-container my-10">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex align-center mb-6">
                    <VIcon icon="mdi-history" color="primary" class="mr-2" size="x-large"></VIcon>
                    <h2 class="text-h4 font-weight-bold">Director Timeline</h2>
                  </div>
                  <VDivider class="mb-8"></VDivider>
                </VCol>
              </VRow>

              <!-- Timeline -->
              <div class="timeline-wrapper">
                <div class="timeline-line"></div>

                <div
                    v-for="(director, index) in filteredDirectors"
                    :key="director.id"
                    class="timeline-item"
                    :class="{ 'right-aligned': index % 2 !== 0, 'expanded': director.isExpanded }"
                >
                  <div class="timeline-node">
                    <div class="timeline-dot" @click="toggleExpand(director)">
                      <VIcon icon="mdi-account" size="small" color="white"></VIcon>
                    </div>
                    <div class="timeline-year">{{ director.startYear }}</div>
                  </div>

                  <VCard
                      class="timeline-card"
                      elevation="3"
                      @click="openDirectorDetails(director)"
                      hover
                  >
                    <div class="d-flex">
                      <div class="timeline-card-image">
                        <VImg
                            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                            height="100%"
                            cover
                            class="director-image"
                        >
                          <template v-slot:placeholder>
                            <VRow class="fill-height ma-0" align="center" justify="center">
                              <VProgressCircular indeterminate color="primary"></VProgressCircular>
                            </VRow>
                          </template>
                        </VImg>
                      </div>
                      <div class="timeline-card-content pa-4">
                        <h3 class="text-h6 font-weight-bold">{{ director.name }}</h3>
                        <div class="period-badge my-1">{{ director.period }}</div>
                        <p v-if="director.isExpanded" class="text-body-2 mt-2">
                          {{ director.achievements[0] }}
                        </p>
                        <VBtn
                            v-if="director.isExpanded"
                            color="primary"
                            variant="text"
                            size="small"
                            class="mt-2 px-0"
                            @click.stop="openDirectorDetails(director)"
                        >
                          Learn more
                          <VIcon right>mdi-arrow-right</VIcon>
                        </VBtn>
                      </div>
                    </div>
                  </VCard>
                </div>
              </div>
            </section>

            <!-- No Results -->
            <EmptyStateInfo
                v-else
                header="No Directors Found"
                description="We couldn't find any directors matching your search criteria."
                :isCallbackNeeded="true"
                @callback="searchQuery = ''"
            />

            <!-- Decade Summary Statistics -->
            <section class="decade-stats my-12">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex align-center mb-4">
                    <VIcon icon="mdi-chart-timeline-variant" color="primary" class="mr-2" size="x-large"></VIcon>
                    <h2 class="text-h4 font-weight-bold">Leadership by Decade</h2>
                  </div>
                  <VDivider class="mb-6"></VDivider>
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="12" sm="6" md="3">
                  <VCard class="decade-card" height="100%" hover>
                    <VCardTitle class="text-center pt-4">
                      <span class="text-h5 font-weight-bold">1970s-1980s</span>
                    </VCardTitle>
                    <VCardText class="text-center">
                      <div class="decade-stat">6</div>
                      <p>Directors</p>
                    </VCardText>
                  </VCard>
                </VCol>

                <VCol cols="12" sm="6" md="3">
                  <VCard class="decade-card" height="100%" hover>
                    <VCardTitle class="text-center pt-4">
                      <span class="text-h5 font-weight-bold">1990s-2000s</span>
                    </VCardTitle>
                    <VCardText class="text-center">
                      <div class="decade-stat">4</div>
                      <p>Directors</p>
                    </VCardText>
                  </VCard>
                </VCol>

                <VCol cols="12" sm="6" md="3">
                  <VCard class="decade-card" height="100%" hover>
                    <VCardTitle class="text-center pt-4">
                      <span class="text-h5 font-weight-bold">2010s</span>
                    </VCardTitle>
                    <VCardText class="text-center">
                      <div class="decade-stat">4</div>
                      <p>Directors</p>
                    </VCardText>
                  </VCard>
                </VCol>

                <VCol cols="12" sm="6" md="3">
                  <VCard class="decade-card" height="100%" hover>
                    <VCardTitle class="text-center pt-4">
                      <span class="text-h5 font-weight-bold">2020s</span>
                    </VCardTitle>
                    <VCardText class="text-center">
                      <div class="decade-stat">3</div>
                      <p>Directors</p>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </section>

          </template>
        </VContainer>

        <!-- Director Detail Modal -->
        <VDialog v-model="showModal" max-width="600px">
          <VSheet class="dialog-container" v-if="activeDirector">
            <div class="d-flex justify-space-between align-center pr-4">
              <p class="dialog-title pa-5">{{ activeDirector.name }}</p>
              <PhX  @click="showModal = false"/>
            </div>
            <VDivider/>
            <div class="pa-5">
              <VRow>
                <VCol cols="12" sm="4">
                  <VImg
                      src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                      class="rounded director-modal-image"
                      height="200"
                      cover
                  ></VImg>
                  <div class="text-center mt-2">
                    <VChip color="primary" class="mt-2">{{ activeDirector.period }}</VChip>
                  </div>
                </VCol>
                <VCol cols="12" sm="8">
                  <h3 class="text-h6 font-weight-bold mb-2">Achievements & Contributions</h3>
                    <div class="d-flex align-center ga-1" v-for="(achievement, i) in activeDirector.achievements" :key="i">
                      <PhCheckCircle weight="fill" size="18" color="#3291c7"/>
                      <VListItemTitle>{{ achievement }}</VListItemTitle>
                    </div>

                  <h3 class="text-h6 font-weight-bold mt-4 mb-2">Leadership Legacy</h3>
                  <p class="text-body-2">
                    During {{ activeDirector.name }}'s leadership, NOMCAARRD continued its mission to advance
                    agricultural research and development in Northern Mindanao.
                  </p>
                </VCol>
              </VRow>
            </div>
            <VDivider/>
            <VRow class="ma-0 pa-4" justify="end">
              <VBtnPrimaryAlt
                  @click="showModal = false"
                  class="button-outline"
              >
                Close
              </VBtnPrimaryAlt>
            </VRow>
          </VSheet>
        </VDialog>

        <VDivider/>
        <Footer/>
      </Navbar>
    </div>
  </VLayout>
</template>

<style scoped>
:root {
  --v-primary-base: #3f51b5;
}
/* Timeline styling */
.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-wrapper {
  position: relative;
  margin: 40px 0;
  min-height: 600px;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, transparent, var(--v-primary-base), transparent);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  width: 45%;
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease;
}

.timeline-item.right-aligned {
  margin-left: auto;
  transform: translateX(50px);
}

.timeline-item.animate-timeline-item {
  opacity: 1;
  transform: translateX(0);
}

.timeline-node {
  position: absolute;
  top: 20px;
  left: calc(100% + 32px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-item.right-aligned .timeline-node {
  left: auto;
  right: calc(100% + 32px);
}

.timeline-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--v-primary-base);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px rgba(var(--v-primary-base), 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.timeline-dot:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 6px rgba(var(--v-primary-base), 0.4), 0 0 20px rgba(var(--v-primary-base), 0.6);
}

.timeline-year {
  margin-top: 8px;
  font-weight: bold;
  color: var(--v-primary-base);
}

.timeline-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.timeline-card-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.timeline-card-content {
  flex-grow: 1;
}

.director-image {
  border-radius: 0;
  transition: all 0.3s ease;
}

.timeline-card:hover .director-image {
  transform: scale(1.05);
}

.period-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: rgba(var(--v-primary-base), 0.15);
  /* color: var(--v-primary-darken1); */
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Decade stats cards */
.decade-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.decade-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.decade-stat {
  font-size: 3rem;
  font-weight: bold;
  color: var(--v-primary-base);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  margin-bottom: 8px;
}

/* Modal styling */
.director-modal-image {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Expanded timeline item */
.timeline-item.expanded .timeline-card {
  border-left: 4px solid var(--v-primary-base);
}

.timeline-item.right-aligned.expanded .timeline-card {
  border-left: none;
  border-right: 4px solid var(--v-primary-base);
}

/* Field styling from original template */
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

/* Animation for the timeline line */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-primary-base), 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-primary-base), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-primary-base), 0);
  }
}

.timeline-dot {
  animation: pulse 2s infinite;
}

.dialog-title{
  font-size: 20px;
  font-weight: 700;
}

.dialog-container{
  border-radius: 15px !important;
}

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 10px;
}

</style>
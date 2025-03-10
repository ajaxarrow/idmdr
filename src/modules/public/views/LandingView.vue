<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import {defineComponent, onMounted, ref, shallowRef} from "vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import { Vue3Lottie } from "vue3-lottie";
import Container from "../../../core/components/Container.vue";
import {
  PhCloud,
  PhOption,
  PhTag,
  PhUsersThree,
  PhTree,
  PhFish,
  PhHorse,
  PhPlant, PhPaperPlane, PhArrowRight
} from "@phosphor-icons/vue";
import BambooImage from '../../../assets/priority-commodities/bamboo.jpg';
import SiganidImage from '../../../assets/priority-commodities/siganid.jpg';
import LivestockImage from '../../../assets/priority-commodities/livestock.jpeg';
import SoybeansImage from '../../../assets/priority-commodities/soy.jpg';
import CMIMap from '../../../assets/landing-page/cmi.jpg';
import LINNKSDemo from '../../../assets/landing-page/hero-main-image.svg';
import Footer from "../components/Footer.vue";


type CustomComponent = ReturnType<typeof defineComponent>;

interface BannerProgram {
  title: string,
  description: string,
  icon: CustomComponent,
  color: string,
  items: string[]
}

interface Commodity {
  name: string,
  description: string,
  icon: CustomComponent,
  color: string,
  image: string
}

const {isMobile, isLargePhone, isSmall} = useScreenStore()
const loading = ref(true)

const highlights = [
  {
    adjective: 'Regional Research Coordination',
    description: "NOMCAARRD coordinates research, development, and extension priorities in agriculture, fisheries, and natural resources across Northern Mindanao's 20 member institutions."
  },
  {
    adjective: 'Strategic Development',
    description: 'We identify regional R&D priorities, plan integrated programs, and develop research management systems aligned with regional development efforts to maximize utilization of research results.'
  },
  {
    adjective: 'Collaborative Innovation',
    description: 'Through strong institutional partnerships, we drive innovation that addresses poverty alleviation, food security, global competitiveness, and sustainable natural resource management.'
  }
]

const selectedProgram = shallowRef<BannerProgram>({
  title: 'Strategic R&D',
  description: 'Our pioneering banner program that sets the standard for the consortium\'s S&T operations throughout the region.',
  icon: PhCloud,
  color: '#32c3c8',
  items: [
    'Poverty alleviation and food security',
    'Global competitiveness',
    'Frontier and cutting-edge science',
    'Natural resource management & sustainable development',
    'Support to allied agricultural forestry services'
  ]
})

const bannerPrograms: BannerProgram[] = [
  {
    title: 'Strategic R&D',
    description: 'Our pioneering banner program that sets the standard for the consortium\'s S&T operations throughout the region.',
    icon: PhCloud,
    color: '#32c3c8',
    items: [
      'Poverty alleviation and food security',
      'Global competitiveness',
      'Frontier and cutting-edge science',
      'Natural resource management & sustainable development',
      'Support to allied agricultural forestry services'
    ]
  },
  {
    title: 'Research Dissemination',
    description: 'Ensuring R&D efforts produce impactful products and services to boost productivity in agri-aqua and natural resources sectors.',
    icon: PhUsersThree,
    color: '#37c832',
    items: [
      'Information, Education, and Communication (IEC)',
      'Information and Communication Technology (ICT)'
    ]
  },
  {
    title: 'Capability Building',
    description: 'Enhancing R&D capability and governance within Consortium-member Institutions to maximize results from limited funding.',
    icon: PhOption,
    color: '#c87d32',
    items: [
      'Enhancement of researcher\'s skills',
      'Enhancement of program planning, monitoring, and evaluation systems',
      'Expansion of R&D management and linkages'
    ]
  },
  {
    title: 'Policy Advocacy',
    description: 'Monitoring the policy environment to support S&T investment and development in the AANR sectors.',
    icon: PhTag,
    color: '#9132c8',
    items: [
      'Communication Research',
      'Sector/Issue-based policy advocacy',
      'Strategic assessment of policies'
    ]
  }
]

const priorityCommodities: Commodity[] = [
  {
    name: 'Bamboo',
    description: 'Sustainable forestry product with diverse applications in construction, furniture, and more.',
    icon: PhTree,
    color: '#37c832',
    image: BambooImage
  },
  {
    name: 'Siganid (Rabbitfish)',
    description: 'Important aquatic resource for food security and livelihood in coastal communities.',
    icon: PhFish,
    color: '#32c3c8',
    image: SiganidImage
  },
  {
    name: 'Livestock',
    description: 'Supporting regional animal husbandry for economic development and protein security.',
    icon: PhHorse,
    color: '#c87d32',
    image: LivestockImage
  },
  {
    name: 'Soybeans',
    description: 'Versatile crop with high nutritional value and multiple industrial applications.',
    icon: PhPlant,
    color: '#c3c832',
    image: SoybeansImage
  }
]

const lightenColor = (hex: any, percent: any) => {
  // Remove the # if present
  hex = hex.replace('#', '');

  // Parse the hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the lighter values
  const lighterR = Math.min(255, r + Math.floor(percent * 2.55));
  const lighterG = Math.min(255, g + Math.floor(percent * 2.55));
  const lighterB = Math.min(255, b + Math.floor(percent * 2.55));

  // Convert back to hex
  const toHex = (c: any) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  // Return the new hex color
  return `#${toHex(lighterR)}${toHex(lighterG)}${toHex(lighterB)}`;
};


const selectProgram = (program: BannerProgram) => {
  selectedProgram.value = program;
}

const startPage = () => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);
}

onMounted(() => {
  startPage()
})
</script>

<template>

  <VLayout>
    <Container class="center" v-show="loading">
      <Vue3Lottie
          animationLink="https://assets6.lottiefiles.com/packages/lf20_x62chJ.json"
          :height="isMobile || isLargePhone ? '300' : '500'"
          :width="isMobile || isLargePhone ? '300' : '500'" />
    </Container>
    <transition name="fade" v-show="!loading">
      <div style="width: 100%" >
        <Navbar>
          <div class="hero-wrapper">
            <div class="hero-overlay"></div>
            <VContainer class="hero-container">
              <VRow class="hero-section" align="center" justify="center">
                <VCol cols="12" md="7" class="hero-content-col">
                  <div class="hero-content">
                    <h1 class="text-h2 font-weight-bold hero-title">Northern Mindanao Consortium for Agriculture, Aquatic and Natural Resources R&D</h1>
                    <div class="hero-divider"></div>
                    <p class="text-subtitle-1 hero-subtitle">Advancing research, development, and innovation for Northern Mindanao's sustainable future</p>
                    <div class="hero-buttons mt-8">
                      <VBtn
                          color="primary"
                          variant="elevated"
                          size="large"
                          class="hero-btn learn-more-btn me-4"
                          to="/about"
                      >
                        Learn More
                      </VBtn>
                      <VBtn
                          variant="outlined"
                          size="large"
                          class="hero-btn contact-btn"
                          to="/contact"
                      >
                        Contact Us
                      </VBtn>
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" md="5" class="hero-image-col d-none d-md-flex">
                  <div class="hero-accent-card">
                    <div class="accent-card-content">
                      <h3 class="text-h5 mb-4">Empowering Region 10</h3>
                      <p class="mb-2">• 20 Member Institutions</p>
                      <p class="mb-2">• Regional Research Excellence</p>
                      <p class="mb-2">• Sustainable Development</p>
                      <p>• Innovation for Agriculture</p>
                    </div>
                  </div>
                </VCol>
              </VRow>
            </VContainer>
          </div>
          <div id="about" class="bg-sb10 py-10">
            <VContainer>
              <p class="blockquote-question text-center pt-5">
                What is NOMCAARRD?
              </p>
              <VRow class="ma-0 py-5 px-5 px-sm-10 px-md-10 px-xl-15 px-xxl-15 px-lg-15">
                <VCol cols="12">
                  <p class="text-body-1 text-center">
                    The Northern Mindanao Consortium for Agriculture, Aquatic and Natural Resources Research and Development (NOMCAARRD) is an organization composed of 20 government and non-government organizations in Region 10. The consortium coordinates the regional research, development, and extension priorities in the region along with agriculture, fisheries, and natural resources sector. The consortium office is located at its base agency, Central Mindanao University.
                  </p>
                </VCol>
              </VRow>

              <VRow justify="center" class="ma-0 py-5 px-5 px-sm-10 px-md-10 px-xl-15 px-xxl-15 px-lg-15">
                <VCol v-for="text in highlights" cols="12" lg="4" xl="4" xxl="4">
                  <div>
                    <p class="text-highlight-title">{{text.adjective}}</p>
                    <p>{{text.description}}</p>
                  </div>
                </VCol>
              </VRow>
            </VContainer>
          </div>
          <div class="banner-programs py-10 animated-background">
            <VContainer>
              <p class="blockquote-question text-center pt-5 animated-title">
                Banner Programs
              </p>
              <p class="text-center mb-8 subtitle-animation">
                These priority programs drive NOMCAARRD's S&T operations throughout the region
              </p>

              <VRow justify="center" class="ma-0 mt-5" align="center" v-if="isSmall">
                <component :is="selectedProgram.icon" size="26" :color="selectedProgram.color" class="pulse-icon" />
                <p :style="{color: selectedProgram.color}" class="ml-1 font-weight-bold text-h6 bounce-text">
                  {{selectedProgram.title}}
                </p>
              </VRow>

              <VRow justify="center" class="ma-0 my-6 programs-container" v-else>
                <VRow class="ma-0 mx-15 px-15 float-in" justify="space-around">
                  <div v-for="(program) in bannerPrograms"
                       class="d-flex flex-column align-center cursor-pointer program-item"
                       @click="selectProgram(program)"
                       :class="program.title == selectedProgram.title ? 'active-program' : ''"
                  >
                    <component
                        weight="bold"
                        :is="program.icon"
                        size="30"
                        :color="program.title == selectedProgram.title ? program.color : '#8C8C8C'"
                        class="icon-hover"
                    />
                    <p :style="{color: program.title == selectedProgram.title ? program.color : '#8C8C8C'}"
                       class="font-weight-bold text-h6 program-title">
                      {{program.title}}
                    </p>
                  </div>
                </VRow>
              </VRow>

              <VCard class="mx-auto my-8 program-card pa-4 card-animation" max-width="900" elevation="8">
                <VCardTitle class="text-h5" :style="{color: selectedProgram.color}">
                  {{selectedProgram.title}}
                </VCardTitle>
                <VCardText>
                  <p class="text-body-1 fade-in">{{selectedProgram.description}}</p>
<!--                  <VDivider class="my-4 growing-divider" :style="{backgroundColor: selectedProgram.color}"></VDivider>-->
                  <VList>
                    <VListItem density="compact" v-for="(item, i) in selectedProgram.items" :key="i" class="list-item-animation"
                               :style="{'animation-delay': i * 0.25 + 's'}">
                      <template v-slot:prepend>
                        <VIcon :color="selectedProgram.color" icon="mdi-circle-small" class="blinking-icon"></VIcon>
                      </template>
                      <VListItemTitle class="slide-in-text">{{ item }}</VListItemTitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VContainer>
          </div>

          <div class="commodities-section bg-sb10 py-10">
            <VContainer>
              <blockquote class="blockquote-question text-center pt-5">
                Priority Commodities
              </blockquote>
              <p class="text-center mb-8">NOMCAARRD focuses on these key agricultural, aquatic, and natural resources</p>

              <VRow>
                <VCol v-for="commodity in priorityCommodities" :key="commodity.name" cols="12" sm="6" md="3">
                  <VCard class="mx-auto h-100 commodity-card" :class="`border-${commodity.color}`">
                    <VImg
                        :src="commodity.image"
                        height="200"
                        cover
                    ></VImg>
                    <VCardTitle class="d-flex align-center">
                      <component :is="commodity.icon" :color="commodity.color" size="24" class="me-2" />
                      {{commodity.name}}
                    </VCardTitle>
                    <VCardText>
                      {{commodity.description}}
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VContainer>
          </div>

          <div class="cmi-section py-8">
            <VContainer>
              <blockquote class="blockquote-question text-center pt-5 text-h4 font-weight-bold primary--text">
                Consortium-Member Institutions
              </blockquote>
              <p class="text-center mb-8 text-subtitle-1">NOMCAARRD brings together 20 leading institutions across Northern Mindanao</p>

              <VRow class="elevation-3 rounded-lg overflow-hidden">
                <VCol cols="12" md="6" class="pa-0 position-relative">
                  <div class="overlay-gradient position-absolute" style="top:0; right:0; bottom:0; left:0; background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%);"></div>
                  <VImg :src="CMIMap" alt="CMI Map" class="cmi-map" height="100%" style="min-height:500px" cover />
                </VCol>
                <VCol cols="12" md="6" class="py-6 px-8 bg-surface">
                  <div class="cmi-content">
                    <h3 class="text-h5 font-weight-bold primary--text mb-4 d-flex align-center">
                      <VIcon icon="mdi-information-outline" color="bs50" class="mr-2"></VIcon>
                      What is a CMI?
                    </h3>
                    <p class="text-body-1">The Consortium Member-Institutions (CMIs) represent a collective of esteemed agencies and academic institutions dedicated to advancing research and development in the fields of agriculture, aquatic sciences, and natural resources within Northern Mindanao.</p>

                    <VDivider class="my-5"></VDivider>

                    <h4 class="text-h6 font-weight-bold primary--text d-flex align-center mb-3">
                      <VIcon icon="mdi-flask-outline" color="bs50" size="small" class="mr-2"></VIcon>
                      Research Delivering Institutions
                    </h4>
                    <p class="text-body-2 ml-8">Central to the consortium's mission, these institutions drive innovation through focused research in agriculture, aquatic sciences, and natural resources, developing sustainable technologies that address regional challenges.</p>

                    <h4 class="text-h6 font-weight-bold primary--text d-flex align-center mt-5 mb-3">
                      <VIcon icon="mdi-handshake-outline" color="bs50" size="small" class="mr-2"></VIcon>
                      Non-Research Delivering Institutions
                    </h4>
                    <p class="text-body-2 ml-8">These supporting institutions help apply and disseminate research, focusing on policy-making, education, and community engagement to ensure effective implementation of research outcomes.</p>
                    <VBtn
                        color="bs50"
                        variant="elevated"
                        height="47px"
                        class="text-none hvr-icon-spin explore-button browse-map-button mx-1 mt-5"
                        to="/cmis">
                      <PhArrowRight size="20" class="mr-2 hvr-icon"/> <span class="animate-underline"><span class="text-white">View All 20 Member Institutions</span></span>
                    </VBtn>
                  </div>

                </VCol>
              </VRow>
            </VContainer>
          </div>

          <div class="services-section bg-sb10">
            <VContainer>
              <blockquote class="blockquote-question text-center pt-5">
                Our Services
              </blockquote>

              <VRow justify="center" class="ma-0 py-5">
                <VCol cols="12" md="10" lg="8">
                  <VCard class="service-card">
                    <VCardTitle class="text-h5 text-bs50">
                      Graduate Assistantships & Non-degree Trainings
                    </VCardTitle>
                    <VCardText>
                      <p class="mb-4">All applications must be properly endorsed by the NOMCAARRD Director. NOMCAARRD will facilitate sending your documents to DOST-PCAARRD.</p>
                      <p class="mb-4">Please submit an advance copy of the application documents to <a href="mailto:nomcarrdcmu@gmail.com" class="text-decoration-none text-bs50">nomcarrdcmu@gmail.com</a>.</p>
                      <p class="mb-4">Address your request letter for endorsement to:</p>
                      <p class="font-weight-bold">
                        DR. MARIA ESTELA B. DETALLA<br>
                        Consortium Director, NOMCAARRD<br>
                        Maramag, Bukidnon 8710
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VContainer>
          </div>

          <div class="linnks-section py-10">
            <VContainer>
              <VRow align="center">
                <VCol cols="12" md="6" order="2" order-md="1">
                  <h2 class="text-h4 mb-4 font-weight-bold">Introducing LINNKS</h2>
                  <p class="text-body-1 mb-4">
                    NOMCAARRD's Knowledge Based System (LINNKS) provides a centralized repository for all research data and projects across our member institutions.
                  </p>
                  <VRow>
                    <VCol cols="12" md="6">
                      <div class="d-flex align-center mb-4">
                        <VIcon color="primary" icon="mdi-database" class="me-2"></VIcon>
                        <span>Efficient Data Storage</span>
                      </div>
                    </VCol>
                    <VCol cols="12" md="6">
                      <div class="d-flex align-center mb-4">
                        <VIcon color="primary" icon="mdi-shield-lock" class="me-2"></VIcon>
                        <span>Secure Data Access</span>
                      </div>
                    </VCol>
                    <VCol cols="12" md="6">
                      <div class="d-flex align-center mb-4">
                        <VIcon color="primary" icon="mdi-chart-bar" class="me-2"></VIcon>
                        <span>Advanced Visualization</span>
                      </div>
                    </VCol>
                    <VCol cols="12" md="6">
                      <div class="d-flex align-center mb-4">
                        <VIcon color="primary" icon="mdi-map" class="me-2"></VIcon>
                        <span>Interactive Mapping</span>
                      </div>
                    </VCol>
                  </VRow>
                  <VBtn
                      color="bs50"
                      variant="elevated"
                      height="40px"
                      class="text-none hvr-icon-spin explore-button browse-map-button mx-1 mt-5"
                      to="/linnks">
                    <PhPaperPlane size="20" class="mr-2 hvr-icon"/> <span class="animate-underline"><span class="text-white">Visit LINNKS</span></span>
                  </VBtn>
                </VCol>
                <VCol cols="12" md="6" order="1" order-md="2" class="text-center">
                  <VImg
                      :src="LINNKSDemo"
                      alt="LINNKS System Demo"
                      contain
                  />
                </VCol>
              </VRow>
            </VContainer>
          </div>

          <VDivider/>
          <Footer/>
        </Navbar>
      </div>
    </transition>
  </VLayout>
</template>

<style lang="scss" scoped>
.blockquote-question{
  font-family: 'Satoshi', sans-serif !important;
  font-weight: 700;
  font-size: 46px;
  color: #062b3e;
  margin-bottom: 1rem;
}

.text-highlight-title{
  font-family: 'Gambetta', serif !important;
  font-size: 24px;
  font-weight: 600;
  font-style: italic;
  color: #062b3e;
}

.primary-text {
  color: #062b3e;
}

// Animation styles
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

// Hero section
.hero-section {
  padding: 4rem 0;

  .hero-image {
    max-height: 400px;
  }
}

// Program section
.programs-container {
  margin-bottom: 2rem;
}

.program-item {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.program-card {
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
}

// Commodity section
.commodity-card {
  transition: transform 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }

  &.border-\#32c3c8 {
    border-top: 4px solid #32c3c8;
  }

  &.border-\#37c832 {
    border-top: 4px solid #37c832;
  }

  &.border-\#c87d32 {
    border-top: 4px solid #c87d32;
  }

  &.border-\#c3c832 {
    border-top: 4px solid #c3c832;
  }
}



.cmi-list {
  height: 100%;
  overflow-y: auto;
  border-radius: 8px;
  background-color: #f5f5f5;
}

// Services section
.service-card {
  border-left: 4px solid #062b3e;
}


// Button styles
.explore-button {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
}

.animate-underline {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -3px;
    left: 0;
    background-color: white;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .blockquote-question{
    font-size: 32px;
  }

  .hero-section {
    padding: 2rem 0;
  }
}

@media (max-width: 476px) {
  .blockquote-question{
    font-size: 28px;
  }
}

.hero-wrapper {
  position: relative;
  background-image: url('https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2024/06/422181390_800173765472764_7068736240696033140_n-1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(6, 43, 62, 0.85) 0%, rgba(6, 43, 62, 0.7) 100%);
  z-index: 1;
}

.hero-container {
  position: relative;
  z-index: 2;
  padding: 4rem 0;
  width: 100%;
}

.hero-section {
  position: relative;
}

.hero-content-col {
  padding: 2rem;
}

.hero-content {
  max-width: 700px;
  animation: fadeInUp 1s ease;
}

.hero-title {
  color: white;
  font-size: 2.75rem;
  line-height: 1.2;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #32c3c8, #37c832);
  margin-bottom: 1.5rem;
  border-radius: 2px;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  animation: fadeIn 1.5s ease;
}

.hero-btn {
  border-radius: 4px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  padding: 0 2rem;
  height: 52px !important;
}

.learn-more-btn {
  background: linear-gradient(90deg, #32c3c8, #37c832) !important;
  box-shadow: 0 4px 10px rgba(50, 195, 200, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(50, 195, 200, 0.5);
  }
}

.contact-btn {
  border: 2px solid rgba(255, 255, 255, 0.8) !important;
  color: white !important;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    transform: translateY(-3px);
  }
}

.hero-image-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.hero-accent-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  position: relative;
  animation: slideInRight 1s ease;
  transform: rotate(2deg);

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid #32c3c8;
    border-radius: 8px;
    z-index: -1;
  }
}

.accent-card-content {
  color: #062b3e;

  h3 {
    font-weight: 700;
    color: #32c3c8;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px) rotate(2deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(2deg);
  }
}

// Responsive adjustments
@media (max-width: 960px) {
  .hero-wrapper {
    min-height: 80vh;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .hero-wrapper {
    min-height: 70vh;
  }

  .hero-content {
    text-align: center;
    margin: 0 auto;
  }

  .hero-divider {
    margin: 0 auto 1.5rem auto;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .hero-wrapper {
    min-height: 60vh;
  }

  .hero-content-col {
    padding: 1rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-btn {
    padding: 0 1.5rem;
    height: 48px !important;
    margin-bottom: 1rem;
  }
}

.banner-programs {
  background: linear-gradient(to bottom right, #f9f9f9, #f6f2f2);
  position: relative;
}

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.decorative-line {
  height: 3px;
  width: 80px;
  background: linear-gradient(90deg, transparent, #666, transparent);
}

.max-width-500 {
  max-width: 500px;
}

.program-item {
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.program-item:hover .program-icon-wrapper {
  transform: translateY(-5px);
}

.program-icon-wrapper {
  width: 70px;
  height: 70px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

.selection-indicator {
  height: 3px;
  transition: all 0.3s ease;
}

.active-program {
  transform: translateY(-5px);
}

.program-card {
  transition: all 0.3s ease;
  border: none;
}

.program-card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.accent-line {
  height: 3px;
  width: 60px;
  border-radius: 3px;
}

.list-marker {
  width: 28px;
  height: 28px;
  min-width: 28px;
}

.program-list-item {
  transition: transform 0.2s ease;
}

.program-list-item:hover {
  transform: translateX(5px);
}

.mobile-program-selector {
  max-width: 300px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .program-card {
    margin-left: 15px;
    margin-right: 15px;
  }
}

/* Animated Background */
.animated-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #e9eef2 100%);
  position: relative;
  overflow: hidden;
}

.animated-background::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  z-index: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  animation: rotate 25s linear infinite;
}

.animated-title {
  font-size: 2.5rem;
  font-weight: 700;
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: gradient-text 6s ease infinite;
  position: relative;
  z-index: 1;
}

.subtitle-animation {
  position: relative;
  z-index: 1;
  animation: fadeIn 1.5s ease-in-out;
  color: #555;
  font-size: 1.1rem;
}

/* Program Icons and Titles */
.program-item {
  transition: all 0.3s ease;
  position: relative;
  padding: 15px;
  border-radius: 12px;
  z-index: 1;
}

.program-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(240, 240, 240, 0.6);
  border-radius: 12px;
  z-index: -1;
  transform: scale(0.9);
  opacity: 0;
  transition: all 0.3s ease;
}

.program-item:hover::before {
  transform: scale(1);
  opacity: 1;
}

.active-program::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 3px;
  background: v-bind('`${lightenColor(selectedProgram.color, 30)}`');;
  border-radius: 2px;
  animation: expandWidth 0.5s ease;
}

.icon-hover {
  transition: all 0.3s ease;
  transform-origin: center;
}

.program-item:hover .icon-hover {
  transform: scale(1.2) translateY(-5px);
}

.program-title {
  transition: all 0.3s ease;
  margin-top: 8px;
}

.program-item:hover .program-title {
  transform: translateY(-3px);
}

.float-in {
  animation: floatIn 0.8s ease-out;
}

/* Card Animations */
.card-animation {
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: v-bind('`linear-gradient(90deg, ${selectedProgram.color}, ${lightenColor(selectedProgram.color, 30)}`');
  transition: all 0.5s ease;
}

.card-animation:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-title-animation {
  position: relative;
  padding-bottom: 10px;
  animation: slideInRight 0.7s ease;
}

.card-title-animation::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: currentColor;
  animation: expandWidth 1.5s ease-in-out infinite alternate;
}

.fade-in {
  animation: fadeIn 1s ease;
}

.growing-divider {
  height: 2px;
  animation: expandWidth 1s ease;
}

.list-item-animation {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  transition: background-color 0.3s ease;
}

.list-item-animation:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.blinking-icon {
  animation: pulse 2s infinite;
}

.slide-in-text {
  animation: slideInLeft 0.5s ease;
}

/* Mobile Specific Animations */
.pulse-icon {
  animation: pulse 2s infinite;
}

.bounce-text {
  animation: bounce 1s ease infinite alternate;
}

/* Animation Keyframes */
@keyframes gradient-text {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes expandWidth {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
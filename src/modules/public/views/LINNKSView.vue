<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Hero from "../components/Landing/Hero.vue";
import FeatureAccess from '../../../assets/landing-page/feature-access.png';
import FeatureMap from '../../../assets/landing-page/feature-map.png';
import FeatureOrganization from '../../../assets/landing-page/feature-organization.png';
import FeatureRepository from '../../../assets/landing-page/feature-repository.png';
import FeatureTagging from '../../../assets/landing-page/feature-tagging.png';
import HighFive from '../../../assets/landing-page/high-five.svg';
import Placeholder from '../../../assets/landing-page/placeholder.png';
import {defineComponent, onMounted, ref, shallowRef} from "vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import {PhCloud, PhLightbulb, PhMapPinLine, PhOption, PhTag, PhUsersThree} from "@phosphor-icons/vue";
import LINNKSFooter from "../components/LINNKSFooter.vue";

type CustomComponent = ReturnType<typeof defineComponent>;

interface Feature {
  title: string,
  description: string,
  icon: CustomComponent,
  color: string,
  image: CustomComponent
}

const {isSmall} = useScreenStore()
const loading = ref(true)

const highlights = [
  {
    adjective: 'Efficient Data Storage',
    description: 'Digitize and centralize NOMCAARRD\'s gathered information with a user-friendly repository system for streamlined data management and collaboration, ensuring all data is organized and easily retrievable.'
  },
  {
    adjective: 'Secure Data Access',
    description: 'Ensure data accessibility and transparency while protecting against unauthorized access through robust user access controls and secure data handling, providing peace of mind for all stakeholders.'
  },
  {
    adjective: 'Advanced Visualization',
    description: 'Precisely tag projects and commodities to their corresponding source areas, and utilize sophisticated mapping and historical analysis tools for comprehensive visualization and effective monitoring.'
  }
]

const selectedFeature = shallowRef<Feature>(  {
  title: 'Repository',
  description: 'Store project files and collaborate',
  icon: PhCloud,
  color: '#32c3c8',
  image: FeatureRepository
})

const features: Feature[] = [
  {
    title: 'Repository',
    description: 'Store project files and collaborate',
    icon: PhCloud,
    color: '#32c3c8',
    image: FeatureRepository
  },
  {
    title: 'Organization',
    description: 'Browse projects of other organizations within the system',
    icon: PhUsersThree,
    color: '#37c832',
    image: FeatureOrganization
  },
  {
    title: 'Map',
    description: 'Visualize data from repository through map',
    icon: PhMapPinLine,
    color: '#c3c832',
    image: FeatureMap
  },
  {
    title: 'Tagging',
    description: 'Tag a specific area to a repository',
    icon: PhTag,
    color: '#9132c8',
    image: FeatureTagging
  },
  {
    title: 'Access',
    description: 'Manage access controls within organizationa and repository',
    icon: PhOption,
    color: '#c87d32',
    image: FeatureAccess
  },
]

const selectFeature = (feature: Feature) => {
  selectedFeature.value = feature;
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
      <div style="width: 100%" >
        <Navbar>
          <div class="landing-container">
            <VContainer>
              <Hero/>
            </VContainer>
          </div>
          <div class="bg-sb10">
            <VContainer>
              <blockquote class="blockquote-question text-center pt-5">
                Why KMHUB?
              </blockquote>
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
          <div class="">
            <VContainer>
              <VRow class="ma-0 mt-5"  justify="center" align="center" v-if="isSmall">
                <component
                    :is="selectedFeature.icon"
                    size="26"
                    :color="selectedFeature.color"
                />
                <p  :style="{color: selectedFeature.color}" class="ml-1 font-weight-bold text-h6">{{selectedFeature.title}}</p>
              </VRow>
              <VRow
                  justify="center" class="ma-0 my-6 features-container" v-else>
                <VRow class="ma-0 mx-15 px-15" justify="space-around">
                  <div
                      v-for="(feature) in features"
                      class="d-flex flex-column align-center cursor-pointer"
                      @click="selectFeature(feature)"
                  >
                    <component
                        weight="bold"
                        :is="feature.icon"
                        size="30"
                        :color="feature.title == selectedFeature.title ? feature.color : '#8C8C8C'"
                    />
                    <p :style="{color: feature.title == selectedFeature.title ? feature.color : '#8C8C8C'}" class=" font-weight-bold text-h6">{{feature.title}}</p>
                  </div>
                </VRow>
              </VRow>
              <p
                  :style="{fontSize: isSmall ? '16px' : '18px'}"
                  class="mx-4 text-center text-gs10 font-weight-medium mt-2">{{selectedFeature.description}}</p>
              <VRow class="ma-0 my-10" justify="center">
                <VCarousel
                    v-model="selectedFeature"
                    class="rounded-lg carousel"
                    show-arrows="hover"
                >
                  <VCarouselItem
                      class="bg-sb20 w-100"
                      v-for="(feature, i) in features"
                      :key="i"
                      :value="feature"
                  >
                    <VImg
                        height="100%"
                        :lazy-src="Placeholder"
                        :src="feature.image"
                        alt="Hero Image"
                    />
                  </VCarouselItem>
                </VCarousel>
              </VRow>
            </VContainer>
            <div class="mt-10">
              <p class="text-h5 text-sm-h4 text-md-h3 text-lg-h4 text-xl-h3 text-xxl-h3 font-weight-bold text-center my-2 mx-5">Get Started Now!</p>
              <p class="text-center font-weight-medium text-gs30 my-5 mx-5 ">Explore KMHUB now as a guest by browsing the interactive map and discover new features today</p>
              <VRow class="ma-0 mb-15" justify="center">
                <VBtn
                    color="bs50"
                    variant="elevated"
                    height="47px"
                    class="text-none hvr-icon-spin explore-button browse-map-button mx-1"
                    to="/about-linnks">
                  <PhLightbulb size="20" class="mr-2 hvr-icon"/> <span class="animate-underline"><span class="text-white">Learn More About KMHUB</span></span>
                </VBtn>
              </VRow>
              <VImg
                  class="mx-5"
                  :height="isSmall ? '200px' : '400px'"
                  :src="HighFive"
                  alt="Hero Image"
              />
            </div>
          </div>
          <VDivider/>
          <LINNKSFooter/>
        </Navbar>
      </div>
  </VLayout>
</template>

<style scoped>

.blockquote-question:before{
  content: open-quote;
}

.blockquote-question:after{
  content: close-quote;
}

.blockquote-question{
  font-family: 'Satoshi', sans-serif !important;
  font-weight: 700;
  font-size: 46px;
}

@media (max-width: 768px) {
  .blockquote-question{
    font-size: 32px;
  }
}

@media (max-width: 476px) {
  .blockquote-question{
    font-size: 28px;
  }
}

.text-highlight-title{
  font-family: 'Gambetta', serif !important;
  font-size: 24px;
  font-weight: 600;
  font-style: italic;
  color: #062b3e;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.vcontainer {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

.carousel{
  width: 70% !important;
  height: 70% !important;
}


:deep(.v-window__container){
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .carousel{
    width: 85% !important;
    height: 85% !important;
  }
}




</style>

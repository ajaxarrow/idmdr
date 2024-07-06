<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Hero from "../components/Landing/Hero.vue";
import FeatureAccess from '../../../assets/landing-page/feature-access.png';
import FeatureMap from '../../../assets/landing-page/feature-map.png';
import FeatureOrganization from '../../../assets/landing-page/feature-organization.png';
import FeatureRepository from '../../../assets/landing-page/feature-repository.png';
import FeatureTagging from '../../../assets/landing-page/feature-tagging.png';
import {onMounted, ref, watch} from "vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import { Vue3Lottie } from "vue3-lottie";
import Container from "../../../core/components/Container.vue";
import {PhCloud, PhMapPinLine, PhOption, PhTag, PhUsersThree} from "@phosphor-icons/vue";
const {isMobile, isLargePhone} = useScreenStore()
const loading = ref(true)

const highlights = [
  {
    adjective: 'Approachable',
    description: 'Builds on top of standard HTML, CSS and JavaScript with intuitive API and world-class documentation.'
  },
  {
    adjective: 'Performant',
    description: 'Truly reactive, compiler-optimized rendering system that rarely requires manual optimization.'
  },
  {
    adjective: 'Versatile',
    description: 'A rich, incrementally adoptable ecosystem that scales between a library and a full-featured framework.'
  }
]

const selectedFeature = ref<Object>(  {
  title: 'Repository',
  description: 'Store project files and collaborate',
  icon: PhCloud,
  color: '#32c3c8',
  image: FeatureRepository
})

const features = [
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

const selectFeature = (feature: Object) => {
  selectedFeature.value = feature;
}

watch(() => selectedFeature.value, () => {
  console.log(selectedFeature.value)
})

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
      <Navbar>
        <div class="landing-container">
          <VContainer>
            <Hero/>
          </VContainer>
        </div>
        <div class="bg-white">
          <VContainer>
            <blockquote class="blockquote-question text-center pt-5">
              Why IDMDR?
            </blockquote>
            <VRow justify="center" class="ma-0 py-5 px-5 px-xl-15 px-xxl-15 px-lg-15">
              <VCol v-for="text in highlights" cols="12" lg="4" xl="4" xxl="4">
                <div>
                  <p class="text-highlight-title">{{text.adjective}}</p>
                  <p>{{text.description}}</p>
                </div>
              </VCol>
            </VRow>
            <VRow class="ma-0 mx-15" justify="space-around">
              <div
                  v-for="(feature, i) in features"
                  class="d-flex flex-column align-center"
              >
                <component
                    :is="feature.icon"
                    size="40"
                    :color="feature.title == selectedFeature.title ? feature.color : '#8C8C8C'"
                />
                <p class="text-gs40 font-weight-bold text-h6">{{feature.title}}</p>
              </div>
            </VRow>
            <VRow class="ma-0" justify="center">
              <VCarousel
                  v-model="selectedFeature"
                  class="rounded-lg mx-15"
                  show-arrows="hover"
              >
                <VCarouselItem
                    class="bg-white w-100"
                    v-for="(feature, i) in features"
                    :key="i"
                    :value="feature"
                >
                  <VSheet :color="feature.color" height="100%">
                    <VImg
                        :src="feature.image"
                        alt="Hero Image"
                    />
                  </VSheet>
                </VCarouselItem>
              </VCarousel>
            </VRow>
          </VContainer>
        </div>
      </Navbar>
    </transition>

  </VLayout>>
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

</style>

<script setup lang="ts">
import {PhMapTrifold} from "@phosphor-icons/vue";
import {useScreenStore} from "../../../../core/stores/screen-size.store.ts";
import HeroMainImage from "../../../../assets/landing-page/hero-main-image.svg"
import Placeholder from "../../../../assets/landing-page/placeholder.png"
const {isMobile, isSmall} = useScreenStore();
</script>

<template>
  <VRow class="ma-0 text-highlight-container" justify="center">
  <span class="text-highlight">Repository</span> +
  <span class="text-highlight">Research and Development</span> +
  <span class="text-highlight">Mapping</span> +
  <span class="text-highlight">Data</span>
  </VRow>
  <p class="text-heading text-center gradient-text">
    Interact, Map, Visualize, <br/> <em class="heading-font">Collaborate</em>
  </p>
  <p class="text-center text-subtitle px-sm-10 px-xs-5">
    Experience enhanced data interaction and collaboration by unlocking the potential <br v-if=" !isSmall && !isMobile "/> of your data through <span class="fancy-text">IDMDR's interactive mapping and repository solutions.</span></p>
  <VRow class="mt-4" justify="center">
    <div style="position: relative;">
      <VBtn
          variant="elevated"
          color="bs50"
          height="45px"
          class="text-none hvr-icon-spin explore-button mx-1"
          :to="{name: 'map'}">
        Get Started
      </VBtn>
      <VBtn
        variant="elevated"
        height="47px"
        class="text-none hvr-icon-spin explore-button browse-map-button mx-1"
        :to="{name: 'map'}">
        <PhMapTrifold size="20" class="mr-2 hvr-icon"/> <span class="animate-underline">Browse Map</span>
      </VBtn>
    </div>
  </VRow>
  <VRow class="ma-0 mt-10" justify="center">
    <VImg
        height="100%"
        :src="HeroMainImage"
        alt="Hero Image"
        :lazy-src="Placeholder"
    />
  </VRow>
</template>

<style scoped>
.browse-map-button{
  background: white;
  border: 1px solid #e5e7eb;
}

.text-highlight-container{
  margin-top: 50px !important;
}
.text-highlight{
  font-size: 14px;
  margin: 2px 3px;
  background-color: #d9f3ff;
  padding: 2px 10px;
  font-weight: 600;
  border-radius: 10px;
}
.explore-button{
  border-radius: 10px !important;
}
.text-heading{
  font-family: 'Gambetta', serif !important;
  font-weight: 500;
  font-size: 56px !important;
  line-height: 60px;
  margin-top: 30px;
}

.blockquote-question{
  font-family: 'Satoshi', serif !important;
  font-weight: 800;
  font-size: 46px !important;
  line-height: 60px;
}

.heading-font{
  font-family: 'Gambetta', serif !important;
}

.text-subtitle{
  font-size: 21px;
  color: #0c0c0c;
  margin: 15px 0;
  padding: 0 5px;
}

@media (max-width: 960px) {
  .text-heading{
    font-size: 62px !important;
    line-height: 80px;
    margin-top: 70px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .text-heading, .heading-font{
    font-size: 40px !important;
    line-height: 46px;
    margin-top: 40px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 18px;
  }
}

@media (max-width: 476px) {
  .text-heading, .heading-font{
    font-size: 28px !important;
    line-height: 33px;
    margin-top: 25px;
  }

  .text-subtitle{
    margin: 15px 0;
    font-size: 16px;
  }
}

.gradient-text {
  color: #062b3e;
}

.fancy-text{
  //font-weight: 600 !important;
  background-image: linear-gradient(90deg, #3edef1, #124fc3);
  background-size: 0% 2.5px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size 300ms ease;
}

.fancy-text:hover, .animate-underline:hover{
  background-size: 100% 2.5px;
}

.animate-underline{
  background-image: linear-gradient(90deg, #fff, #fff);
  background-size: 0% 1px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size 300ms ease;
}



</style>
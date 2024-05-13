<script setup lang="ts">
import {PhMapTrifold} from "@phosphor-icons/vue";
import Arrow from "../../assets/images/circlearrow.svg";
</script>

<template>
    <VRow class="ma-0 text-highlight-container" justify="center">
   <span class="text-highlight">Repository</span> +
    <span class="text-highlight">Research and Development</span> +
    <span class="text-highlight">Mapping</span> +
    <span class="text-highlight">Data</span>
    </VRow>
  <p class="text-heading  text-h1 text-center gradient-text"> NOMCAARRD Interactive Data <br/> Mapping Distribution <br/> and Repository</p>
  <p class="text-center text-subtitle ">
    Experience enhanced data interaction with <span class="fancy-text">NOMCAARRD's dynamic <br/>  mapping and repository solutions, empowering users.</span></p>
  <VRow class="mt-4" justify="center">
    <div style="position: relative;">
      <VBtnPrimary  width="320px" height="60" class="mb-3 hvr-icon-spin explore-button" :to="{name: 'map'}">
        <PhMapTrifold size="20" class="mr-2 hvr-icon"/> <span class="animate-underline">Explore our Interactive Map</span>
      </VBtnPrimary>
      <VImg
          :src="Arrow"
          class="mt-5"
          alt="Hero Image"
          width="100%"
          height=30px
          style="position: absolute; right: -185px; top: -5px; transform: rotate(-120deg);"
      />

    </div>
<!--    <VBtnPrimaryPlain color="gs90" width="200px" :to="{ path: 'auth', query: { tab: 'register' } }">-->
<!--      <PhArrowCircleUpRight size="20" class="mr-2"/> Get Started-->
<!--    </VBtnPrimaryPlain>-->
  </VRow>
</template>

<style scoped>
.text-highlight-container{
  margin-top: 50px !important;
}
.text-highlight{
  font-size: 14px;
  margin: 0 3px;
  background-color: #d9f3ff;
  padding: 2px 10px;
  font-weight: 600;
  border-radius: 10px;
}
.explore-button{
  border-radius: 50px !important;
}
.text-heading{
  font-weight: 900;
  font-size: 74px !important;
  line-height: 90px;
  margin-top: 20px;
}

.text-subtitle{
  font-size: 21px;
  color: #0c0c0c;
  margin: 25px 0;
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
  .text-heading{
    font-size: 46px !important;
    line-height: 52px;
    margin-top: 40px;
  }

  .text-subtitle{
    margin: 20px 0;
    font-size: 20px;
  }
}

@media (max-width: 476px) {
  .text-heading{
    font-size: 40px !important;
    line-height: 42px;
    margin-top: 25px;
  }

  .text-subtitle{
    margin: 15px 0;
    font-size: 16px;
  }
}

.gradient-text {
  background-color: #062b3e;
  //background: linear-gradient(to right, #5db6c1, #15284c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
<script setup lang="ts">
import Navbar from "../../components/Landing/Navbar.vue";
import Hero from "../../components/Landing/Hero.vue";
import {PhCube} from "@phosphor-icons/vue";
import {onMounted, ref} from "vue";
import {useScreenStore} from "../../stores/screenSizeStore.ts";
import { Vue3Lottie } from "vue3-lottie";
import Container from "../../components/Global/Container.vue";
const {isMobile, isLargePhone} = useScreenStore()
const loading = ref(true)

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
  <VLayout
      :class="{
        'circle-background' : !loading
      }"
  >
    <Container class="center" v-show="loading">
      <Vue3Lottie
          animationLink="https://assets6.lottiefiles.com/packages/lf20_x62chJ.json"
          :height="isMobile || isLargePhone ? '300' : '500'"
          :width="isMobile || isLargePhone ? '300' : '500'" />
    </Container>
    <transition name="fade" v-show="!loading">
      <VContainer fluid>
        <Navbar>
          <Hero/>
        </Navbar>
        <PhCube color="#234261" weight="duotone" size="500" class="icon">
          <animate
              attributeName="opacity"
              values="0;1;0"
              dur="4s"
              repeatCount="indefinite"
          />
          <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="50s"
              from="0 0 0"
              to="360 0 0"
              repeatCount="indefinite"
          />
        </PhCube>
      </VContainer>
    </transition>
  </VLayout>
</template>

<style scoped>
.circle-background::before {
  content: '';
  position: fixed;
  top: -365px;
  left: -247px;
  width: 590px;
  height: 561px;
  border-radius: 50%;
  background: #DEF1FB;
  z-index: -1;
}


/*.icon{*/
/*  position: absolute;*/
/*  top: 0;*/
/*  left: 0;*/
/*  right: 0;*/
/*  bottom: 0;*/
/*  margin: auto;*/
/*  z-index: -1;*/
/*  opacity: 5% !important;*/
/*}*/


.icon{
  position: fixed;
  top: -300px;
  left: -200px;
  margin: auto;
  z-index: -1;
  opacity: 20% !important;
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

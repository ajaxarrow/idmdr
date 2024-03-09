<script setup lang="ts">
import Navbar from "../../components/Landing/Navbar.vue";
import Hero from "../../components/Landing/Hero.vue";
import {PhCube, PhIntersectSquare, PhIntersectThree} from "@phosphor-icons/vue";
</script>

<template>
  <VLayout class="circle-background">
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
  position: absolute;
  top: -300px;
  left: -200px;
  margin: auto;
  z-index: -1;
  opacity: 20% !important;
}

</style>

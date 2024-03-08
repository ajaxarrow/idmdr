<script setup lang="ts">
import Navbar from "../components/Landing/Navbar.vue";
import Hero from "../components/Landing/Hero.vue";
</script>

<template>
  <VLayout class="circle-background">
    <VContainer fluid>
      <Navbar>
        <Hero/>
      </Navbar>
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
</style>

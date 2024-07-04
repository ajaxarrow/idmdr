<script setup lang="ts">
  import {Vue3Lottie} from "vue3-lottie";
  import Container from "../components/Container.vue";
  import {useScreenStore} from "../stores/screen-size.store.ts";
  import {computed} from "vue";

  const {isMobile, isLargePhone} = useScreenStore()

  const layoutValue = computed(()=> isMobile || isLargePhone ? '300' : '500' )
</script>

<template>
  <Container class="center">
    <Vue3Lottie
        animationLink="https://assets-v2.lottiefiles.com/a/38b95a74-6c38-11ee-a075-579535b72c6d/MYLDYpeHZn.json"
        :height="layoutValue"
        :width="layoutValue"
    />
    <VBtnPrimaryFilled
        rounded="lg"
        height="50px"
        width="200px"  class="mb-4 text-white text-none" to="/"
    >Go Back to Home</VBtnPrimaryFilled
    >
  </Container>
</template>

<style scoped>

</style>
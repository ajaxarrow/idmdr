<script setup lang="ts">
  import Container from "../Global/Container.vue";
  import AuthCardContent from "./AuthCardContent.vue";
  import {useScreenStore} from "../../stores/screenSizeStore.ts";

  const {isMobile} = useScreenStore();

</script>

<template>
  <VContainer v-if="isMobile">
    <AuthCardContent/>
  </VContainer>
  <Container class="center" v-else>
    <VSheet
        border="md"
        class="mx-auto rounded-xl"
        color="white"
        max-width="400"
        width="400"
        height="520"
    >
      <AuthCardContent/>
    </VSheet>
  </Container>
</template>

<style scoped>

</style>
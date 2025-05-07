<script setup lang="ts">
import Container from "../../../core/components/Container.vue";
import AuthCardContent from "./AuthCardContent.vue";
import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
import AuthEmailCardContent from "./AuthEmailCardContent.vue";

const {isMobile} = useScreenStore();
</script>

<template>
  <VContainer v-if="isMobile">
    <AuthEmailCardContent/>
  </VContainer>
  <Container class="center" v-else>
    <VSheet
        border="md"
        class="mx-auto rounded-xl"
        color="white"
        max-width="450"
        width="450"
    >
      <AuthEmailCardContent/>

    </VSheet>
  </Container>
</template>

<style scoped>
.circle-quarter::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 125px;
  height: 125px;
  border-radius: 300% 50% 50% 50%;
  background: #DEF1FB;
  z-index: 2;
}

.logo{
  position: absolute;
  right: 150px;
  bottom: 20px;
  z-index: 3;
  opacity: 40%;
}
</style>
<script setup lang="ts">
  import Container from "../../../core/components/Container.vue";
  import AuthCardContent from "./AuthCardContent.vue";
  import {useScreenStore} from "../../../core/stores/screen-size.store.ts";
  import Logo from "../../../core/components/Logo.vue";
  import {useRouting} from "../../../core/composables/useRouting.ts";

  const {isMobile} = useScreenStore();
  const {route} = useRouting()
</script>

<template>
  <VContainer v-if="isMobile">
    <AuthCardContent/>
  </VContainer>
  <Container class="center" v-else>
    <VSheet
        border="md"
        class="mx-auto rounded-xl circle-quarter relative-container"
        color="white"
        :max-width="400"
        width="400"
        height="600"
    >
      <AuthCardContent/>
      <Logo class="logo"/>
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
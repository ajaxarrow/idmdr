<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {PhHardDrives} from "@phosphor-icons/vue";

  const currentElevation = ref(0);

  const handleScroll = () => {
    currentElevation.value = window.scrollY > 0 ? 5 : 0;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<template>
  <VAppBar class="bg-transparent px-7 pt-5" :elevation="currentElevation" >
    <VContainer fluid >
      <VRow align="center">
        <VCol cols="auto">
          <VAppBarTitle class="text-logo">
            <div class="d-flex">
              <PhHardDrives size="30" weight="duotone" color="#3291C7"/>
              IDMDR
            </div>
          </VAppBarTitle>
        </VCol>
        <VSpacer/>
        <VCol cols="auto">
          <VBtnPrimary variant="outlined" class="button-outline">
            Login
          </VBtnPrimary>
          <VBtnPrimary>
            Register
          </VBtnPrimary>
        </VCol>
      </VRow>
    </VContainer>
  </VAppBar>
</template>

<style scoped>
  .button-outline{
    border-width: 2px;
  }
</style>
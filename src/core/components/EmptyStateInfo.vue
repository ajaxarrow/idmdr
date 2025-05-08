<script setup lang="ts">
import {PhArrowClockwise} from "@phosphor-icons/vue";

const emits = defineEmits(['callback']);
const props = defineProps({
  header: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isCallbackNeeded: {
    type: Boolean,
    default: false
  }

});
</script>

<template>
  <VRow justify="center" class="my-12">
  <VCol cols="12" sm="8" md="6" class="text-center">
    <VIcon icon="mdi-alert-circle-outline" size="64" color="grey" class="mb-4"></VIcon>
    <h3 class="text-h5 mb-2">{{props.header}}</h3>
    <p class="text-body-1 mb-4">{{ props.description }}</p>
    <VBtn
        v-if="props.isCallbackNeeded"
        color="bs50"
        variant="elevated"
        height="47px"
        class="text-none mx-1" @click="emits('callback')">
      <PhArrowClockwise size="20" class="mr-2"/>
      <span>
        Clear Search
      </span>
    </VBtn>
  </VCol>
  </VRow>
</template>

<style scoped>

</style>
<script setup lang="ts">
import {PropType} from "vue";
import {ATBI} from "../../../interfaces/atbi.interface.ts";

const props = defineProps({
  atbi: {
    type: Object as PropType<ATBI>
  }
})
</script>

<template>
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">About ATBI</p>
      <div class="ql-snow">
        <div class="ql-editor" v-html="props.atbi?.description"></div>
      </div>
    </div>
  </div>
  <VDivider/>
  <div class="px-7 py-5">
    <div>
      <p class="text-about-heading py-3">Additional Info</p>
      <div class="ql-snow">
        <div class="ql-editor" v-html="props.atbi?.additionalInfo"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-about-heading{
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 5px;
}
</style>
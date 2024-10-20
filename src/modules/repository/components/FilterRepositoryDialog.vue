<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

const emits = defineEmits(['callback']);
const filterDialog = ref(false);
const selectedTags = ref<string[]>([]);
const tagItems = ref<string[]>([]);
const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  selectedTags: {
    type: Array,
    default: () => []
  }
})

const emitCallback = () => {
  emits('callback', selectedTags.value);
  filterDialog.value = false;
  selectedTags.value = [];
}

watch(() => selectedTags.value, () => {
  if(selectedTags.value.includes('All Repositories')){
    selectedTags.value = ['All Repositories'];
  }
})

watch(() => filterDialog.value, (newValue) => {
    if(newValue){
      console.log('Dialog opened');
      tagItems.value = props.tags || [];
      selectedTags.value = props.selectedTags || [];
    }
});

onMounted(() => {
  console.log('hi')
  tagItems.value = props.tags || [];
  selectedTags.value = props.selectedTags || [];
})

</script>

<template>
  <div @click="filterDialog = true" class="cursor-pointer">
    <slot></slot>
  </div>

  <VDialog v-model="filterDialog" class="center">
    <VSheet class="filter-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Filter Repository by Tags</p>
      <VDivider/>
      <div class="pa-5">
        <div>
        <div>
          <p class="dialog-label mb-2 d-flex justify-space-between">
            Tags
          </p>
          <VAutocomplete
              :menu-props="{ maxWidth: 0 }"
              v-model="selectedTags as string[]"
              placeholder="Choose Appropriate Access Level"
              :items="tagItems"
              class="my-2"
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
              multiple
              chips
          />
        </div>
      </div>
      <VDivider/>
      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="filterDialog = false"
            width="86"
            variant="outlined"
            class="button-outline action-button"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            width="86"
            class="action-button"
            @click="emitCallback"
        >
          Save
        </VBtnPrimaryAlt>
      </VRow>
      </div>
    </VSheet>
  </VDialog>
</template>

<style scoped>
  .filter-dialog-container{
    width: 600px;
    border-radius: 15px !important;
  }

  .dialog-title{
    font-size: 20px;
    font-weight: 700;
  }

  .dialog-label{
    font-size: 16px;
    font-weight: 600;
    color: black;
  }


  :deep(.v-label){
    opacity: 100% !important;
  }

  :deep(.v-list-item__title) {
    white-space: normal !important;  /* Allow wrapping */
    word-break: break-word;  /* Break long words */
  }


  :deep(.v-icon){
    --v-icon-size-multiplier: 1.23
  }

  :deep(.v-field__outline){
    opacity: 20%;
    color: #8C8C8C;
    --v-field-border-width: 1.75px !important;
  }

  :deep(input::placeholder){
    color: #5F6061;
    opacity: 90%;
  }

  .button-outline{
    border-width: 3px;
  }
  .action-button{
    font-weight: 500 !important;
    letter-spacing: 0;
    border-radius: 10px;
  }

  :deep(.v-overlay__content){
    display: grid !important;
    place-items: center !important;
  }
</style>
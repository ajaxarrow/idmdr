<script setup lang="ts">
import {PhFileDashed, PhPolygon, PhX} from "@phosphor-icons/vue";
import {ref} from "vue";
import {repositories} from "../../data/repository.ts";

const sectorTaggingDialog = ref(false);
</script>

<template>
  <p
    @click="sectorTaggingDialog = true"
    class="add-sector-menu-item cursor-pointer d-flex align-center my-2">
    <PhPolygon
        class="mr-1"
        color="#3291C7"
        weight="fill"
        size="14"
    />
    Draw Boundary from Map
  </p>
  <VDialog v-model="sectorTaggingDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Tag a Sector</p>
      <VDivider/>
      <div class="px-5 py-2">
        <p class="dialog-label mb-2">Boundaries</p>
        <div>
          <VDivider/>
            <div class="d-flex align-center justify-space-between pa-2">
              <p class="dialog-boundary-title d-flex align-center">
                <PhPolygon class="mr-1"/>
                drawn-boundary-coordinates-2024-03-06-153045
              </p>
              <PhX/>
            </div>
          <VDivider/>
        </div>
        <div class="my-3 file-upload-container">
          <PhFileDashed size="50"/>
          <p class="text-dropzone">Drag and drop files here or <label class="file-label" for="dropzoneFile">Choose files</label> or <span class="file-label">Draw boundary</span></p>
          <VFileInput id="dropzoneFile" style="display: none"/>
        </div>
        <div>
          <p class="dialog-label mb-2">Tags</p>
          <VTextField
              placeholder="E.g. Soil Health, Agriculture Data, Global Farming, Agricultural Lands,"
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
        <div>
          <p class="dialog-label mb-2">Repository</p>
          <VAutocomplete
              :item-value="repository => `${repository.slug}`"
              :item-title="repository => `${repository.title}`"
              :items="repositories"
              placeholder="Choose Repository..."
              class="my-2"
              hide-details
              rounded="lg"
              density="comfortable"
              variant="outlined"
              color="primary"
              base-color="gs60"
          />
        </div>
      </div>
      <VDivider/>

      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="sectorTaggingDialog = false"
            width="86"
            variant="outlined"
            class="button-outline"
        >
          Close
        </VBtnPrimaryAlt>
        <VBtnPrimaryAlt
            @click="sectorTaggingDialog = false"
            width="86"
            class="button-outline"
        >
          Save
        </VBtnPrimaryAlt>
      </VRow>
    </VSheet>
  </VDialog>
</template>

<style scoped>
.add-sector-menu-item{
  border-radius: 8px;
  padding: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
}

.add-sector-menu-item:hover{
  background-color: #e0e3e3;
}

.sector-tagging-dialog-container{
  width: 663px;
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

.dialog-boundary-title{
  font-size: 14px;
  color: black;
}

.file-upload-container{
  width: 100%;
  height: 144px;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #E6E6E6;
  background-color: #fff;
  transition: .3s ease all;
}

.file-label{
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}

.text-dropzone{
  font-size: 14px;
}

:deep .v-label{
  opacity: 100% !important;
}

:deep .v-icon{
  --v-icon-size-multiplier: 1.23
}

:deep .v-field__outline {
  opacity: 20%;
  color: #8C8C8C;
  --v-field-border-width: 1.75px !important;
}

:deep input::placeholder {
  color: #5F6061;
  opacity: 90%;
}

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 3px;
  border-radius: 10px;
}

:deep .v-overlay__content {
  display: grid !important;
  place-items: center !important;
}

</style>
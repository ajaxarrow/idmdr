<script setup lang="ts">
import {ref} from "vue";

const accessLevelInfoDialog = ref(false);
</script>
()
<template>
  <span @click="accessLevelInfoDialog = true" class="text-bs50 cursor-pointer info">
    Know more about repository files visibility level here
  </span>
  <VDialog v-model="accessLevelInfoDialog" class="center">
    <VSheet class="sector-tagging-dialog-container" @click.stop>
      <p class="dialog-title pa-5">Repository Visibility Information</p>
      <VDivider/>
      <div class="pa-5">
        <p>Below are the visibility options that can be assigned to files uploaded in the repository:</p>
        <ul class="py-3">
          <li>
            <strong>Public:</strong> The file will be visible to anyone. This means that guest or unauthenticated users can view the file, but only if the repository’s visibility is also set to public.
          </li>
          <li>
            <strong>Private:</strong> The file will only be accessible to the repository owner.
          </li>
          <li>
            <strong>Within Organization:</strong> The file will be accessible to members of the organization assigned to the repository. This option is available only if the repository is not set to private.
          </li>
          <li>
            <strong>Within All Organizations:</strong> The file will be accessible to all organizations. This option is available if the repository is set to public or visible within all organizations.
          </li>
        </ul>
      </div>


      <VDivider/>
      <VRow class="ma-0 pa-4" justify="end">
        <VBtnPrimaryAlt
            @click="accessLevelInfoDialog = false"
            class="button-outline"
        >
          Understood!
        </VBtnPrimaryAlt>
      </VRow>
    </VSheet>
  </VDialog>
</template>

<style scoped>
li{
  margin: 10px
}

.info:hover{
  text-decoration: underline;
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


:deep(.v-label){
  opacity: 100% !important;
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
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 10px;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}
</style>
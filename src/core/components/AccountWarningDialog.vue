<script setup lang="ts">
import {ref} from "vue";
import {PhWarning} from "@phosphor-icons/vue";

const props = defineProps({
  warningDialog: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['callback']);

</script>

<template>
  <VDialog v-model="props.warningDialog" class="center">
    <VSheet class="delete-dialog-container" @click.stop>
      <PhWarning color="#C83246" weight="duotone" size="50" />
      <p class="font-weight-black text-h6">Account Disabled</p>
      <p class="text-center px-1 mb-3">
        Your account has been disabled. Please contact your system administrator to regain access or resolve this issue.
      </p>
      <VBtnPrimaryAlt
          color="warning"
          @click="emits('callback')"
          width="98%"
          class="submit-button"
      >
        Close
      </VBtnPrimaryAlt>
    </VSheet>
  </VDialog>
</template>

<style scoped>
.delete-dialog-container{
  gap: 10px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  border-radius: 15px !important;
}

:deep(.v-overlay__content){
  display: grid !important;
  place-items: center !important;
}

.button-outline{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-width: 2px;
  border-radius: 8px;
}

.submit-button{
  font-weight: 500 !important;
  letter-spacing: 0;
  border-radius: 8px;
}
</style>
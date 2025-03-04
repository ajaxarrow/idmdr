<script setup lang="ts">
import {PhQuestion} from "@phosphor-icons/vue";
import {ref} from "vue";

const props = defineProps({
  content: {
    type: String,
    default: 'Are you sure with this?'
  },
  confirmContent: {
    type: String,
    default: 'Yes'
  }
})
const emit = defineEmits(['callback'])
const confirmationDialog = ref(false)


const handleConfirm = () => {
  emit("callback")
  confirmationDialog.value = false
}

</script>

<template>
  <div class="cursor-pointer" @click="confirmationDialog = true">
    <slot>
    </slot>
  </div>
  <VDialog v-model="confirmationDialog" class="center">
    <VSheet class="delete-dialog-container" @click.stop>
      <PhQuestion color="#01579B" weight="duotone" size="50"/>
      <p class="font-weight-black text-h6">Are you sure?</p>
      <p class="text-center px-1 mb-3">{{ props.content }}</p>
      <VBtnPrimaryAlt
          color="#01579B"
          @click="handleConfirm"
          width="98%"
          class="submit-button"
      >
        {{props.confirmContent}}
      </VBtnPrimaryAlt>
      <VBtnPrimaryAlt
          color="#01579B"
          @click="confirmationDialog = false"
          width="98%"
          variant="outlined"
          class="button-outline"
      >
        No, Cancel It
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
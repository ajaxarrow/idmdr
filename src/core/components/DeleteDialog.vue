<script setup lang="ts">
  import {ref} from "vue";
  import {PhWarning} from "@phosphor-icons/vue";

  const emit = defineEmits(['callback'])
  const deleteDialog = ref(false)

  const handleDelete = () => {
    emit("callback")
    deleteDialog.value = false
  }
</script>

<template>
  <div class="cursor-pointer" @click="deleteDialog = true">
    <slot>
    </slot>
  </div>
  <VDialog v-model="deleteDialog" class="center">
    <VSheet class="delete-dialog-container" @click.stop>
      <PhWarning color="#C83246" weight="duotone" size="50"/>
      <p class="font-weight-black text-h6">Are you sure?</p>
      <p class="text-center px-1 mb-3">This action cannot be undone. All data associated with this entity will be permanently deleted.</p>
      <VBtnPrimaryAlt
          color="warning"
          @click="handleDelete"
          width="98%"
          class="submit-button"
      >
        Yes, Delete!
      </VBtnPrimaryAlt>
      <VBtnPrimaryAlt
          color="warning"
          @click="deleteDialog = false"
          width="98%"
          variant="outlined"
          class="button-outline"
      >
        No, Keep It.
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

:deep .v-overlay__content {
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
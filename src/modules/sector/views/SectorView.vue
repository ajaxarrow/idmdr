<script setup lang="ts">
  import SectorMap from "../components/SectorMap.vue";
  import {Status} from "../../../interfaces/enums/status.enum.ts";
  import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
  import {onMounted} from "vue";

  const {showSnackbarMessage} = useSnackbarStore();

  const setSnackbarMessage = async () => {
    // @ts-ignore
    const message = JSON.parse(await localStorage.getItem('snackbarmessage'))
    if(message) {
      showSnackbarMessage(
          message.message,
          Status.success
      )
      localStorage.removeItem('snackbarmessage')
    }
  };

  onMounted(() => {
    setSnackbarMessage()
  })
</script>

<template>
  <SectorMap/>
</template>

<style scoped>

</style>
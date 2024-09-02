import {ref} from "vue";
import {Status} from "../../interfaces/enums/status.enum.ts";
import {createGlobalState} from "@vueuse/core";

const showSnackbar = ref(false);
const snackbarMessage = ref("");
const snackbarStatus = ref<Status>(Status.information);

const showSnackbarMessage = (message: string, status: Status) => {
  snackbarStatus.value = status;
  snackbarMessage.value = message;
  showSnackbar.value = true;
};

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

export const useSnackbarStore = createGlobalState(() => ({
  showSnackbar,
  snackbarMessage,
  snackbarStatus,
  showSnackbarMessage,
  setSnackbarMessage
}))
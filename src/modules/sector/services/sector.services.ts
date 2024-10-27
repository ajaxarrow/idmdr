import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {reactive, ref} from "vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {server} from "../../../plugins/axios.ts";

const { userData } = useUserStore();
// const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();
// const stringToArray = (str: string): string[] =>
//   str.length > 0 ? str.split(', ') : [];

export const useSectorServices = () => {
  const errorMessageInitialState = reactive({
    name: "",
    address: "",
    geojson: "",
  })

  const loading = ref(false);

  const errorMessage = reactive({ ...errorMessageInitialState });

  const hasErrorMessages = (errorMessage: any): boolean => {
    // Iterate over each key in the errorMessage object
    return Object.keys(errorMessage).some(key => {
      const value = errorMessage[key];

      // If value is an object, recursively check its properties
      if (typeof value === 'object' && !Array.isArray(value)) {
        return hasErrorMessages(value);
      }

      // Check if the value is a non-empty string (error message present)
      return typeof value === 'string' && value.trim().length > 0;
    });
  };

  const handleDynamicErrorMapping = (data: any, target: any) => {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        // Ensure the nested object exists in the target
        if (!target[key]) {
          target[key] = {}; // Create the nested object if it doesn't exist
        }
        handleDynamicErrorMapping(data[key], target[key]); // Recursive call for nested objects
      } else {
        target[key] = data[key]?.[0] ?? target[key]; // Assign value or keep existing target value if undefined
      }
    });
  };

  const clearErrorMessage = () => {
    Object.assign(errorMessage, { ...errorMessageInitialState });
  };

  const saveSector = async (sector: Sector, endpoint: string, type: string) => {
    clearErrorMessage()
    loading.value = true;
    try {
      await (type === 'create' ? server.post : server.put)(
        endpoint,
        sector, {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if(type === 'create') {
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Sector created successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = '/sector-tagging';
        }, 3000);
      } else {
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: 'Sector updated successfully',
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = '/sector-tagging';
        }, 3000);
      }
    } catch (e: any) {
      console.log(e)
      loading.value = false;
      showSnackbarMessage('OOPS! Something went wrong', Status.error);
      clearErrorMessage();
      handleDynamicErrorMapping(e.response?.data, errorMessage);
      return;
    }
  }

  const addSector = async (sector: Sector) => {
    await saveSector(sector, `/v1/sector/`, 'create');
  }

  const updateSector = async (sector: Sector, id: string) => {
    await saveSector(sector, `/v1/sector/${id}/`, 'update');
  }

  return {
    addSector,
    updateSector,
    loading,
    errorMessage,
    hasErrorMessages
  }


}
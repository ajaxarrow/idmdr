import {useUserStore} from "../../../core/stores/user.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {reactive, ref} from "vue";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {server} from "../../../plugins/axios.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {useSectorsStore} from "../stores/sectors.store.ts";

const { userData, user } = useUserStore();
const {isEmptyObject} = useObjectChecker();
const authorizationHeader = user.value ? { Authorization: `Bearer ${userData.accessToken}` } : {}
const {showSnackbarMessage} = useSnackbarStore();
const {allSectors} = useSectorsStore();
const stringToArray = (str: string): string[] =>
  str.length > 0 ? str.split(', ') : [];

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

  const saveSector = async (sector: Sector, endpoint: string, type: string, useInForm: boolean = true) => {
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

      if(useInForm){
        await localStorage.setItem('snackbarmessage', JSON.stringify({
          message: `Sector ${type === 'create' ? 'added' : 'updated'} successfully`,
          status: 'success'
        }))
        setTimeout(async function() {
          loading.value = false;
          window.location.href = '/map';
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

  const deleteSector = async (id: string) => {
    await server.delete(`/v1/sector/${id}/`, {
      headers: {
        'Authorization': `Bearer ${userData.accessToken}`
      }
    });
  }

  const addSector = async (sector: Sector) => {
    await saveSector(sector, `/v1/sector/`, 'create');
  }

  const updateSector = async (sector: Sector, id: string) => {
    await saveSector(sector, `/v1/sector/${id}/`, 'update');
  }

  const mapSectorData = async(rawData: any): Promise<Sector[]> => {
    return rawData.map((data: any) => {
      return {
        uid: data.uid || '',
        slug: data.uid || '',
        name: data.name || '',
        address: data.address || '',
        geojson: isEmptyObject(data.geojson) ? {} : data.geojson,
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        description: data.description || '',
        image: data.image || '',
        tags: data.tags ? stringToArray(data.tags) : '',
        parent: data.parent || '',
        parent_id: data.parent_id || '',
        parent_obj: data.parent_obj,
        owner_id: data.owner_id,
        owner: data.owner,
        visibility: data.visibility
      }
    })
  }

  const fetchSectors = async (pageSize: number = 100): Promise<Sector[]> => {
    try{
      let data: Sector[] = []
      if(user.value){
        const visibilityData = await fetchSectorsByVisibility([1, 4], pageSize);
        const userRepo = await fetchSectorsByUser(pageSize);
        let combinedData = [...visibilityData.flat(), ...userRepo];
        const uniqueData = Array.from(new Set(combinedData.map(repo => repo.slug)))
          .map(slug => combinedData.find(repo => repo.slug === slug));
        // @ts-ignore
        data = uniqueData ;
      } else {
        const visibilityData = await fetchSectorsByVisibility([1]);
        data = visibilityData[0];
      }
      allSectors.value = data;
      return data;
    } catch (e) {
      return []
    }
  }


  const fetchSectorsByVisibility = async (visibilities: number[], pageSize: number = 100): Promise<Sector[][]> => {
    const promises = visibilities.map(async (visibility) => {
      const res = await server.get(`/v1/sector/?ordering=-updated_at&page_size=${pageSize}&visibility=${visibility}`, {
        headers: authorizationHeader
      });
      return mapSectorData(res.data);
    });
    return Promise.all(promises);
  };

  const fetchSectorsByUser = async(pageSize: number = 100): Promise<Sector[]> => {
    try{
      const res = await server.get(`/v1/sector/?ordering=-updated_at&page_size=${pageSize}&user=${userData.uid}`, {
        headers: {
          'Authorization': `Bearer ${userData.accessToken}`
        }
      });
      const rawData = res.data;
      const sectors: Sector[] = await mapSectorData(rawData);

      return [...sectors];
    } catch (e) {
      return []
    }
  }

  const fetchSectorData = async(slug: string): Promise<Sector | null> => {
    try {
      const res = await server.get(`v1/sector/${slug}/`)
      return {
        uid: res.data.uid || '',
        slug: res.data.uid || '',
        name: res.data.name || '',
        address: res.data.address || '',
        geojson: isEmptyObject(res.data.geojson) ? {} : res.data.geojson,
        created_at: res.data.created_at || '',
        updated_at: res.data.updated_at || '',
        description: res.data.description || '',
        image: res.data.image || '',
        tags: res.data.tags ? stringToArray(res.data.tags) : '',
        parent: res.data.parent || '',
        parent_id: res.data.parent_id || '',
        parent_obj: res.data.parent_obj,
        owner_id: res.data.owner_id,
        owner: res.data.owner,
        visibility: res.data.visibility
      }
    } catch(e: any){
      console.log(e)
      return null;
    }
  }

  return {
    addSector,
    updateSector,
    loading,
    errorMessage,
    hasErrorMessages,
    fetchSectors,
    fetchSectorData,
    deleteSector
  }


}
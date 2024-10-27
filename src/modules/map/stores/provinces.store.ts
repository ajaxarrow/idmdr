import {ref} from "vue";
import boundaries from "../../../data/boundaries.ts";
import {createGlobalState} from "@vueuse/core";

const provinces = ref(boundaries);


const filterProvinces = (name: string) => {
  provinces.value = boundaries.filter(province => province.name.toLowerCase().includes(name.toLowerCase().trim()));
}

export const useProvincesStore = createGlobalState(() => ({provinces, filterProvinces}));
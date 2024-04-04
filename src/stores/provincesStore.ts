import {ref} from "vue";
import boundaries from "../data/boundaries.ts";
import {createGlobalState} from "@vueuse/core";

const provinces = ref(boundaries);

const filterProvinces = (title: string) => {
  provinces.value = boundaries.filter(province => province.title.toLowerCase().includes(title.toLowerCase().trim()));
}

export const useProvincesStore = createGlobalState(() => ({provinces, filterProvinces}));
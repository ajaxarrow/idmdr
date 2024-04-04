import {ref} from "vue";
import sectorData from "../data/sectors.ts";
import {createGlobalState} from "@vueuse/core";

const sectors = ref(sectorData);

const filterSectors = (title: string) => {
  sectors.value = sectorData.filter(sector => sector.title.toLowerCase().includes(title.toLowerCase().trim()));
}

export const useSectorsStore = createGlobalState(() => ({sectors, filterSectors}));

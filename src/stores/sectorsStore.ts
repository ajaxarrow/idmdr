import {ref} from "vue";
import sectorData from "../data/sectors.ts";
import {createGlobalState} from "@vueuse/core";
import {Sector} from "../interfaces/sector.interface.ts";

const sectors = ref(sectorData);
const selectedSector = ref<Sector | null>(null);

const selectSector = (sector: Sector) => {
  if(selectedSector.value === sector) {
    selectedSector.value = null;
    return;
  }
  selectedSector.value = sector;
}

const filterSectors = (title: string) => {
  sectors.value = sectorData.filter(sector => sector.title.toLowerCase().includes(title.toLowerCase().trim()));
}

const removeSelectedSector = () => {
  selectedSector.value = null;
}

export const useSectorsStore = createGlobalState(() => ({sectors, filterSectors, selectedSector, selectSector, removeSelectedSector}));

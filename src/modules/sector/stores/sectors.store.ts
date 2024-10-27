import {ref} from "vue";
import sectorData from "../../../data/sectors.ts";
import {createGlobalState} from "@vueuse/core";
import {Sector} from "../../../interfaces/sector.interface.ts";

const sectors = ref(sectorData);
const selectedSector = ref<Sector | null>(null);
const title = ref('');

const selectSector = (sector: Sector, name: string) => {
  if(selectedSector.value === sector) {
    selectedSector.value = null;
    return;
  }
  title.value = name;
  selectedSector.value = sector;
}


const filterSectors = (name: string) => {
  sectors.value = sectorData.filter(sector => sector.name.toLowerCase().includes(name.toLowerCase().trim()));
}

const removeSelectedSector = () => {
  selectedSector.value = null;
}

export const useSectorsStore = createGlobalState(() => ({sectors, filterSectors, selectedSector, selectSector, removeSelectedSector, title}));

import {ref} from "vue";
import sectorData from "../../../data/sectors.ts";
import {createGlobalState} from "@vueuse/core";
import {Sector} from "../../../interfaces/sector.interface.ts";

const sectors = ref(sectorData);
const allSectors = ref<Sector[]>([])
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

const filterSectorsbySearchQuery = async (searchQuery: string, sectorData: Sector[])=> {
  if(searchQuery){
    allSectors.value = sectorData.filter(sector => sector.name.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()))
  } else {
    allSectors.value = sectorData
  }
}

export const useSectorsStore = createGlobalState(() => ({sectors, filterSectors, selectedSector, selectSector, removeSelectedSector, title, allSectors, filterSectorsbySearchQuery}));

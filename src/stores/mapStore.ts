import {shallowRef, ref} from "vue";
import {LngLatLike, Map} from "maplibre-gl";
import {Sector} from "../interfaces/sector.interface.ts";
import {useSectorsStore} from "./sectorsStore.ts";
import {createGlobalState} from "@vueuse/core";

const {selectSector, removeSelectedSector} = useSectorsStore();

const map = shallowRef<null | Map>(null);
const clickedBoundary = ref('');
const color = ref('#00ACC1');
const lnglat: LngLatLike = [124.6, 7.858930800481815];

const clickProvince = (boundary: Sector) => {
  if (boundary.title !== clickedBoundary.value) {
    selectSector(boundary, 'Province')
    if (clickedBoundary.value) {
      map.value?.setPaintProperty(`id-${clickedBoundary.value}`, 'fill-color', 'transparent');
    }
    map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-opacity', .5);
    map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-color', color.value);

    clickedBoundary.value = boundary.title;

  } else {
    removeSelectedSector()
    clickedBoundary.value = '';
    map.value?.setPaintProperty(`id-${clickedBoundary.value}`, 'fill-color', 'transparent');
    // @ts-ignore
    map.value?.easeTo({
      zoom: 7,
      center: lnglat,
      duration: 1000
    });
  }
}

export const useMapStore = createGlobalState(() => ({map, clickProvince, color, lnglat, clickedBoundary}))
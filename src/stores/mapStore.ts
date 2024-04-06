import {shallowRef, ref} from "vue";
import {LngLatLike, Map, Popup} from "maplibre-gl";
import {Sector} from "../interfaces/sector.interface.ts";
import {useSectorsStore} from "./sectorsStore.ts";
import {createGlobalState} from "@vueuse/core";

const {selectSector, removeSelectedSector} = useSectorsStore();

const map = shallowRef<null | Map>(null);
const popup = ref<Popup | null>(new Popup({
  closeButton: false,
  closeOnClick: false,
}));
const clickedBoundary = ref('');
const color = ref('#00ACC1');
const lnglat: LngLatLike = [124.6, 7.858930800481815];
const getCenter = (bbox: [number, number, number, number]) => {
  return [
    bbox[0] + (bbox[2] - bbox[0]) / 2, bbox[1] + (bbox[3] - bbox[1]) / 2
  ]
}

const clickProvince = (boundary: Sector, type: string) => {
  if (boundary.title !== clickedBoundary.value) {
    selectSector(boundary, type)
    if (clickedBoundary.value) {
      map.value?.setPaintProperty(`id-${clickedBoundary.value}`, 'fill-color', 'transparent');
    }

    // @ts-ignore
    const center = getCenter(boundary.bbox);


    if(type === 'Sector'){
      map.value?.easeTo({
        zoom: 15,
        // @ts-ignore
        center: center,
        duration: 1000
      });
    } else {
      map.value?.easeTo({
        zoom: 8,
        // @ts-ignore
        center: center,
        duration: 1000
      });
    }

    map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-opacity', .5);
    map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-color', color.value);

    clickedBoundary.value = boundary.title;

  } else {
    removeSelectedSector()
    if (clickedBoundary.value) {
      map.value?.setPaintProperty(`id-${clickedBoundary.value}`, 'fill-color', 'transparent');
    }
    clickedBoundary.value = '';
    // @ts-ignore
    map.value?.easeTo({
      zoom: 7,
      center: lnglat,
      duration: 1000
    });
  }
}




const setupBoundaries = (boundaries: Sector[], type: string) => {
  boundaries.forEach((boundary: Sector) => {
    // @ts-ignore
    map.value?.addSource(boundary.title, {
      type: 'geojson',
      data: boundary.geojson,
    });

    map.value?.addLayer({
      id: `id-${boundary.title}`,
      type: 'fill',
      source: boundary.title,
      layout: {},
      paint: {
        'fill-opacity': 0,
        'fill-color': 'transparent',
      },
    });

    // @ts-ignore
    map.value?.on('mouseover', `id-${boundary.title}`, (e) => {
      if (boundary.title !== clickedBoundary.value) {
        map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-opacity', .5);
        map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-color', color.value);
      }

      const popupContent = `<h4>${boundary.title}</h4>
                              <p>${boundary.description}</p>`
      popup.value?.setHTML(popupContent);
      // @ts-ignore
      popup.value?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      // @ts-ignore
      popup.value?.addTo(map.value);
    });

    // @ts-ignore
    map.value?.on('mouseleave', `id-${boundary.title}`, () => {
      if (boundary.title !== clickedBoundary.value) {
        map.value?.setPaintProperty(`id-${boundary.title}`, 'fill-opacity', 0);
      }
      popup.value?.remove();
    });


    // @ts-ignore
    map.value?.on('click', `id-${boundary.title}`, (e) => {
      // @ts-ignore
      if (map.value?.getZoom() < 6.25){
        // @ts-ignore
        map.value?.easeTo({
          zoom: 6,
          center: [e.lngLat.lng, e.lngLat.lat],
          duration: 1000
        });
      }
      else{
        // @ts-ignore
        map.value?.easeTo({
          zoom: 8,
          center: [e.lngLat.lng, e.lngLat.lat],
          duration: 1000
        });
      }
      clickProvince(boundary, type)

    });

  });
}

export const useMapStore = createGlobalState(() => ({map, clickProvince, color, lnglat, clickedBoundary, setupBoundaries}))
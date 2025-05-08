import {ref, shallowRef} from "vue";
import {LngLatLike, Map, Popup} from "maplibre-gl";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {useSectorsStore} from "../../sector/stores/sectors.store.ts";
import {createGlobalState} from "@vueuse/core";
//@ts-ignore
import * as turf from "@turf/turf";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useOrganizationStore} from "../../organization/stores/organization.store.ts";
import {useSnackbarStore} from "../../../core/stores/snackbar.store.ts";
import {Status} from "../../../interfaces/enums/status.enum.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import boundaries from "../../../data/boundaries.ts";

const {isEmptyObject} = useObjectChecker()
const {selectSector, removeSelectedSector} = useSectorsStore();
const {selectOrganization, removeSelectedOrganization} = useOrganizationStore();
const {showSnackbarMessage} = useSnackbarStore();

const map = shallowRef<null | Map>(null);

const popup = ref<Popup | null>(new Popup({
  closeButton: false,
  closeOnClick: false,
}));
const clickedBoundary = ref('');
const color = ref('#00c16a');
const lnglat: LngLatLike = [124.6, 7.858930800481815];
// const getCenter = (bbox: [number, number, number, number]) => {
//   return [
//     bbox[0] + (bbox[2] - bbox[0]) / 2, bbox[1] + (bbox[3] - bbox[1]) / 2
//   ]
// }

const clickProvince = (boundary: Sector, type: string) => {
  const colorValue = type == 'Province' ? '#00ACC1' : '#0027c1';
  if (boundary.name !== clickedBoundary.value) {
    if(type === 'Sector') {
      removeBoundaries(boundaries);
    }
    selectSector(boundary, type)
    if (clickedBoundary.value) {
      map.value?.setPaintProperty(`id-${clickedBoundary.value}`, 'fill-color', 'transparent');
    }

    // @ts-ignore
    // const center = getCenter(boundary.bbox);

    // console.log(calculatePolygonSize(boundary.geojson));

    map.value?.fitBounds(
      // @ts-ignore
      boundary.bbox ? boundary.bbox : turf.bbox(boundary.geojson["geometry"]),
      {padding: 30, duration: 2000}
    )

    map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-opacity', .5);
    map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-color', colorValue);

    clickedBoundary.value = boundary.name;

  } else {
    resetToDefault('Sector')
    if(type === 'Sector') {
      setupBoundaries(boundaries, 'Province');
    }
  }
}



const clickOrganization = (boundary: Organization) => {
  if(isEmptyObject(boundary.geojson)){
    showSnackbarMessage('No location data available for this organization', Status.error)
  }
  if (boundary.name !== clickedBoundary.value) {
    removeBoundaries(boundaries);
    selectOrganization(boundary);
    if (clickedBoundary.value) {
      map.value?.setPaintProperty(`id-${clickedBoundary.value}`, 'fill-color', 'transparent');
    }

    // @ts-ignore
    // const center = getCenter(boundary.bbox);

    // console.log(calculatePolygonSize(boundary.geojson));

    map.value?.fitBounds(
      // @ts-ignore
      boundary.bbox ? boundary.bbox : turf.bbox(boundary.geojson["geometry"]),
      {padding: 30, duration: 2000}
    )

    map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-opacity', .5);
    map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-color', color.value);

    clickedBoundary.value = boundary.name;
  } else {
    resetToDefault('Organization')
    setupBoundaries(boundaries, 'Province');
  }
}

const resetToDefault = (type: string) => {
  if(type === 'Organization') {
    removeSelectedOrganization()
  } else {
    removeSelectedSector()
  }
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



const setupBoundaries = (boundaries: Sector[], type: string) => {
  const colorValue = type == 'Province' ? '#00ACC1' : '#0027c1';
  boundaries.forEach((boundary: Sector) => {
    // @ts-ignore
    map.value?.addSource(boundary.name, {
      type: 'geojson',
      data: boundary.geojson,
    });

    map.value?.addLayer({
      id: `id-${boundary.name}`,
      type: 'fill',
      source: boundary.name,
      layout: {},
      paint: {
        'fill-opacity': 0,
        'fill-color': 'transparent',
      },
    });

    // @ts-ignore
    map.value?.on('mouseover', `id-${boundary.name}`, (e) => {
      if (boundary.name !== clickedBoundary.value) {
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-opacity', .5);
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-color', colorValue);
      }

      const popupContent = `<h4>${boundary.name}</h4>
                              <p>${boundary.description}</p>`
      popup.value?.setHTML(popupContent);
      // @ts-ignore
      popup.value?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      // @ts-ignore
      popup.value?.addTo(map.value);
    });

    // @ts-ignore
    map.value?.on('mouseleave', `id-${boundary.name}`, () => {
      if (boundary.name !== clickedBoundary.value) {
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-opacity', 0);
      }
      popup.value?.remove();
    });


    // @ts-ignore
    map.value?.on('click', `id-${boundary.name}`, (e) => {
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

const removeBoundaries = (boundaries: Sector[]) => {
  boundaries.forEach((boundary: Sector) => {
    const layerId = `id-${boundary.name}`;

    if (map.value?.getLayer(layerId)) {
      // Remove event listeners first
      // map.value?.off('mouseover', layerId);
      // // @ts-ignore
      // map.value?.off('mouseleave', layerId);
      // map.value?.off('click', layerId);

      // Remove the layer and source from the map
      map.value?.removeLayer(layerId);
      map.value?.removeSource(boundary.name);
    }
  });
};



const setupBoundariesforOrganization = async (boundaries: Organization[]) => {
  boundaries.forEach((boundary: Organization) => {
    // @ts-ignore
    map.value?.addSource(boundary.name, {
      type: 'geojson',
      data: boundary.geojson,
    });

    map.value?.addLayer({
      id: `id-${boundary.name}`,
      type: 'fill',
      source: boundary.name,
      layout: {},
      paint: {
        'fill-opacity': 0,
        'fill-color': 'transparent',
      },
    });

    // @ts-ignore
    map.value?.on('mouseover', `id-${boundary.name}`, (e) => {
      if (boundary.name !== clickedBoundary.value) {
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-opacity', .5);
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-color', color.value);
      }

      const popupContent = `<h4>${boundary.name}</h4>
                              <p>${boundary.address}</p>`
      popup.value?.setHTML(popupContent);
      // @ts-ignore
      popup.value?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      // @ts-ignore
      popup.value?.addTo(map.value);
    });

    // @ts-ignore
    map.value?.on('mouseleave', `id-${boundary.name}`, () => {
      if (boundary.name !== clickedBoundary.value) {
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-opacity', 0);
      }
      popup.value?.remove();
    });


    // @ts-ignore
    map.value?.on('click', `id-${boundary.name}`, (e) => {
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
      clickOrganization(boundary)

    });

  });
}




// const calculatePolygonSize = (geojson: any): number => {
//   if(geojson["type"] == 'FeatureCollection'){
//     let totalArea = 0;
//     geojson["features"].forEach((feature: any) => {
//       totalArea += turf.area(feature["geometry"]);
//     })
//     return totalArea
//   } else if (geojson["type"] == 'Feature') {
//     return turf.area(geojson["geometry"])
//   } else {
//     console.error('Unsupported geometry type:', geojson["type"]);
//     return 0
//   }
// }


export const useMapStore = createGlobalState(() => ({map, clickProvince, color, lnglat, clickedBoundary, setupBoundaries, removeBoundaries, resetToDefault, setupBoundariesforOrganization, clickOrganization, popup}))
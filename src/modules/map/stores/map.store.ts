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
const dotDensityLayer = ref(false);
const popup = ref<Popup | null>(new Popup({
  closeButton: false,
  closeOnClick: false,
}));
const clickedBoundary = ref('');
const color = ref('#00ACC1');
const lnglat: LngLatLike = [124.6, 7.858930800481815];
// const getCenter = (bbox: [number, number, number, number]) => {
//   return [
//     bbox[0] + (bbox[2] - bbox[0]) / 2, bbox[1] + (bbox[3] - bbox[1]) / 2
//   ]
// }

const clickProvince = (boundary: Sector, type: string) => {
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
    map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-color', color.value);

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
        map.value?.setPaintProperty(`id-${boundary.name}`, 'fill-color', color.value);
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

const numPoints = 500
function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const randomPoints = ref([])

//@ts-ignore
const generateRandomCoordinates = (geojson) => {
  // Generate random points within the bounding box
  const bbox = turf.bbox(geojson);
  for (let i = 0; i < numPoints; i++) {
    let isPointInside = false;
    while (!isPointInside) {
      const randomLng = getRandomNumber(bbox[0], bbox[2]);
      const randomLat = getRandomNumber(bbox[1], bbox[3]);
      const randomPoint = turf.point([randomLng, randomLat]);
      if (turf.booleanPointInPolygon(randomPoint, geojson)) {
        //@ts-ignore
        randomPoints.value.push([randomLng, randomLat]);
        isPointInside = true;
      }
    }
  }
};

const loadDotDensityLayer = () => {
  //@ts-ignore
  map.value?.addSource('random-dots', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: randomPoints.value.map(coords => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coords
        },
        properties: {
          greenIntensity: Math.random()
        }
      }))
    }
  });

  //@ts-ignore
  map.value?.addLayer({
    id: 'random-dots',
    type: 'circle',
    source: 'random-dots',
    paint: {
      'circle-radius': 2,
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'greenIntensity'],
        // 0, 'rgba(5,53,5,0.1)',
        // 0.25, 'rgba(0, 255, 0, 0.3)',
        // 0.5, 'rgba(0, 255, 0, 0.5)',
        // 0.75, 'rgba(98,190,98,0.7)',
        // 1, 'rgb(8,60,29)'
        0, 'rgb(255, 190, 11)',
        0.25, 'rgb(251, 86, 7)',
        0.5, 'rgb(255, 0, 110)',
        0.75, 'rgb(131, 56, 236)',
        1, 'rgb(58, 134, 255)'
      ]
    }
  });
}

const removeDotDensityLayer = () => {
  map.value?.removeLayer('random-dots');
  map.value?.removeSource('random-dots');
};

const loadRandomCoordinates = (boundaries: Sector[]) => {
  boundaries.forEach((boundary) => {
    //@ts-ignore
    boundary.geojson["features"].forEach((feature) => {
      generateRandomCoordinates(feature["geometry"]);
    })
  })
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





export const useMapStore = createGlobalState(() => ({map, clickProvince, color, lnglat, clickedBoundary, setupBoundaries, removeBoundaries, dotDensityLayer, loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates, resetToDefault, setupBoundariesforOrganization, clickOrganization}))
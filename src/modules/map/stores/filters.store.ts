import {ref} from "vue";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {useMapStore} from "./map.store.ts";
import {createGlobalState} from "@vueuse/core";
//@ts-ignore
import * as turf from "@turf/turf";

const {map} = useMapStore();
const dotDensityLayer = ref(false);

const numPoints = 500
const getRandomNumber = (min: number, max: number) => {
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





export const useFilterStore = createGlobalState(() => ({loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates, dotDensityLayer}))
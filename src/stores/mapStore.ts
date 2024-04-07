import {shallowRef, ref} from "vue";
import {LngLatLike, Map, Popup} from "maplibre-gl";
import {Sector} from "../interfaces/sector.interface.ts";
import {useSectorsStore} from "./sectorsStore.ts";
import {createGlobalState} from "@vueuse/core";
//@ts-ignore
import * as turf from "@turf/turf";

const {selectSector, removeSelectedSector} = useSectorsStore();

const map = shallowRef<null | Map>(null);
const dotDensityLayer = ref(false);
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
        duration: 2000
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
        0, 'rgba(5,53,5,0.1)', // Very light green
        0.25, 'rgba(0, 255, 0, 0.3)', // Light green
        0.5, 'rgba(0, 255, 0, 0.5)', // Medium green
        0.75, 'rgba(98,190,98,0.7)', // Dark green
        1, 'rgb(8,60,29)' // Very dark green
      ]
    }
  });
}

const removeDotDensityLayer = () => {
  //@ts-ignore
  map.value?.removeLayer('random-dots');
  //@ts-ignore
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



export const useMapStore = createGlobalState(() => ({map, clickProvince, color, lnglat, clickedBoundary, setupBoundaries, dotDensityLayer, loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates}))
<script setup lang="ts">
import {markRaw, onMounted, reactive, ref, shallowRef} from "vue";
import {Map, NavigationControl} from "maplibre-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf'
import {v4 as uuidv4} from "uuid";
import {useMapStore} from "../../map/stores/map.store.ts";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

const {geocoderApi} = useMapStore();
const emit = defineEmits(['setGeoJSONData', 'closeMapPreview'])
const props = defineProps({
  isGeoJSONPreview: {
    type: Boolean,
    default: false
  },
  geoJSONData: {
    type: Object
  }
})
const mapContainer = shallowRef<HTMLDivElement | null>(null);
const map = shallowRef<null | Map>(null);
const initState = reactive({
  lng: 125.05237646156849,
  lat: 7.858930800481815,
  zoom: 12
});
const coords = ref([])

const layerIDs = ref<string[]>([])

const bounds = <[number, number, number, number]>[
  102.43621431035973, 3.982590021377476,
  141.1117856896347, 21.472305228005112
];

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
})

const sqm = ref("")


const updateArea = () => {
  const data = draw.getAll();
  if (data.features.length > 0) {
    const area = turf.area(data);
    const rounded_area = Math.round(area * 100) / 100;
    sqm.value = `${rounded_area} square meters`
  } else {
    sqm.value=""
    //@ts-ignore
    if (e.type !== 'draw.delete')
      alert('Click the map to draw a polygon.');
  }
}

const handleDrawEvent = (event: any) => {
  updateArea();
  const feature = event.features[0];
  const coordinates = feature.geometry.coordinates;
  coords.value = coordinates

  // console.log(coordinates);
};

const deleteDrawnPolygons = () => {
  // Get all the drawn features from the draw layer
  const drawnFeatures = draw.getAll();

  // If there are drawn features, delete them
  if (drawnFeatures.features.length > 0) {
    drawnFeatures.features.forEach((feature: any) => {
      draw.delete(feature.id);
    });
  }
};


const convertToGeoJson = () => {
  deleteDrawnPolygons()
  const id = uuidv4();
  layerIDs.value.push(id)
  emit('setGeoJSONData', {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: coords.value
    },
    properties: {
    }
  }, true)
  emit('closeMapPreview')
  //@ts-ignore
  map.value.addSource(`geojson-source-${id}`, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coords.value
      },
      properties: {
      }
    }
  });
  //@ts-ignore
  map.value.addLayer({
    id: id,
    type: 'fill',
    source: `geojson-source-${id}`,
    paint: {
      'fill-color': '#00ACC1',
      'fill-opacity': .3
    }
  });
}

// const removeLayers = () => {
//   layerIDs.value.forEach((id) => {
//     const sourceID = `geojson-source-${id}`;
//     const layerID = id; // Assuming the layer ID is the same as the source ID
//
//     // Check if the layer exists and remove it
//     //@ts-ignore
//     if (map.value.getLayer(layerID)) {
//       //@ts-ignore
//       map.value.removeLayer(layerID);
//     }
//
//     // Check if the source exists and remove it
//     //@ts-ignore
//     if (map.value.getSource(sourceID)) {
//       //@ts-ignore
//       map.value.removeSource(sourceID);
//     }
//   });
// };


const originalOnAdd = draw.onAdd.bind(draw);
draw.onAdd = (map) => {
  const controlContainer = originalOnAdd(map);
  controlContainer.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
  return controlContainer;
};

onMounted(() => {
  //@ts-ignore
  if(mapContainer.value){
    map.value = markRaw(
        new Map({
          container: mapContainer.value,
          style: `https://api.maptiler.com/maps/topo-v2/style.json?key=slSuwEtNY8loqQWUZ9IO`,
          center: [initState.lng, initState.lat],
          zoom: initState.zoom,
          maxBounds: bounds
        })
    );
  }
  map.value?.addControl(
      new MaplibreGeocoder(geocoderApi, {})
  );
  //@ts-ignore
  map.value.addControl(new NavigationControl(), 'bottom-right');

  //@ts-ignore
  map.value.on('style.load', () => {
    if(props.isGeoJSONPreview){
      //@ts-ignore
      map.value?.addSource(`geojson-source-0`, {
        type: 'geojson',
        //@ts-ignore
        data: props.geoJSONData
      });
      //@ts-ignore
      map.value.addLayer({
        id: 'geojson-layer-0',
        type: 'fill',
        source: `geojson-source-0`,
        paint: {
          'fill-color': '#00ACC1',
          'fill-opacity': .3
        }
      });
      //@ts-ignore
      map.value?.fitBounds(
          //@ts-ignore
          turf.bbox(props.geoJSONData.geometry),
          {padding: 10, duration: 1000}
      )
    } else {
      //@ts-ignore
      map.value.addControl(draw);
      ['draw.create', 'draw.update', 'draw.delete'].forEach((eventName) => {
        //@ts-ignore
        map.value.on(eventName, handleDrawEvent);
      });
    }
  })

})

</script>

<template>
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" ref="mapContainer">
    </div>
    <button type="button" class="close-button" @click="emit('closeMapPreview')">Close Map</button>
    <div v-if="!isGeoJSONPreview" class="calculation-box">
      <div class="action-buttons">
        <button type="button" class="convert-button" @click="convertToGeoJson" v-if="coords.length > 0">Save GeoJSON</button>
<!--        <button type="button" class="delete-button" @click="removeLayers">Delete Geojsons</button>-->
      </div>
      <p class="ml-3 my-2">Click the map to draw a polygon.</p>
      <div id="calculated-area" class="ml-3">{{sqm}}</div>
    </div>
  </div>
</template>

<style scoped>
.map-wrap {
  border-radius: 16px;
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

.watermark {
  position: absolute;

}

.calculation-box {
  border-radius: 10px;
  border: 2px solid black;
  height: 150px;
  width: 400px;
  position: absolute;
  bottom: 5px;
  left: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
}

.close-button{
  color: black !important;
  border: 2px solid black;
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: rgba(225, 225, 225, 0.9);
}

button{
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 0 5px;
}

.convert-button {
  background-color: #00838F;
  transition: background-color 0.3s ease;
}

.convert-button:hover {
  background-color: #006973; /* Darker teal */
}

</style>
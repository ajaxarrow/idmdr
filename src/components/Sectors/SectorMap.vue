<script setup lang="ts">
import {markRaw, onMounted, shallowRef} from "vue";
import {LngLatLike, Map, NavigationControl} from "maplibre-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapSidebar from "../Map/MapSidebar.vue";

const mapContainer = shallowRef<HTMLDivElement | null>(null);
const map = shallowRef<null | Map>(null);
const lnglat: LngLatLike = [124.6, 7.858930800481815];

const bounds: [number, number, number, number] = [
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


const initMap = () => {
  if (mapContainer.value) {
    map.value = markRaw(
        new Map({
          container: mapContainer.value,
          style: `https://api.maptiler.com/maps/topo-v2/style.json?key=slSuwEtNY8loqQWUZ9IO`,
          center: lnglat,
          zoom: 7,
          maxBounds: bounds
        })
    );
  } else {
    console.error("Map container not found.");
  }
};

onMounted(() => {
  MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
  MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
  MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";
  initMap();
  map.value?.addControl(new NavigationControl(), 'bottom-right');
  map.value?.addControl(draw);
  ['draw.create', 'draw.update', 'draw.delete'].forEach((eventName) => {
    map.value?.on(eventName, () => {
      console.log(eventName);
    });
  });
})



</script>

<template>
  <MapSidebar :useSectorDesign="true"/>
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" ref="mapContainer">
    </div>
  </div>
</template>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

.watermark {
  position: absolute;

}
</style>
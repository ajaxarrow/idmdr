<script setup lang="ts">
import {markRaw, onMounted, shallowRef} from "vue";
import {LngLatLike, Map, NavigationControl} from "maplibre-gl";

const map = shallowRef<null | Map>(null);
const mapContainer = shallowRef<HTMLDivElement | null>(null);
const lnglat: LngLatLike = [125.05300645920158, 7.858189429069867];

const initMap = () => {
  if (mapContainer.value) {
    map.value = markRaw(
        new Map({
          container: mapContainer.value,
          style: `https://api.maptiler.com/maps/topo-v2/style.json?key=slSuwEtNY8loqQWUZ9IO`,
          center: lnglat,
          zoom: 16,
          // maxBounds: bounds
        })
    );
  } else {
    console.error("Map container not found.");
  }
};

onMounted(() => {
  initMap();
  map.value?.addControl(new NavigationControl(), 'top-right');
});
</script>

<template>
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" ref="mapContainer">
    </div>
  </div>
</template>

<style scoped>
.map-wrap {
  border-radius: 25px;
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
</style>
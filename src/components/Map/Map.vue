<script setup lang="ts">
import {markRaw, onBeforeMount, onMounted, shallowRef} from "vue";
  import {Map, NavigationControl} from "maplibre-gl";
  import MapSidebar from "./MapSidebar.vue";
  import SectorDetailsSidebar from "../Sectors/SectorDetailsSidebar.vue";
  import boundaries from "../../data/boundaries.ts";
  import {useMapStore} from "../../stores/mapStore.ts";
  import {useSectorsStore} from "../../stores/sectorsStore.ts";

  const {map, lnglat, color, setupBoundaries} = useMapStore();
  const {removeSelectedSector} = useSectorsStore();
  const mapContainer = shallowRef<HTMLDivElement | null>(null);


  const bounds: [number, number, number, number] = [
    120.5, 4.0,
    128.5, 10.0
  ];


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
    initMap();
    map.value?.addControl(new NavigationControl(), 'top-right');

    // @ts-ignore
    map.value?.on('style.load', () => {
      setupBoundaries(boundaries, 'Province');
    })
  });

  onBeforeMount(() => {
    removeSelectedSector()
  })



</script>

<template>
  <transition name="fade">
    <SectorDetailsSidebar/>
  </transition>
  <MapSidebar/>
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
        src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" ref="mapContainer">
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
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
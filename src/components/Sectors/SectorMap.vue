<script setup lang="ts">
import {markRaw, onMounted, onUnmounted, shallowRef, watch} from "vue";
import {Map, NavigationControl} from "maplibre-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapSidebar from "../Map/MapSidebar.vue";
import SectorDetailsSidebar from "./SectorDetailsSidebar.vue";
import {useMapStore} from "../../stores/mapStore.ts";
import sectors from "../../data/sectors.ts";
import boundaries from "../../data/boundaries.ts";
import MapProductionDetails from "../Map/Filters/MapFiltersDetails.vue";
import organizations from "../../data/organizations.ts";
import OrganizationDetailsSidebar from "../Map/Organizations/OrganizationDetailsSidebar.vue";
import {useSectorsStore} from "../../stores/sectorsStore.ts";

const {map, lnglat, setupBoundaries, dotDensityLayer, loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates, setupBoundariesforOrganization, clickedBoundary} = useMapStore();
const {removeSelectedSector} = useSectorsStore();
const mapContainer = shallowRef<HTMLDivElement | null>(null);


const bounds: [number, number, number, number] = [
  120.5, 4.0,
  128.5, 10.0
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
          zoom: 7.5,
          maxBounds: bounds
        })
    );
  } else {
    console.error("Map container not found.");
  }
};

watch(dotDensityLayer, (newValue) => {
  if (newValue) {
    loadDotDensityLayer();
  } else {
    removeDotDensityLayer();
  }
});

onMounted(() => {
  (MapboxDraw as any).constants = MapboxDraw.constants || {};
  (MapboxDraw.constants.classes.CONTROL_BASE as any) = "maplibregl-ctrl";
  (MapboxDraw.constants.classes.CONTROL_PREFIX as any) = "maplibregl-ctrl-";
  (MapboxDraw.constants.classes.CONTROL_GROUP as any) = "maplibregl-ctrl-group";

  initMap();
  map.value?.addControl(new NavigationControl(), 'bottom-right');
  // @ts-ignore
  map.value?.addControl(draw);
  ['draw.create', 'draw.update', 'draw.delete'].forEach((eventName) => {
    // @ts-ignore
    map.value?.on(eventName, () => {
      console.log(eventName);
    });
  });

  // @ts-ignore
  map.value?.on('style.load', () => {
    setupBoundariesforOrganization(organizations);
    setupBoundaries(sectors, 'Sector');
    loadRandomCoordinates(boundaries)
  })

})

onUnmounted(()=> {
  removeSelectedSector();
  clickedBoundary.value = '';
})






</script>

<template>
  <transition name="fade">
    <OrganizationDetailsSidebar/>
  </transition>
  <transition name="fade">
    <SectorDetailsSidebar/>
  </transition>
  <transition name="fade">
    <MapProductionDetails/>
  </transition>
  <MapSidebar :useSectorDesign="true"/>
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
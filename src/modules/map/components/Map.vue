<script setup lang="ts">
import {markRaw, onBeforeMount, onMounted, onUnmounted, shallowRef, watch} from "vue";
  import {Map, NavigationControl} from "maplibre-gl";
  import MapSidebar from "./MapSidebar.vue";
  import SectorDetailsSidebar from "../../sector/components/SectorDetailsSidebar.vue";
  import boundaries from "../../../data/boundaries.ts";
  import organizations from "../../../data/organizations.ts";
  import {useMapStore} from "../stores/map.store.ts";
  import {useSectorsStore} from "../../sector/stores/sectors.store.ts";
import MapProductionDetails from "./Filters/MapFiltersDetails.vue";
import sectors from "../../../data/sectors.ts";
import OrganizationDetailsSidebar from "./Organizations/OrganizationDetailsSidebar.vue";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useOrganizationStore} from "../../organization/stores/organization.store.ts";

  const {fetchOrganizations} = useOrganizationServices()
  const {mapOrganizations} = useOrganizationStore();
  const {map, lnglat, setupBoundaries, dotDensityLayer, loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates, setupBoundariesforOrganization, clickedBoundary} = useMapStore();
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

  watch(dotDensityLayer, (newValue) => {
    if (newValue) {
      loadDotDensityLayer();
    } else {
      removeDotDensityLayer();
    }
  });


  onMounted(async () => {
    await fetchOrganizations();
    initMap();
    map.value?.addControl(new NavigationControl(), 'top-right');

    // @ts-ignore
    map.value?.on('style.load', () => {
      setupBoundariesforOrganization(mapOrganizations.value);
      setupBoundaries(boundaries, 'Province');
      setupBoundaries(sectors, 'Sector');
      loadRandomCoordinates(boundaries);
    })




  });

  onBeforeMount(() => {
    removeSelectedSector();
  })

  onUnmounted(()=> {
    removeSelectedSector();
    clickedBoundary.value = '';
  })




</script>

<template>
  <transition name="fade">
    <SectorDetailsSidebar/>
  </transition>
  <transition name="fade">
    <OrganizationDetailsSidebar/>
  </transition>
  <transition name="fade">
    <MapProductionDetails/>
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
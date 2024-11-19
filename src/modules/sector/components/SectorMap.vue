<script setup lang="ts">
import {markRaw, onMounted, onUnmounted, ref, shallowRef, watch} from "vue";
import {Map, NavigationControl} from "maplibre-gl";
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapSidebar from "../../map/components/MapSidebar.vue";
import SectorDetailsSidebar from "./SectorDetailsSidebar.vue";
import {useMapStore} from "../../map/stores/map.store.ts";
import boundaries from "../../../data/boundaries.ts";
import MapProductionDetails from "../../map/components/Filters/MapFiltersDetails.vue";
import OrganizationDetailsSidebar from "../../map/components/Organizations/OrganizationDetailsSidebar.vue";
import {useSectorsStore} from "../stores/sectors.store.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {useOrganizationStore} from "../../organization/stores/organization.store.ts";
import {useSectorMapStore} from "../../../core/stores/sector-map.store.ts";
import {useRouting} from "../../../core/composables/useRouting.ts";
import ConfirmGeoJSONDialog from "../../../core/components/ConfirmGeoJSONDialog.vue";
import {useSectorServices} from "../services/sector.services.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";
import {useFilterStore} from "../../map/stores/filters.store.ts";
import {ChoroplethLegendControl} from "../../map/helpers/legendControl.ts"

const {fetchOrganizations} = useOrganizationServices()
const {user} = useUserStore()
const {setGeoJSONData, storedGeoJSON, confirmDialog} = useSectorMapStore()
const {mapOrganizations} = useOrganizationStore();
const {map, lnglat, setupBoundaries, setupBoundariesforOrganization, clickedBoundary, removeBoundaries} = useMapStore();
const {dotDensityLayer, loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates, limits, colorScale, provinceConsortiumsLayer, removeConsortiumLayer, loadConsortiumLayer} = useFilterStore()
const {removeSelectedSector, allSectors} = useSectorsStore();
const {fetchSectors} = useSectorServices()
const {router} = useRouting();
const mapContainer = shallowRef<HTMLDivElement | null>(null);
const coords = ref([])


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


const handleDrawEvent = (event: any) => {
  const feature = event.features[0];
  const coordinates = feature.geometry.coordinates;
  coords.value = coordinates

};

const deleteBoundary = () => {
  const allDrawnFeatures = draw.getAll();
  if (allDrawnFeatures.features.length > 0) {
    draw.deleteAll();
    coords.value = [];
  }
};

const confirmCallback = () => {
  router.push({name: 'new-sector'});
}

const saveGeoJSON = () => {
  setGeoJSONData({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: coords.value
    },
    properties: {
    }
  });
  confirmDialog.value = true
}

const cancelCallback = () => {
  storedGeoJSON.value = {};
  setTimeout(() => {
    confirmDialog.value = false
  }, 100);
}

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

const choroplethLegendControl = new ChoroplethLegendControl({
  layerId: 'bukidnon-org',
  limits: limits,
  colorScale: colorScale,
});

watch(provinceConsortiumsLayer, async (newValue) => {
  if (newValue) {
    removeConsortiumLayer()
    await loadConsortiumLayer()
    //@ts-ignore
    map.value?.addControl(choroplethLegendControl, 'bottom-right');

  } else {
    removeConsortiumLayer()
    map.value?.removeControl(choroplethLegendControl);
  }
})

onMounted(async () => {
  await fetchOrganizations();
  await fetchSectors();
  initMap();
  if(user.value){
    (MapboxDraw as any).constants = MapboxDraw.constants || {};
    (MapboxDraw.constants.classes.CONTROL_BASE as any) = "maplibregl-ctrl";
    (MapboxDraw.constants.classes.CONTROL_PREFIX as any) = "maplibregl-ctrl-";
    (MapboxDraw.constants.classes.CONTROL_GROUP as any) = "maplibregl-ctrl-group";
    map.value?.addControl(new NavigationControl(), 'top-right');
    // @ts-ignore
    map.value.addControl(draw);
    ['draw.create', 'draw.update', 'draw.delete'].forEach((eventName) => {
      //@ts-ignore
      map.value.on(eventName, handleDrawEvent);
    });
  } else {
    map.value?.addControl(new NavigationControl(), 'top-right');
  }


  // @ts-ignore
  map.value?.on('style.load', async () => {
    await loadConsortiumLayer(true)
    await setupBoundariesforOrganization(mapOrganizations.value);
    setupBoundaries(boundaries, 'Province');
    setupBoundaries(allSectors.value, 'Sector');
    loadRandomCoordinates(boundaries)

  })

  // @ts-ignore
  map.value?.on('draw.modechange', (event) => {
    const { mode } = event;
    if (mode === 'draw_polygon' || mode === 'draw_line_string') {
      removeBoundaries(boundaries);
    } else {
      setupBoundaries(boundaries, 'Province');
    }
  });

})


onUnmounted(()=> {
  removeSelectedSector();
  clickedBoundary.value = '';
})



</script>

<template>
  <ConfirmGeoJSONDialog
      @cancelCallback="cancelCallback"
      @confirmCallback="confirmCallback"
  />
  <transition name="fade">
    <OrganizationDetailsSidebar/>
  </transition>
  <transition name="fade">
    <SectorDetailsSidebar/>
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
  <div v-if="coords.length > 0" class="calculation-box">
    <p class="ml-3 my-2">You have created a polygon! Want to tag it to an entity?</p>
    <div  class="action-buttons">
      <button type="button" class="convert-button" @click="saveGeoJSON">Tag Boundary</button>
      <button type="button" class="delete-button" @click="deleteBoundary">Delete Boundary</button>
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

.calculation-box {
  border-radius: 10px;
  border: 2px solid #e4e4e4;
  height: 150px;
  width: 400px;
  position: absolute;
  bottom: 25px;
  left: 125px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  box-shadow: 0px 0px 7px 0px #5d6e87;
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

.delete-button {
  background-color: #F15F79;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c94b63; /* Darker pink */
}



</style>
<script setup lang="ts">
import {markRaw, onBeforeMount, onMounted, ref, shallowRef} from "vue";
  import {Map, NavigationControl, Popup} from "maplibre-gl";
  import MapSidebar from "./MapSidebar.vue";
  import SectorDetailsSidebar from "../Sectors/SectorDetailsSidebar.vue";
  import boundaries from "../../data/boundaries.ts";
  import {Sector} from "../../interfaces/sector.interface.ts";
  import {useMapStore} from "../../stores/mapStore.ts";
  import {useSectorsStore} from "../../stores/sectorsStore.ts";

  const {map, clickProvince, clickedBoundary, lnglat, color} = useMapStore();
  const {removeSelectedSector} = useSectorsStore();
  const mapContainer = shallowRef<HTMLDivElement | null>(null);
  const popup = ref<Popup | null>(new Popup({
    closeButton: false,
    closeOnClick: false,
  }));

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
      boundaries.forEach((boundary: Sector) => {
        // @ts-ignore
        map.value?.addSource(boundary.title, {
          type: 'geojson',
          data: boundary.geo_json,
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
          clickProvince(boundary)

        });

      });

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
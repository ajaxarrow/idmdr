import {ref} from "vue";
import {Sector} from "../../../interfaces/sector.interface.ts";
import {useMapStore} from "./map.store.ts";
import {createGlobalState} from "@vueuse/core";
//@ts-ignore
import * as turf from "@turf/turf";
import boundaries from "../../../data/boundaries.ts";
import chroma from "chroma-js";
import {Organization} from "../../../interfaces/organization.interface.ts";
import {useObjectChecker} from "../../../core/composables/useObjectChecker.ts";
import {useOrganizationServices} from "../../organization/services/organization.services.ts";
import {Popup} from "maplibre-gl";
import {useRepositoryServices} from "../../repository/services/repository.services.ts";
import {useUserStore} from "../../../core/stores/user.store.ts";

const {isEmptyObject} = useObjectChecker()
const {user} = useUserStore()
const {map} = useMapStore();
const popup = ref<Popup | null>(new Popup({
  closeButton: false,
  closeOnClick: false,
}));
const dotDensityLayer = ref(false);
const provinceConsortiumsLayer = ref(false);
const provinceRepositoriesLayer = ref(false);

const numPoints = 500
const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

const randomPoints = ref([])
const {fetchOrganizations} = useOrganizationServices()
const {fetchRepositoriesByOrganization} = useRepositoryServices()

const fetchOrgCountPerProvinces = async (publicOrgs: Organization[]) => {
  boundaries.forEach((boundary: any) => {
    const selectedOrgs = ref<Organization[]>([]);

    const multiPolygon = turf.multiPolygon(
      boundary.geojson.features.map((feature: any) => feature.geometry.coordinates)
    );

    publicOrgs.forEach(org => {
      if(!isEmptyObject(org.geojson)) {
        const point = turf.centroid(org.geojson)
        if(turf.booleanPointInPolygon(point, multiPolygon.geometry)) {
          selectedOrgs.value.push(org)
        }
      }
    })
    // @ts-ignore
    vizData.value[`${boundary.slug}-org`].organizations = selectedOrgs.value.length
  })
}

const fetchRepoCountPerProvinces = async (publicOrgs: Organization[]) => {

  boundaries.forEach((boundary: any) => {
    const selectedOrgs = ref<Organization[]>([]);

    const multiPolygon = turf.multiPolygon(
      boundary.geojson.features.map((feature: any) => feature.geometry.coordinates)
    );

    publicOrgs.forEach(org => {
      if(!isEmptyObject(org.geojson)) {
        const point = turf.centroid(org.geojson)
        if(turf.booleanPointInPolygon(point, multiPolygon.geometry)) {
          selectedOrgs.value.push(org)
        }
      }
    })

    selectedOrgs.value.forEach(org => {
      fetchRepositoriesByOrganization(org.uid as string, !!user.value, 100).then((repos: any = []) => {
        const repoCount = Array.isArray(repos) ? repos.length : 0;
        const key = `${boundary.slug}-org`;

        // @ts-ignore
        if (!vizData.value[key]) {
          // @ts-ignore
          vizData.value[key] = { repositories: 0 };
        }

        // @ts-ignore
        if (!vizData.value[key].repositories || isNaN()) {
          // @ts-ignore
          vizData.value[key].repositories = 0;
        }

        // @ts-ignore
        vizData.value[key].repositories += repoCount;
      });
    });


    // @ts-ignore
    vizData.value[`${boundary.slug}-org`].organizations = selectedOrgs.value.length
  })
}


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


const vizData = ref({
  'bukidnon-org': { name: 'Bukidnon', organizations: 7, repositories: 0},
  'camiguin-org': { name: 'Camiguin', organizations: 0, repositories: 0},
  'lanao-del-norte-org': { name: 'Lanao del Norte', organizations: 0, repositories: 0},
  'misamis-occidental-org': { name: 'Misamis Occidental', organizations: 0, repositories: 0},
  'misamis-oriental-org': { name: 'Misamis Oriental', organizations: 0, repositories: 0},
})




const organizationData = Object.keys(vizData.value).reduce((agg, id) => {
  // @ts-ignore
  agg.push(vizData.value[id].organizations);
  return agg;
}, []);

const getPrecision = (num: number): number => {
  const digits = Math.floor(num).toString().length;
  return Math.pow(10, digits - 1);
};

const roundDown = (num: number, precision: number = 0): number => {
  num = parseFloat(num.toString());
  return precision ? Math.floor(num / precision) * precision : num;
};



const roundLimits = (limits: number[]): number[] =>
  limits.map((num) => {
    const precision = getPrecision(num);
    return roundDown(num, precision);
  });

const limits = roundLimits(chroma.limits(organizationData, 'e', 4));
//chroma color scale
const colorScale = chroma.scale(['rgba(222,235,247,1)', 'rgba(49,130,189,1)']).mode('lch').colors(5);
const colorScalePink = chroma.scale(['rgba(255,230,239,1)', 'rgba(219,112,147,1)']).mode('lch').colors(5);



const createPaintColor = (limits: number[], colorScale: string[]): Record<number, string> => {
  const stepObject: Record<number, string> = {};

  // Loop through the limits and colorScale to create the step object
  for (let i = 0; i < limits.length; i++) {
    stepObject[limits[i]] = colorScale[i];
  }

  // Return the step object with limits and corresponding colors
  return stepObject;
};



// const setProvince = () => {
//   // @ts-ignore
//   // data.forEach(
//   //   (feature: any) => {
//   //     console.log(feature.properties.ID_2)
//   //     const province = feature.properties.PROVINCE;
//   //     // Check if there's a corresponding entry in vizData for the province
//   //     const vizKey = province.toLowerCase().replace(/ /g, '-') + '-org';
//   //     // @ts-ignore
//   //     const organizationCount = vizData[vizKey].organizations;
//   //
//   //     // Set the feature state for the current feature based on the province data
//   //     map.value?.setFeatureState(
//   //       {
//   //         source: 'provinceData',
//   //         id: feature.properties.ID_2
//   //       },
//   //       {
//   //         hello: 'hi',
//   //         organizations: organizationCount
//   //       }
//   //     );
//   //   }
//   // )
//
//   // if(data?.length !== 0) {
//   //   //@ts-ignore
//   //   map.value?.off('data', afterLoad)
//   // }
// }

const getColorForPopulation = (stepObject: Record<number, string>, population: number): string => {
  // Sort the limits to ensure we go through the ranges in ascending order
  const limits = Object.keys(stepObject).map(Number).sort((a, b) => a - b);

  // Check if the population is within the first range (0 to the first limit)
  if (population <= limits[0]) {
    return stepObject[limits[0]];
  }

  // Loop through the limits to find the corresponding color
  for (let i = 0; i < limits.length; i++) {
    if (population <= limits[i]) {
      return stepObject[limits[i]];
    }
  }

  return stepObject[limits[limits.length - 1]];
};


const loadConsortiumLayer = async (transparent: boolean = false) => {

  const orgs = await fetchOrganizations()
  await fetchOrgCountPerProvinces(orgs)
  await fetchRepoCountPerProvinces(orgs)
  console.log(vizData.value)
  const paintColor = createPaintColor(limits, colorScale);

  boundaries.forEach((boundary: any) => {

    // @ts-ignore
    const population = vizData.value[`${boundary.slug}-org`].organizations;
    const fillColor = getColorForPopulation(paintColor, population);

    map.value?.addSource(boundary.slug, {
      type: 'geojson',
      data: boundary.geojson,
    });

    // @ts-ignore
    map.value?.addLayer({
      id: `${boundary.slug}-org`,
      type: 'fill',
      source: boundary.slug,
      layout: {},

      'paint': {
        // @ts-ignore
        'fill-color': fillColor,
        'fill-opacity': transparent ? 0 : 1,
        'fill-outline-color': '#000',
      },
    });

    if(!transparent){
      map.value?.on('mouseover', `${boundary.slug}-org`, (e) => {
        const popupContent = `<h4>${boundary.name}</h4>
                              <p>${population} CMIs</p>`
        popup.value?.setHTML(popupContent);
        popup.value?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        popup.value?.addTo(map.value!);
      });

      map.value?.on('mouseleave', `${boundary.slug}-org`, () => {
        popup.value?.remove();
      });
    }

  });
}

const loadConsortiumRepoLayer = async (transparent: boolean = false) => {

  const orgs = await fetchOrganizations()
  await fetchRepoCountPerProvinces(orgs)
  console.log(vizData.value)
  const paintColor = createPaintColor(limits, colorScalePink);

  boundaries.forEach((boundary: any) => {

    // @ts-ignore
    const repositories = vizData.value[`${boundary.slug}-org`].repositories;
    const fillColor = getColorForPopulation(paintColor, repositories);

    map.value?.addSource(boundary.slug, {
      type: 'geojson',
      data: boundary.geojson,
    });

    // @ts-ignore
    map.value?.addLayer({
      id: `${boundary.slug}-org`,
      type: 'fill',
      source: boundary.slug,
      layout: {},

      'paint': {
        // @ts-ignore
        'fill-color': fillColor,
        'fill-opacity': transparent ? 0 : 1,
        'fill-outline-color': '#000',
      },
    });

    if(!transparent){
      map.value?.on('mouseover', `${boundary.slug}-org`, (e) => {
        const popupContent = `<h4>${boundary.name}</h4>
                              <p>${repositories} Projects</p>`
        popup.value?.setHTML(popupContent);
        popup.value?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        popup.value?.addTo(map.value!);
      });

      map.value?.on('mouseleave', `${boundary.slug}-org`, () => {
        popup.value?.remove();
      });
    }
  });
}


const removeConsortiumLayer = () => {
  boundaries.forEach((boundary: any) => {
    if (map.value?.getLayer(`${boundary.slug}-org`)) {
      map.value?.removeLayer(`${boundary.slug}-org`);
    }
    // Remove the source associated with the boundary
    if (map.value?.getSource(boundary.slug)) {
      map.value?.removeSource(boundary.slug);
    }
    popup.value?.remove();
  });
}




export const useFilterStore = createGlobalState(() => ({loadDotDensityLayer, removeDotDensityLayer, loadRandomCoordinates, dotDensityLayer, limits, colorScale, vizData, provinceConsortiumsLayer, loadConsortiumLayer, removeConsortiumLayer, loadConsortiumRepoLayer, provinceRepositoriesLayer, colorScalePink}))
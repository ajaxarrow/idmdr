import {ref} from "vue";
import {createGlobalState} from "@vueuse/core";

const storedGeoJSON = ref<any>({})
const fileName = ref('');
const confirmDialog = ref(false);

const setGeoJSONData = (geojson: any) => {
  storedGeoJSON.value = geojson
}

const setFileName = (name: string) => {
  fileName.value = name
}

const clearMapData = () => {
  storedGeoJSON.value = {}
  fileName.value = ''
}

const handleGeoJSON = (e: any) => {
  const file = e.target.files[0]
  if (file && file.type === 'application/json') {
    const reader = new FileReader()
    fileName.value = file.name

    reader.onload = (e) => {
      try {
        if(e.target){
          if (typeof e.target.result === "string") {
            const jsonData = JSON.parse(e.target.result)
            storedGeoJSON.value = jsonData
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }
    reader.readAsText(file)
  } else {
    console.error('Please select a valid JSON file.')
  }
}

export const useSectorMapStore = createGlobalState(() => ({storedGeoJSON, setGeoJSONData, setFileName, clearMapData, fileName, handleGeoJSON, confirmDialog}))
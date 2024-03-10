// @ts-ignore
import {computed, ref} from "vue";
import {createGlobalState} from "@vueuse/core";

const isCollapsed = ref(true);

const toggleMainSidebar = () => {
  console.log("triggered")
  isCollapsed.value = !isCollapsed.value
}



export const useToggleMainSidebar = createGlobalState(() => ({isCollapsed, toggleMainSidebar}))

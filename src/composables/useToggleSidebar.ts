// @ts-ignore
import {computed, ref} from "vue";
import {createGlobalState} from "@vueuse/core";
import {useScreenStore} from "../stores/screenSizeStore.ts";

const {isMobile, isLargePhone} = useScreenStore();

const isCollapsed = ref(false);
const showMainSidebarMobile = ref(false);
const showProfileSidebar = ref(false);

const toggleMainSidebarMobile = () => {
  showMainSidebarMobile.value = !showMainSidebarMobile.value
}

const toggleMainSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleProfileSidebar = () => {
  showProfileSidebar.value = !showProfileSidebar.value
}

const toggleSidebar = () => {
  if(isMobile.value || isLargePhone.value){
    toggleMainSidebarMobile()
  } else {
    toggleMainSidebar()
  }
}


export const useToggleSidebar = createGlobalState(() => ({isCollapsed, toggleMainSidebar, toggleMainSidebarMobile, toggleSidebar, showMainSidebarMobile, toggleProfileSidebar, showProfileSidebar}))

// @ts-ignore
import {computed, ref} from "vue";

export const useToggleMenu = () => {
  const isCollapsed = ref(false);

  const toggleMainSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  return {isCollapsed, toggleMainSidebar}
}
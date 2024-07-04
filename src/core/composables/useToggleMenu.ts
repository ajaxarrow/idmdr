// @ts-ignore
import {computed, ref} from "vue";
import {IconMenuDeep, IconX} from "@tabler/icons-vue";

export const useToggleMenu = () => {
  const isMenuToggled = ref(false);

  const activeIcon = computed(() => (isMenuToggled.value ? IconX : IconMenuDeep));

  const toggleMenu = () => {
    isMenuToggled.value = !isMenuToggled.value
  }

  return {isMenuToggled, activeIcon, toggleMenu}
}
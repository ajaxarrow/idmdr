import { createGlobalState } from '@vueuse/core';
import { useBreakpoints } from '@vueuse/core';
import {ref} from "vue";

const breakpoints = useBreakpoints({
    mobile: 476,
    tablet: 768,
    largeTablet: 960,
    laptop: 1024,
    desktop: 1280,
});

const isMobile = ref(breakpoints.smaller('mobile'));
const isSmall = ref(breakpoints.smaller('largeTablet'));
const isLargePhone = ref(breakpoints.between('mobile', 'tablet'));
const isTablet = ref(breakpoints.between('tablet', 'laptop'));
const isLaptop = ref(breakpoints.between('laptop', 'desktop'));
const isDesktop = ref(breakpoints.greater('desktop'));

export const useScreenStore = createGlobalState(() => ({ isMobile, isLargePhone, isTablet, isLaptop, isDesktop, isSmall }));

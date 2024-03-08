import { createGlobalState } from '@vueuse/core';
import { useBreakpoints } from '@vueuse/core';

const breakpoints = useBreakpoints({
    mobile: 476,
    tablet: 768,
    largeTablet: 960,
    laptop: 1024,
    desktop: 1280,
});

const isMobile = breakpoints.smaller('mobile');
const isSmall = breakpoints.smaller('largeTablet')
const isLargePhone = breakpoints.between('mobile', 'tablet')
const isTablet = breakpoints.between('tablet', 'laptop');
const isLaptop = breakpoints.between('laptop', 'desktop');
const isDesktop = breakpoints.greater('desktop');

export const useScreenStore = createGlobalState(() => ({ isMobile, isLargePhone, isTablet, isLaptop, isDesktop, isSmall }));

import {ref} from "vue";
import {createGlobalState} from "@vueuse/core";

const isPageLoading = ref(true);

export const usePageLoadingStore = createGlobalState(() => ({isPageLoading}));
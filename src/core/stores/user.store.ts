import {reactive, ref} from "vue";
import {createGlobalState} from "@vueuse/core";

// @ts-ignore
const user = ref(JSON.parse(localStorage.getItem('user')));

const userData = reactive({
  email: user.value ? 'd' : '',
  username: user.value ? 'd' : ''
  // email: user.value ? user.value.user.email : '',
  // username: user.value ? user.value.user.username : ''
});

export const useUserStore = createGlobalState(() => ({ user, userData}));
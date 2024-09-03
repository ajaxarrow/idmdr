import {reactive, ref} from "vue";
import {createGlobalState} from "@vueuse/core";

// @ts-ignore
const user = ref(JSON.parse(localStorage.getItem('user')));

const userData = reactive({
  // email: user.value.user.email ? user.value.user.email : 'user@example.com',
  // username: user.value.user.username ? user.value.user.username : 'User',
  // profilePicture: user.value.user.profile_picture ? user.value.user.profile_picture : 'https://mighty.tools/mockmind-api/content/abstract/46.jpg'
  email: user.value ? user.value.user.email : '@guestuser',
  username: user.value ? user.value.user.username : 'Guest User',
  profilePicture: user.value ? user.value.user.profile_picture : 'https://mighty.tools/mockmind-api/content/abstract/46.jpg',
  uid: user.value ? user.value.user.uid: '',
  accessToken: user.value ? user.value.accessToken : '',
  refreshToken: user.value ? user.value.refreshToken : '',
});

export const useUserStore = createGlobalState(() => ({ user, userData}));
import {useUserStore} from "../../../core/stores/user.store.ts";
import {server} from "../../../plugins/axios.ts";
import {Router} from "vue-router";
import {createGlobalState} from "@vueuse/core";

const {user} = useUserStore();

const handleGithub = async (code: string, state: string, router: Router) => {
  try{
    const res = await server.get(`/api/github-oauth2/login/raw/callback/?code=${code}&state=${state}`)
    const user = {
      user: res.data.user,
      accessToken: res.data.access,
      refreshToken: res.data.refresh
    }
    localStorage.setItem('user', JSON.stringify(user));
    await router.push({path: '/dashboard'})
    setTimeout(() => {
      router.push({path: '/dashboard'})
    }, 1000);
  } catch (e) {
    console.log(e)
  }
}

const handleGoogle = async (code: string, state: string, router: Router) => {
  try{
    const res = await server.get(`/api/google-oauth2/login/raw/callback/?code=${code}&state=${state}`)
    const user = {
      user: res.data.user,
      accessToken: res.data.access,
      refreshToken: res.data.refresh
    }
    localStorage.setItem('user', JSON.stringify(user));
    await router.push({path: '/dashboard'})
    setTimeout(() => {
      router.push({path: '/dashboard'})
    }, 1000);
  } catch (e) {
    console.log(e)
  }
}

const handleLogout = async (router: Router) => {
  localStorage.removeItem('user');
  user.value = null
  await router.push({name: 'landing'});
}

export const useAuthStore = createGlobalState(() => ({ user, handleGithub, handleGoogle, handleLogout}));
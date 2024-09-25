import router from "../router";
import {useUserStore} from "../core/stores/user.store.ts";

export const useMiddleware = () => {
  const {user} = useUserStore();
  const checkIfAuthenticated = () => {
    if(!user.value){
      router.push({path: '/'});
    }
  }

  const checkAuth = () => {
    if(user.value){
      router.push({path: '/'});
    }
    else{
      // console.log('not authenticated')
    }
  }


  return {checkIfAuthenticated, checkAuth}
}
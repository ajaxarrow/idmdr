import router from "../router";
import {useUserStore} from "../core/stores/user.store.ts";

export const useMiddleware = () => {
  const {user, userData} = useUserStore();
  const checkIfAuthenticated = () => {
    if(!user.value || !userData.is_approved){
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